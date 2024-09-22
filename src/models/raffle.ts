import { Winner } from "./winners";
import { Ordens } from "./ordens";

export class Raffle {
    public date: Date;
    public time: Date;
    public winner: string | "";
    public totalBet: number | undefined;
    public prize: number | undefined;  
    public dividend: number | undefined; 
    public animal: string | "";
    public winners: Array<Winner> | undefined;
    public ordens: Array<Ordens> | undefined; 

    constructor(
        date: Date,
        time: Date,
        winner: string | "",
        totalBet: number | undefined,
        prize: number | undefined,
        dividend: number | undefined, 
        animal: string | "",
        winners: Array<Winner> | undefined,
        ordens: Array<Ordens> | undefined 
    ) {
        this.date = date;
        this.time = time;
        this.winner = winner;
        this.totalBet = totalBet;
        this.prize = prize;
        this.dividend = dividend; 
        this.animal = animal;
        this.winners = winners;
        this.ordens = ordens;
    }
}
