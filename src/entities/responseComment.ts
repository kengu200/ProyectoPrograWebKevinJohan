import { Entity, JoinColumn, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { User } from "./user";
import { Service } from "./services";
import { Review } from "./review";

export enum StateResponse {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

registerEnumType(StateResponse, {
    name: "StateResponse",
    description: "Reviews state",
    valuesConfig: {
        ACTIVE: {
            description: "Basic user role",
        },
        INACTIVE: {
            description: "Moderator user role",
        }
    },
});


@ObjectType()
@Entity()
export class ResponseComment extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    description!: string;

    @Field(() => User)
    @JoinColumn()
    @ManyToOne(() => User, (user: any) => user.reviews)
    creatorUser!: User;

    @Field(() => Review)
    @JoinColumn()
    @ManyToOne(() => Review, (review: any) => review.responses)
    creatorReview!: Review;

    @Field()
    @Column({ nullable: true })
    creatorUserId!:number;

    @Field()
    @Column({ nullable: true })
    creatorReviewId!:number;


    @Field(() => StateResponse)
    @Column()
    state!: StateResponse;


    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    updatedAt!: string;

}