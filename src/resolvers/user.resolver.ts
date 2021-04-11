import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    UseMiddleware,
    Field,
    Ctx,
    Int,
    InputType,
    Authorized
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entities/user";

import enviroment from "../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../middleware/is-authenticated";
import { Context } from "../interfaces/context.interface";
import { RolesTypes } from "../entities/user"

@ObjectType()
class LoginResponse {
    @Field()
    accessToken?: string;
}

@InputType({ description: "Editable user information" })
class UserInput {
    @Field({ nullable: true })
    name?: string

    @Field()
    notes!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;
}


@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users() {
        return User.find();
    }
    @Authorized("ADMIN")
    @Mutation(() => User)
    async updateUser(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UserInput) data: UserInput
    ) {
        await User.update({ id }, data);
        const dataUpdated = await User.findOne(id);
        return dataUpdated;
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async Me(@Ctx() { user }: Context) {
        console.log(JSON.stringify(user));

        return `Your user id : ${user!.id}`;
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 13);
        try {
            await User.insert({
                name,
                email,
                password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }


        return true;
    }

    @Mutation(() => LoginResponse)
    async Login(@Arg("email") email: string, @Arg("password") password: string) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        const verify = await compare(password, user.password);

        if (!verify) {
            throw new Error("Bad password");
        }

        return {
            accessToken: sign({ user: user }, enviroment.jwtSecretKey, {
                expiresIn: "10h"
            })
        };
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async changePassword(@Arg("email") email: string, @Arg("password") newPassword: string) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        try {
            await User.update({
                ...user
            },
            {
                password: newPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}