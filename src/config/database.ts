// import { Client } from 'pg';

// export const client = new Client({
//   user: 'root',
//   host: 'localhost',
//   database: 'jogodobicho',
//   password: 'admin',
//   port: 3306,
// });

// client.connect();

export class Database {
  private users = new Map<string, { cpf: string, balance: number }>();

  constructor() {
    // Adiciona um exemplo de usuário
    this.users.set("123.456.789-00", { cpf: "123.456.789-00", balance: 10000 });
  }

  // Busca usuário por CPF
  public async findUserByCPF(cpf: string) {
    return this.users.get(cpf);
  }

  // Atualiza o saldo do usuário
  public async updateBalance(cpf: string, amount: number): Promise<number> {
    const user = this.users.get(cpf);
    if (user) {
        user.balance += amount;
        return user.balance;
    }
    console.log(`Usuário não encontrado para CPF ${cpf}`);
    return 0;
}

public async getBalance(cpf: string): Promise<number> {
    const user = this.users.get(cpf); 
    return user ? user.balance : 0;
}
}
