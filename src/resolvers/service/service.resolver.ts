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
import { InsertResult } from "typeorm";

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
        @Arg("serviceData", () => ServiceInput) data: ServiceInput
    ) {
        try {
            console.log("aa");
            await Service.update({ id: user?.serviceId }, data);
            const dataUpdated = await Service.findOne(user?.serviceId);
            return dataUpdated;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    @Query(() => Service)
    @UseMiddleware(isAuthenticated)
    async getOneService(
        @Ctx() { user }: Context
    ) {
        try {
            return Service.findOne(user?.serviceId);
        } catch (error) {
            console.log(error);
        }
        
    }

    @Mutation(() => String)
    @UseMiddleware(isAuthenticated)
    async registerService(
        @Arg("serviceData", () => ServiceInput) data: ServiceInput,
        @Ctx() { user }: Context
    ) {
        try {

            var newService = new InsertResult();
            newService = await Service.insert({
                ...data
            });

            const idNewService = newService.identifiers[0];
            await User.update({ id: user?.id }, { serviceId: Int.parseValue(idNewService.id) });

        } catch (err) {
            return "false";
        }


        return true;
    }
}