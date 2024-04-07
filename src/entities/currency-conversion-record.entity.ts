import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CurrencyConversionRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from: string;
    
    @Column()
    to: string;

    @Column()
    date: string;

    @Column('decimal', { precision: 10, scale: 7})
    rate: number;
}