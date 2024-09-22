import { Transaction } from "../models/transaction";
import { PrismaClient } from "@prisma/client";

export class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async addDeposit(transaction: Transaction): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { cpf: transaction.cpf },
    });

    if (!user) {
      return "Usuário não encontrado.";
    }

    const updatedBalance = await this.prisma.user.update({
      where: { cpf: transaction.cpf },
      data: {
        balance: { increment: transaction.value },
        transactions: {
          create: {
            value: transaction.value,
            cpf: transaction.cpf,
            type: "Deposit",
          },
        },
      },
    });

    return `Depósito de R$${
      transaction.value
    } realizado com sucesso. Saldo atual: R$${updatedBalance.balance.toFixed(
      2
    )}`;
  }

  public async withdraw(transaction: Transaction): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { cpf: transaction.cpf },
    });

    if (!user) {
      return "Usuário não encontrado.";
    }

    if (user.balance < transaction.value) {
      return `Saldo insuficiente para o saque. Saldo atual: R$${user.balance}`;
    }

    const updatedBalance = await this.prisma.user.update({
      where: { cpf: transaction.cpf },
      data: {
        balance: { decrement: transaction.value },
        transactions: {
          create: {
            value: transaction.value,
            cpf: transaction.cpf,
            type: "Withdraw",
          },
        },
      },
    });

    return `Saque de R$${
      transaction.value
    } realizado com sucesso. Saldo atual: R$${updatedBalance.balance.toFixed(
      2
    )}`;
  }

  public async addProfit(transaction: Transaction): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { cpf: transaction.cpf },
    });

    if (!user) {
      return "Usuário não encontrado.";
    }

    const updatedBalance = await this.prisma.user.update({
      where: { cpf: transaction.cpf },
      data: {
        balance: { increment: transaction.value },
        transactions: {
          create: {
            value: transaction.value,
            cpf: transaction.cpf,
            type: "Profit",
          },
        },
      },
    });

    return `Lucro de R$${transaction.value} adicionado na conta(${
      transaction.cpf
    }) com sucesso. Saldo atual: R$${updatedBalance.balance.toFixed(2)}`;
  }

  public async addDividend(transaction: Transaction): Promise<string> {
    const Partner = await this.prisma.partner.findUnique({
      where: { cpf: transaction.cpf },
    });

    if (!Partner) {
      return "Usuário não encontrado.";
    }

    const updatedBalance = await this.prisma.partner.update({
      where: { cpf: transaction.cpf },
      data: {
        balance: { increment: transaction.value },
        transactions: {
          create: {
            value: transaction.value,
            cpf: transaction.cpf,
            type: "dividend",
          },
        },
      },
    });

    return `Participação de R$${transaction.value} adicionado na conta(${
      transaction.cpf
    }) com sucesso. Saldo atual: R$${updatedBalance.balance.toFixed(2)}`;
  }

  public async getBalance(transaction: Transaction): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { cpf: transaction.cpf },
    });

    if (!user) {
      return 0;
    }

    return user.balance;
  }
}
