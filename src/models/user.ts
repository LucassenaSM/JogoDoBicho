import { Persons } from "./persons";

export class User extends Persons {

    constructor(name: string, email: string, cpf: string, balance: number) {
        super(name, email, cpf, balance);
    }

    public displayName(): string {
        return `User Info: Name=${this.name}, Email=${this.email}, Balance=${this.balance}`;  
    }
  }