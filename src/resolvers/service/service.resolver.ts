import {
    Resolver,
    Query,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Int,
    Authorized
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { Service } from "../../entities/services";
import { Image } from "../../entities/images";
import { User } from "../../entities/user";

import enviroment from "../../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../../middleware/is-authenticated";
import { Context } from "../../interfaces/context.interface";
import { ServiceInput } from "./service.input"

@Resolver()
export class ServiceResolver {
    @Query(() => [Service])
    async getAllServices() {
        return Service.find();
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Service)
    async updateService(
        @Ctx() { user }: Context,
        @Arg("data", () => ServiceInput) data: ServiceInput
    ) {
        const id = user!.service;
        await Service.update(id, data);
        const dataUpdated = await Service.findOne(id);
        return dataUpdated;
    }

    @Query(() => Service)
    @UseMiddleware(isAuthenticated)
    async getOneService(
        @Ctx() { user }: Context
    ) {
        return Service.findOne(user?.service);
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => Boolean)
    async registerService(
        @Arg("data", () => ServiceInput) data: ServiceInput,
        @Ctx() { user }: Context
    ) {
        try {

            const newService = await Service.insert({
                ...data
            });
            
            const id = user!.id;
            await User.update({ id }, { service: newService.identifiers[0] });

        } catch (err) {
            return false;
        }


        return true;
    }
}