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
import { Review } from "../../entities/review";

import enviroment from "../../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../../middleware/is-authenticated";
import { Context } from "../../interfaces/context.interface";
import { AddReviewInput, GetServiceReviewsInput  } from "./review.input"
import { AddServiceReviewOutput, GetServiceReviewsOutput } from "./review.response"
import { getManager, InsertResult } from "typeorm";



@Resolver()
export class ReviewResolver {

    @Mutation(() => AddServiceReviewOutput)
    @UseMiddleware(isAuthenticated)
    async addReview(
        @Arg("serviceData", () => AddReviewInput) data: AddReviewInput,
        @Ctx() { user }: Context
    ):Promise<AddServiceReviewOutput> {
        try {

            const newReview = await Review.insert({
                ...data,
                creatorUserId:user?.id
            });


            return {
                code:1,
                message:"Se agrego la review al servicio", 
                data:undefined,
                success:false
            };

        } catch (err) {
            return {
                code:1,
                message:err, 
                data:undefined,
                success:false
            };
        }

    }


    @Query(()=>GetServiceReviewsOutput)
    async getServiceReviews(@Ctx() { user }: Context, @Arg("serviceData", () => GetServiceReviewsInput) data: GetServiceReviewsInput):Promise<GetServiceReviewsOutput> {
        try {
            
            const recordReviews = await Review.find({where:{serviceId:data.serviceId}});

            if(!recordReviews){
                throw new Error("Could not find reviews");
            }
    
            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: recordReviews
            }


        } catch (error) {
            return {
                code:1,
                message:'No se obtubieron servicios',
                success:false,
                data: undefined
            }
        }
        
    }

}