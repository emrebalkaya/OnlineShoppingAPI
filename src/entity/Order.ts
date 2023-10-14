import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer;
    
    @ManyToMany(() => Product, product => product.orders , {cascade:true})
    @JoinTable({name: "order_product"})
    products: Product[];

    @Column()
    @IsNotEmpty()
    totalAmount: number;
}
