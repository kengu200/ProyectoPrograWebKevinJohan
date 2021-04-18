import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";
import { Service } from "./services";

@ObjectType()
@Entity()
export class Image extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    url!: string;

    @Field(() => Service)
    @JoinColumn()
    @ManyToOne(() => Service, (service: any) => service.images)
    service!: Service;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    updatedAt!: string;
}