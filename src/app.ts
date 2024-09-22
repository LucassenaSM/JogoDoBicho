import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import { Transaction } from "./models/transaction";
import { TransactionService } from "./services/transaction.service";
import { OrdensService } from "./services/ordens.service";
import { Ordens } from "./models/ordens";
// import { Raffle } from "./models/raffle";
import { RaffleService } from "./services/raffle.service";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);

const prisma = new PrismaClient();

async function index() {
  const ordensService = new OrdensService();
  const transactionService = new TransactionService();
  const raffleService = new RaffleService();

  const valor = 40;

  try {
    // const raffle = new Raffle(new Date('2024-09-25'), new Date('2024-09-25T18:00:00'), "", undefined, undefined, undefined, "", undefined, undefined);

    // await raffleService.CreateRaffle(raffle);

    const depositTransaction = new Transaction(valor, "123.456.789-00");
    const depositResult = await transactionService.addDeposit(
      depositTransaction
    );
    console.log(depositResult);

    const animalTypes = ["dog", "cat", "deer", "deer"];
    const orderValue = 20; 
    await prisma.ordens.deleteMany({});
    for (let i = 0; i < 15; i++) {
      // Cria 10 ordens de cada tipo
      for (const type of animalTypes) {
        const ordens = new Ordens(type, orderValue, "123.456.789-00", 1);

        try {
          await ordensService.createOrder(ordens);
        } catch (error) {
          console.error(`Erro ao criar ordem para ${type}:`, error);
        }
      }
    }

    const chance = await raffleService.draw(1);
    console.log(chance);


    const withdrawTransaction = new Transaction(valor, "123.456.789-00");
    const fim = await transactionService.withdraw(withdrawTransaction);
    console.log(fim);

    await prisma.user.update({
      where: {
        cpf: "123.456.789-00",
      },
      data: {
        balance: 0,
      },
    });

  } catch (error) {
    console.error("Erro:", error);
  }
}

index();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
