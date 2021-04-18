import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, OneToOne, OneToMany, JoinColumn} from 'typeorm';
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

    @Field(()=>Review)
    @JoinColumn()
    @OneToOne(() => Review)
    review!: Review;

    @Field(()=>[Image])
    @JoinColumn()
    @OneToMany(() => Image, (image: any) => image.images)
    images!: Image[];

    @Field()
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field()
    @CreateDateColumn({type:'timestamp'})
    updatedAt!:string;
}