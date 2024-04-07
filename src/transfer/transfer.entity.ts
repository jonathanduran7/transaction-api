import { Account } from "src/accounts/account.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.transactions)
    accountFrom: Account;

    @ManyToOne(() => Account, account => account.transactions)
    accountTo: Account;

    @Column()
    amount: number;

    @Column()
    date: Date;

    @Column()
    description: string;
}