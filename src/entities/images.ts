import {Entity, JoinColumn,Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, ManyToOne} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import {Service} from "./services";

@ObjectType()
@Entity()
export class Image extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Field()
    @Column()
    url!:string;

    @JoinColumn()
    @ManyToOne(() => Service, (service: any) => service.images)
    service!: Service;

    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field(()=> String)
    @CreateDateColumn({type:'timestamp'})
    updatedAt!:string;
}