import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Currency } from "./currency.entity";
import { User } from "src/users/user.entity";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    balance: number;

    @ManyToOne(() => Currency, currency => currency.accounts)
    currency: Currency;

    @ManyToOne(() => User, user => user.accounts)
    user: User;

    @ManyToMany(() => Account, account => account.transactions)
    transactions: Account[];
}