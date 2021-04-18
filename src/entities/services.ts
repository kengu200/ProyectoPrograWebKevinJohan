import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, OneToOne, OneToMany} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import {Review} from "./review";
import {Image} from "./images";

@ObjectType()
@Entity()
export class Service extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column()
    title!:string;
    
    @Field()
    @Column()
    description!:string;

    @Field()
    @OneToOne(() => Review)
    review!: Review;

    @OneToMany(() => Image, (image: any) => image.images)
    images!: Image[];

    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    updatedAt!:string;
}