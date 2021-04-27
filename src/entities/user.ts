import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, CreateDateColumn, OneToMany, JoinTable, ManyToMany} from "typeorm";
import { ObjectType, Field, ID, Authorized, registerEnumType } from "type-graphql";
import {Service} from "./services";
import {Review} from "./review";

export enum RolesTypes {
    NONE = "NONE",
    ADMIN = "ADMIN"

}

export enum UserStatusTypes{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    UNVERIFIED = "UNVERIFIED"
}

registerEnumType(RolesTypes, {
    name: "RolesTypes",
    description: "Roles types of the application",
    valuesConfig: {
        ADMIN: {
            description: "Admin user role",
        },
        NONE :{description:"NONE"},
    },
});

registerEnumType(UserStatusTypes, {
    name: "UserStatusTypes",
    description: "Roles types of the application",
    valuesConfig: {
        ACTIVE : {description:"ACTIVE"},
        INACTIVE :{description:"INACTIVE"},
        BLOCKED : {description: "BLOCKED"},
        UNVERIFIED :{description: "UNVERIFIED"},
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

    
    @Field()
    @Column("text", { nullable: true })
    code?: string;

    @Field()
    @Column("text", { nullable: true })
    expirationDate?: number;

    @Authorized(RolesTypes.ADMIN)
    @Field(() => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;

    @Field(()=>[Review])
    @JoinColumn()
    @OneToMany(() => Review, (review: any) => review.creatorUser)
    reviews?: Review[];

    @Field(() => ID)
    @JoinColumn()
    @OneToOne(() => Service)
    service?: number;
    
    @Field(() => User)
    @JoinTable()
    @ManyToMany(() => User)
    friends?: User;
    
    @Field(()=> String)
    @Column()
    @CreateDateColumn({type:'timestamp'})
    createdAt?:string;

    @Field(()=> String)
    @Column()
    @CreateDateColumn({type:'timestamp'})
    updateAt?:string;

    @Field(()=> UserStatusTypes)
    @Column("text",{ nullable: true })
    status!:UserStatusTypes;
}