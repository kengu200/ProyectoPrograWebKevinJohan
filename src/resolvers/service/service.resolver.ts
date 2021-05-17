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
import { ServiceInput, ReportServiceInput, GetServiceById } from "./service.input"
import { GetUsersAndServiserOutput,ReportServiceOutput, GetServiceByIdOutput, GetReportedServicesOutput } from "./service.response"
import { getManager, InsertResult } from "typeorm";

@Resolver()
export class ServiceResolver {
    @Query(() => [Service])
    async getAllServices() {
        return Service.find();
    }

    @Query(() => GetServiceByIdOutput)
    async getServiceById(@Arg("serviceData", () => GetServiceById) data: GetServiceById):Promise<GetServiceByIdOutput> {
        try{
            const recordService = await Service.findOne({where:{id:data.serviceId}});
            
            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: recordService
            }

        }catch (error) {
            return {
                code:1,
                message:'No se encontro el servicio',
                success:false,
                data: undefined
            }
        }
 
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

    @Query(()=>GetUsersAndServiserOutput)
    async getServicesAndUser(@Ctx() { user }: Context):Promise<GetUsersAndServiserOutput> {
        try {
            

            const images = await Image.find();

            console.log(JSON.stringify(images));


            const userServices = await getManager().createQueryBuilder()
            .select("user.name,user.lastName,user.email,user.serviceId,user.id,services.createdAt,services.title, services.description")
            .from(User,"user")
            .innerJoin(Service,"services","user.serviceId = services.id")
            .execute();
            

            console.log(JSON.stringify(userServices));

            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: userServices
            }


        } catch (error) {
            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: undefined
            }
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


    @Mutation(() => ReportServiceOutput)
    @UseMiddleware(isAuthenticated)
    async reportService(
        @Arg("serviceData", () => ReportServiceInput) data: ReportServiceInput,
        @Ctx() { user }: Context
    ):Promise<ReportServiceOutput> {
        try {

            const recordService = await Service.findOne({ id:data.serviceId });

            if (!recordService) {
                throw new Error("Could not find service");
            }

            var reports = 0;
            
            if(recordService){
                reports = recordService.reportCount +1;
            }
            

            await Service.update({ id:data.serviceId }, {reportCount:reports});

            return {
                code:200,
                message:'Se reporto el servicio',
                success:true
            };

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:'No se pudo reportar el servicio',
                success:false
            }
        }
    }

    @Query(()=>GetReportedServicesOutput)
    async getReportedServices(@Ctx() { user }: Context):Promise<GetReportedServicesOutput> {
        try {
            
            const userServices = await getManager().createQueryBuilder()
            .select("services.createdAt,services.title,services.description,services.reportCount")
            .from(User,"user")
            .innerJoin(Service,"services","user.serviceId = services.id")
            .where("services.reportCount > 0")
            .orderBy("services.reportCount", "ASC")
            .execute();
            

            console.log(JSON.stringify(userServices));

            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: userServices
            }


        } catch (error) {
            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: undefined
            }
        }
        
    }
}