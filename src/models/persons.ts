export class Persons {
   
    public name: string;
    public email: string;
    public cpf : string;
    public balance: number;

    constructor(name: string, email: string, cpf: string, balance: number) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.balance = balance
    }
}