import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, CreateDateColumn, OneToMany} from "typeorm";
import { ObjectType, Field, ID, Authorized, registerEnumType } from "type-graphql";
import {Service} from "./services";
import {Review} from "./review";

export enum RolesTypes {
    NONE = "",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    BASIC = "BASIC"
}

export enum State{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    UNVERIFIED = "UNVERIFIED"
}

registerEnumType(RolesTypes, {
    name: "RolesTypes",
    description: "Roles types of the application",
    valuesConfig: {
        BASIC: {
            description: "Basic user role",
            deprecationReason: "Replaced with @Authorized() for simplicity",
        },
        MODERATOR: {
            description: "Moderator user role",
        },
        ADMIN: {
            description: "Admin user role",
        },
    },
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Authorized()
    @Field(() => String)
    @Column("text", { nullable: true })
    name!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    email!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    password!: string;

    @Authorized(RolesTypes.ADMIN)
    @Field(() => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;

    @Field()
    @Column()
    @OneToMany(() => Review, (review: any) => review.creatorUser)
    reviews!: Review[];

    @Field(() => Service)
    @Column()
    @OneToOne(() => Service)
    service!: Service;
    
    @Field(()=> String)
    @Column()
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field(()=> String)
    @Column()
    @CreateDateColumn({type:'timestamp'})
    updateAt!:string;

}