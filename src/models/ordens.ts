export class Ordens {
    public animal: string;
    public value: number;
    public cpf: string;
    public raffleId: number;

    constructor(animal: string, value: number, cpf: string, raffleId: number) {
        this.animal = animal
        this.value = value
        this.cpf = cpf;
        this.raffleId = raffleId
    }

}