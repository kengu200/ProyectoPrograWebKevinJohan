import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, CreateDateColumn, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { ObjectType, Field, ID, Authorized, registerEnumType } from "type-graphql";
import {Service} from "./services";
import {Review} from "./review";

export enum RolesTypes {
    ADMIN = "ADMIN",
    CLIENT = "CLIENT",
    OFFERER = "OFFERER"
}

export enum State{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

registerEnumType(RolesTypes, {
    name: "RolesTypes",
    description: "Roles types of the application",
    valuesConfig: {
        CLIENT: {
            description: "Client user role",
        },
        ADMIN: {
            description: "Admin user role",
        },
        OFFERER: {
            description: "Offerer user role",
        },
    },
});

registerEnumType(State, {
    name: "State",
    description: "Possible states for users",
    valuesConfig: {
        ACTIVE: {
            description: "Active user state",
        },
        INACTIVE: {
            description: "Inactive user state",
        },
        BLOCKED: {
            description: "Blocked user state",
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
    @Field()
    @Column("text", { nullable: true })
    name!: string;

    @Field()
    @Column("text", { nullable: true })
    email!: string;

    @Field()
    @Column("text", { nullable: true })
    password!: string;

    @Authorized(RolesTypes.ADMIN)
    @Field(() => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;

    @Field(()=>[Review])
    @JoinColumn()
    @OneToMany(() => Review, (review: any) => review.creatorUser)
    reviews!: Review[];

    @Field(() => Service)
    @JoinColumn()
    @OneToOne(() => Service)
    service!: Service;
    
    @ManyToMany(() => User)
    @JoinTable()
    friends!: User[];

    @Field(() => State)
    @Column()
    state!: State;

    @Field()
    @Column()
    @CreateDateColumn({type:'timestamp'})
    createdAt!:string;

    @Field()
    @Column()
    @CreateDateColumn({type:'timestamp'})
    updateAt!:string;

}