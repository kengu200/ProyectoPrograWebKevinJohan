import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, CreateDateColumn, OneToMany, JoinTable, ManyToMany, RelationId, PrimaryColumn } from "typeorm";
import { ObjectType, Field, ID, Authorized, registerEnumType } from "type-graphql";
import { User } from "./user";

@ObjectType()
@Entity()
export class Friends extends BaseEntity {
       
    @PrimaryColumn("int")
    userId_1!: number;

    @PrimaryColumn("int")
    userId_2!: number;

    @Field(() => User)
    //@JoinColumn({ name: 'serviceId' })
    @ManyToMany(() => User)
    user?: User;

    
}