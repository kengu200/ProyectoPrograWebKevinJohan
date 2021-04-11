import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Review extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;

 
   
    @Field()
    @Column()
    name!:string;

    @Field(()=>Int)
    @Column("int",{default:0})
    quantity!:number;

    @Field(()=>Int)
    @Column("int",{default:0})
    rating!:number;
    
    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    updatedAt!:string;
}



