import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { IsNotEmpty, Min} from "class-validator";
import { Order } from "./Order";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    @IsNotEmpty()
    name: string

    @Column()
    @Min(0)
    @IsNotEmpty()
    stock: number

    @Column('float')
    @IsNotEmpty()
    price: number

    @Column()
    description: string

    @ManyToMany(() => Order, order => order.products)
    orders: Order[];
}
