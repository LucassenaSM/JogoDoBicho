import { PrismaClient } from "@prisma/client";
import { Transaction } from "./../models/transaction";
import { TransactionService } from "../services/transaction.service";
import { Raffle } from "../models/raffle";

interface AnimalCounts {
  deer: number;
  cat: number;
  dog: number;
}

interface PrizeAndDividends {
  prize: number;
  dividend: number;
}

export class RaffleService {
  private prisma: PrismaClient;
  private transactionService: TransactionService;

  constructor() {
    this.prisma = new PrismaClient();
    this.transactionService = new TransactionService();
  }

  public async CreateRaffle(raffle: Raffle) {
    const raffleData = {
      date: raffle.date,
      time: raffle.time,
      prize: raffle.prize || 0,
      dividend: raffle.dividend || 0,
      totalBet: raffle.totalBet || 0,
      animal: raffle.animal || "",
      winners: {
        create:
          raffle.winners?.map((winner) => ({
            name: winner.name,
            raffleId: winner.raffleId,
          })) || [],
      },
      ordens: {
        create:
          raffle.ordens?.map((ordem) => ({
            animal: ordem.animal,
            value: ordem.value,
            cpf: ordem.cpf,
            raffleId: ordem.raffleId,
          })) || [],
      },
    };

    const createdRaffle = await this.prisma.raffle.create({
      data: raffleData,
      include: {
        winners: true,
        ordens: true,
      },
    });
    console.log(createdRaffle);
  }

  public async AmountAnimals(RaffleId: number): Promise<AnimalCounts> {
    const orders = await this.prisma.ordens.findMany({
      where: {
        raffleId: RaffleId,
      },
    });
    const counts: AnimalCounts = {
      deer: 0,
      cat: 0,
      dog: 0,
    };

    orders.forEach((order) => {
      if (order.animal === "deer") counts.deer++;
      else if (order.animal === "cat") counts.cat++;
      else if (order.animal === "dog") counts.dog++;
    });
    console.log(counts);
    return counts;
  }

  public async CalculateTotal(amountAnimals: AnimalCounts): Promise<number> {
    let total = amountAnimals.deer + amountAnimals.cat + amountAnimals.dog;
    total = total * 20;
    return total;
  }

  public async CalculatePrizeAndDividends(
    totalReceived: number,
    winner: string
  ): Promise<PrizeAndDividends> {
    const orders = await this.prisma.ordens.findMany({
      where: {
        animal: winner,
      },
    });
    let prize;
    let dividend;
    const totalOrdens = orders.length;
    if (totalOrdens == 0) {
      prize = 0;
      dividend = totalReceived;
    } else {
      dividend = totalReceived * 0.5;
      prize = (totalReceived * 0.5) / totalOrdens;
    }

    return { dividend: dividend, prize: prize };
  }

  public async CalculateChance(
    amountAnimals: AnimalCounts
  ): Promise<AnimalCounts> {
    const totalAnimals =
      amountAnimals.deer + amountAnimals.cat + amountAnimals.dog;

    if (totalAnimals === 0) {
      return { deer: 0, cat: 0, dog: 0 };
    }

    const deerChance = 1 / (amountAnimals.deer + 1);
    const catChance = 1 / (amountAnimals.cat + 1);
    const dogChance = 1 / (amountAnimals.dog + 1);

    const totalChances = deerChance + catChance + dogChance;

    return {
      deer: deerChance / totalChances,
      cat: catChance / totalChances,
      dog: dogChance / totalChances,
    };
  }

  public async DrawWinner(amountAnimals: AnimalCounts): Promise<string> {
    const chances = await this.CalculateChance(amountAnimals);
    const rand = Math.random();
    let cumulativeProbability = 0;

    if (rand < (cumulativeProbability += chances.deer)) {
      return "deer";
    } else if (rand < (cumulativeProbability += chances.cat)) {
      return "cat";
    } else if (rand < (cumulativeProbability += chances.dog)) {
      return "dog";
    } else {
      throw new Error("Erro no sorteio: Nenhum vencedor determinado.");
    }
  }

  public async Payment(winner: string, prize: number, dividend: number) {
    const orders = await this.prisma.ordens.findMany({
      where: {
        animal: winner,
      },
    });

    orders.forEach((order) => {
      const addProfit = new Transaction(prize, order.cpf);
      this.transactionService.addProfit(addProfit);
    });

    const partners = await this.prisma.partner.findMany();

    partners.forEach((partner) => {
      const profit =
        (dividend / partners.length) * (partner.participation / 100);
      const addProfit = new Transaction(profit, partner.cpf);
      this.transactionService.addDividend(addProfit);
    });
  }

  public async Winners(winner: string): Promise<string[]> {
    const orders = await this.prisma.ordens.findMany({
      where: {
        animal: winner,
      },
    });
    const userNames: string[] = [];

    for (const order of orders) {
      const user = await this.prisma.user.findUnique({
        where: {
          cpf: order.cpf,
        },
        select: {
          name: true,
        },
      });

      if (user) {
        userNames.push(user.name);
      }
    }

    return userNames;
  }

  public async draw(raffleId: number): Promise<string> {
    const amountAnimals = await this.AmountAnimals(raffleId);
    const total = await this.CalculateTotal(amountAnimals);

    if (total < 40) {
      return "Sem o valor mínimo para o sorteio";
    } else {
      const winner = await this.DrawWinner(amountAnimals);
      const divider = await this.CalculatePrizeAndDividends(total, winner);

      await this.Payment(winner, divider.prize, divider.dividend);

      const orders = await this.prisma.ordens.findMany({
        where: {
          raffleId: raffleId, 
        },
      });

      const winnerNames = await this.Winners(winner);

      console.log("Winners:", winnerNames);
      await this.prisma.raffle.update({
        where: { id: raffleId },
        data: {
          totalBet: total,
          prize: divider.prize,
          dividend: divider.dividend,
          animal: winner,
          winners: {
            create: winnerNames.map((name) => ({
              name, 
            })),
          },
          ordens: {
            connect: orders.map((order) => ({ id: order.id })),
          },
        },
      });
      
      return `total: R$${total} || Premio por Usuário: R$${divider.prize.toFixed(
        2
      )} || dividendos: R$${divider.dividend.toFixed(2)} || animal: ${winner}`;
    }
  }
}
