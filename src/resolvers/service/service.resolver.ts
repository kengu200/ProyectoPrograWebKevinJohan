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

import { isAppUser, isAuthenticated } from "../../middleware/is-authenticated";
import { Context } from "../../interfaces/context.interface";
import { ServiceInput, ReportServiceInput, GetServiceById, GetServicesAndUser,  } from "./service.input"
import { GetUsersAndServiserOutput,ReportServiceOutput, GetServiceByIdOutput, GetReportedServicesOutput, GetAllServicesreportOutput,UsersAndServicesData } from "./service.response"
import { getManager, InsertResult } from "typeorm";
import  {FireBase} from '../services/firebase';
import  {awsService} from '../services/aws';
import uniqid from 'uniqid';
import { Friends } from "../../entities/friends";


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

    @Mutation(() => String)
    @UseMiddleware(isAuthenticated)
    async registerService(
        @Arg("serviceData", () => ServiceInput) data: ServiceInput,
        @Ctx() { user }: Context
    ) {
        try {
            var likes="";
            if(data.likesList){
                if(data.likesList.length>0){
                    data.likesList.forEach((like)=>{
                
                        likes = (likes=="") ? like.tag :like.tag+","+likes;
                    })
                }
            }


            if(data.image){
                var AWS = new awsService();
                data.image =await  AWS.uploadFile(data.image,user?.id+"/"+uniqid()+".jpg");
            }
            var newService = new InsertResult();
            newService = await Service.insert({
                ...data,likes:likes
            });

            const idNewService = newService.identifiers[0];
            await User.update({ id: user?.id }, { serviceId: Int.parseValue(idNewService.id) });

        } catch (err) {
            console.log(err);
            return false;
        }


        return true;
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
    @UseMiddleware(isAppUser)
    async getServicesAndUser(@Ctx() { user }: Context, @Arg("serviceData", () => GetServicesAndUser) data: GetServicesAndUser):Promise<GetUsersAndServiserOutput> {
        try {
            

            const recordUser = await User.findOne({ where: { id:user?.id } });
            console.log("user"+recordUser?.id);

            var userServices = await getManager().createQueryBuilder()
            .select("user.name,user.lastName,user.email,user.serviceId,user.id,services.createdAt,services.title, services.description,services.likes")
            .from(User,"user")
            .innerJoin(Service,"services","user.serviceId = services.id")
            //.leftJoinAndSelect(Image,"images","images.serviceId= services.id")
            //.where("services.title LIKE :result",{
            //    result: data.wordFilter
            //})
            .execute();

            if(user?.id){
                userServices = await this.filterServices(data, userServices,recordUser);
            }


            console.log("user and Services filtered"+JSON.stringify(userServices));


            for(var service of userServices){

                var images = await getManager().createQueryBuilder()
                .select("*")
                .from(Image,"image")
                //.innerJoin(Service,"services","image.serviceId = services.id")
                //.leftJoinAndSelect(Image,"images","images.serviceId= services.id")
                .where("image.serviceId = :result",{
                    result: service.serviceId
                })
                .execute();

                console.log("imagenes del servicio"+images)


                    console.log("si setea");
                    //userServices[0].images = images;
                    service.images = images;
                


            }

            

            console.log("Lista Completa"+JSON.stringify(userServices));

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


    private async filterServices(filter:GetServicesAndUser,services:[UsersAndServicesData],user?:User):Promise<UsersAndServicesData[]>{

        var newServices:UsersAndServicesData[]= [];
        var flag:boolean = false;

        if(filter.categoria){

            if(user?.likes){


                var newWordServices:UsersAndServicesData[] = flag ? newServices: services;
    
                newWordServices.forEach((service)=>{
                    
                    if(service.likes){
                        var categorias = service?.likes?.split(",");

                        categorias.forEach(categoria=>{

                            if(categoria==filter.categoria){
                                
                            }
                        })
                        newServices.push(service);
                    }
                })
    
                
                flag=true;

            }

        }

        else if(filter.wordFilter){

            var newWordServices:UsersAndServicesData[] = flag ? newServices: services;

            newWordServices.forEach((service)=>{
                if(service.title.includes(filter.wordFilter) || service.description.includes(filter.wordFilter)){
                    newServices.push(service);
                }
            })

            
            flag=true;

        }


        else if(filter.onlyFriends){

            if(user){
                console.log("es User")
                var newFriendServices:UsersAndServicesData[] = [];
    
                var recordFriends:[Friends] = await getManager().createQueryBuilder()
                .select("*")
                .from(Friends,"friends")
                .where("friends.userId_1 = :result",{
                    result: user?.id
                })
                .execute();
    
                console.log("amigos  "+JSON.stringify(recordFriends));
                console.log("user_id"+user?.id);
                var filteredServices = flag?newServices:services;
                for(var service of filteredServices){
                        //console.log("servicio"+service.id);
    
                        if(recordFriends.length>0){
                            
                            recordFriends.forEach(friend => {
    
                                if(friend.userId_2 == service.id){
    
                                    newFriendServices.push(service);
    
                                }
                                
                            });
                        }
                    
                }
                flag=true;
                newServices = newFriendServices;
            }


        }

        if(filter.dateFilter){

 
            var newDateServices:UsersAndServicesData[] = flag ? newServices: services;

            console.log("newDateServices "+newDateServices);
            if(filter.dateFilter=='ASC'){

                newDateServices  =  newDateServices;

            }

            if(filter.dateFilter=='DEC'){

                newDateServices  = newDateServices.reverse();

            }

           newServices  = newDateServices;
           flag=true;
        }


        if(flag)
            return newServices;

        return services;
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

    @Query(()=>GetAllServicesreportOutput)
    async getAllServicesReport(@Ctx() { user }: Context):Promise<GetAllServicesreportOutput> {
        try {
            
            const allServices = await Service.find();
            

            console.log(JSON.stringify(allServices.length));

            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: {
                    services:allServices,
                    count:allServices.length
                }
            }


        } catch (error) {
            return {
                code:200,
                message:'No se obtubieron servicios',
                success:true,
                data: undefined
            }
        }
        
    }
}