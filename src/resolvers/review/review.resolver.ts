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
import { AddReviewInput, GetServiceReviewsInput, ResponseRerviewInput  } from "./review.input"
import { AddServiceReviewOutput, GetServiceReviewsOutput,AddResponseReviewOutput } from "./review.response"
import { getManager, InsertResult } from "typeorm";
import { ResponseComment } from "../../entities/responseComment";




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

    @Mutation(() => AddResponseReviewOutput)
    @UseMiddleware(isAuthenticated)
    async responseReview(
        @Arg("responseData", () => ResponseRerviewInput) data: ResponseRerviewInput,
        @Ctx() { user }: Context
    ):Promise<AddResponseReviewOutput> {
        try {

            const newResponse = await ResponseComment.insert({
                ...data,
                creatorReviewId:data?.reviewId,
                creatorUserId:user?.id
            });


            return {
                code:1,
                message:"Se agrego la respuesta a la review", 
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
            
            //const recordReviews = await Review.find({where:{serviceId:data.serviceId}});


            const recordReviews = await getManager().createQueryBuilder()
            .select("reviews.id,reviews.description,reviews.createdAt,reviews.serviceId,reviews.rating,reviews.creatorUserId,user.name,user.lastName")
            .from(Review,"reviews")
            .innerJoin(User,"user","user.id = reviews.creatorUserId")
            //.innerJoin(ResponseComment,"ResponseComment.","ResponseComment.creatorReviewId")
            .where("reviews.serviceId= :result",{
                result: data.serviceId
            })
            .execute();

            for(var review of recordReviews){
                console.log("id de la review"+review.id);
                var comments = await getManager().createQueryBuilder()
                .select("responseComment.id,responseComment.description,responseComment.createdAt,responseComment.creatorUserId,user.name,user.lastName")
                .from(ResponseComment,"responseComment")
                .innerJoin(User,"user","user.id = responseComment.creatorUserId")
                //.innerJoin(ResponseComment,"ResponseComment.","ResponseComment.creatorReviewId")
                .where("responseComment.creatorReviewId= :result",{
                    result: review.id
                })
                .execute();
                console.log("respuests"+JSON.stringify(comments));
                review.responses = comments;
            }

            console.log(recordReviews);

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