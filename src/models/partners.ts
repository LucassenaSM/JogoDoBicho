import { Persons } from "./persons";

export class Partners extends Persons {
    public participation: number;

    constructor(name: string, email: string, cpf: string, balance: number, participation: number) {
        super(name, email, cpf, balance);
        this.participation = participation;
    }

    public displayName(): string {
        return `partner Info: Name=${this.name}, Email=${this.email}, Balance=${this.balance}, participation=${this.participation}`;  
    }
  }