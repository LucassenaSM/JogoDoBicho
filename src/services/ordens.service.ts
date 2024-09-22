import { Ordens } from "./../models/ordens";
import { Transaction } from "./../models/transaction";
import { TransactionService } from "../services/transaction.service";
import { PrismaClient } from "@prisma/client";

export class OrdensService {
  private prisma: PrismaClient;
  private transactionService: TransactionService;

  constructor() {
    this.prisma = new PrismaClient();
    this.transactionService = new TransactionService();
  }

  public async createOrder(ordens: Ordens): Promise<string> {
    try {
      const withdrawTransaction = new Transaction(ordens.value, ordens.cpf);
      const balance = await this.transactionService.getBalance(
        withdrawTransaction
      );

      if (balance < ordens.value) {
        return `Saldo insuficiente para a compra. Saldo atual: R$${balance}`;
      }

      const user = await this.prisma.user.findUnique({
        where: { cpf: withdrawTransaction.cpf },
      });

      if (!user) {
        return "Usuário não encontrado.";
      }

      try {
        const raffle = await this.prisma.raffle.findUnique({
          where: {
            id: ordens.raffleId,
          },
        });

        if (!raffle) {
          throw new Error(`Raffle with id ${ordens.raffleId} does not exist.`);
        }

        await this.prisma.ordens.create({
          data: {
            animal: ordens.animal,
            value: ordens.value,
            cpf: ordens.cpf,
            raffleId: ordens.raffleId,
          },
        });
      } catch (error) {
        console.error("Erro ao criar a ordem:", error);
        throw new Error("Não foi possível criar a ordem.");
      }

      const updatedUser = await this.transactionService.withdraw(
        withdrawTransaction
      );

      return `Pedido feito com sucesso no valor de R$${ordens.value} para o ${ordens.animal}. Saldo atual: R$${updatedUser}`;
    } catch (error) {
      const err = error as Error;
      return `Erro ao processar a compra do ${ordens.animal}: ${err.message}`;
    }
  }
}
