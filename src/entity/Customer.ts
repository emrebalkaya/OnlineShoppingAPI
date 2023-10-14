import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm"
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Order } from "./Order";

@Entity()
export class Customer{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    @IsEmail({},{message: "Email must be unique!"})
    @IsNotEmpty()
    email: string

    @Column()
    @IsNotEmpty()
    @Length(5,20)
    password: string

    @OneToMany(() => Order, order => order.customer, { onDelete: 'CASCADE' })
    orders: Order[];

}