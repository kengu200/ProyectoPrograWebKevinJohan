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
import { User, RolesTypes, UserStatusTypes } from "../../entities/user";
import { Friends } from "../../entities/friends";
import { Review } from "../../entities/review";
import { Service } from "../../entities/services";
import { ResponseComment } from "../../entities/responseComment";
import { getConnection, getManager, Not } from "typeorm";

import enviroment from "../../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../../middleware/is-authenticated";
import { Context } from "../../interfaces/context.interface";
import { UserInput, RegisterUserInput, ValidateRegisterUserInput, AddUserFriendInput, DeleteFriendInput, GetUserByIdInput, GetUserProfileByIdInput, IsFriendInput, UpdateUserByIdInput } from "./user.input"
import { LoginUserOutput, RegisterUserOutput, ValidateRegisterUserOutput, AddFriendUserOutput, GetUserFriendsOutput,IsAuthOutput,GetUserByIdOutput, IsUserFriendOutput , GetCurrentUserOutput, GetAllUsersReportOutput,GetUserProfileOutput, UpdateUserOutput } from "./user.response";
import { GMailService } from '../mailer/mailer.resolver'
import { CodConfirmationType } from '../utils/utils.resolver'


@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users() {
        return User.find();
    }



    @UseMiddleware(isAuthenticated)
    @Mutation(() => UpdateUserOutput)
    async updateUser(@Arg("dataInput", () => UpdateUserByIdInput) data: UpdateUserByIdInput):Promise<UpdateUserOutput> {
        await User.update(data.idUser, data.userData);
        const dataUpdated = await User.findOne(data.idUser);
        console.log("user"+JSON.stringify(dataUpdated))
        return{
            code:200,
            message:'Codigo Correcto', 
            data: dataUpdated,
            success:true
        };
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async getId(@Ctx() { user }: Context) {
        //console.log(JSON.stringify(user));

        return `Your user id : ${user!.id}`;
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async getUserId(@Ctx() { user }: Context) {
        //console.log(JSON.stringify(user));

        return `Your user id : ${user!.id}`;
    }

    @Mutation(() => RegisterUserOutput)
    async registerUser(@Arg("registerUserInputData") data: RegisterUserInput):Promise<RegisterUserOutput> {
        const user = await User.findOne({ where: { email:data.email } });
        const mailService = new GMailService();
        const code = new CodConfirmationType();
        var response;

        if (user) {

            try{
                response = await mailService.sendMail(data.email.toString(),'clave seguridad',`Tu codigo de verificacion es: ${code.code}`);
                console.log(response);
            }catch(err){
                console.log(err);
                return {code:1,message:err, data:undefined,success:false}
            }


            return {code:200,message:"El usuario ya existe, si no recuerdas tu contraseña se ha enviado un  codigo de verificacion a tu correo", data:undefined,success:true};
        }


        const hashedPassword = await hash(data.password, 13);
        try {
            var likes="";
            if(data.likesList.length>0){
                data.likesList.forEach((like)=>{
            
                    likes = (likes=="") ? like.tag :like.tag+","+likes;
                })
            }
            const savedUser = await User.insert({
                ...data,
                likes:likes,
                password: hashedPassword,
                role:RolesTypes.NONE,
                status: UserStatusTypes.UNVERIFIED,
                code: code.code,
                expirationDate: code.expire
            });
            console.log(savedUser);

            try{
                response = await mailService.sendMail(data.email.toString(),'clave seguridad',`Tu codigo de verificacion es: ${code.code}`);
                console.log(response);
            }catch(err){
                console.log(err);
                return {code:1,message:err, data:undefined,success:false}
            }

        } catch (err) {
            console.log(err);
            return {code:1,message:err, data:undefined,success:false}
        }

        return {code:200,message:'Se envio un codigo al usuario registrado', data:undefined,success:true}
    }

    @Mutation(() => LoginUserOutput)
    async loginUser(@Arg("email") email: string, @Arg("password") password: string):Promise<LoginUserOutput> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        const verify = await compare(password, user.password);

        if (!verify) {
            throw new Error("Bad password");
        }

         return {
            code:200,
            message:'Codigo Correcto', 
            description:"Inicio de session Correcto",
            data:undefined,
            success:true, 
            token: sign({ user: user }, enviroment.jwtSecretKey, {
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
            return false;
        }

        return true;
    }

    @UseMiddleware(isAuthenticated)
    @Query(() => IsAuthOutput)
    async isAuth(@Ctx() { user }: Context):Promise<IsAuthOutput> {
        return {
            code:1,
            message:"Estas logueado", 
            success:true
        }
    }

    @Mutation(() => ValidateRegisterUserOutput)
    async validateRegisterCode(@Arg("InputData") data: ValidateRegisterUserInput):Promise<ValidateRegisterUserOutput> {
        const user = await User.findOne({ where: { email:data.email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        if(user.code?.toString() == data.code.toString()){
            try {
                await User.update({
                    ...user
                },
                {
                    status: UserStatusTypes.ACTIVE
                });

                return {
                    code:200,
                    message:'Codigo Correcto', 
                    data:undefined,
                    success:true, 
                    token: sign({ user: user }, enviroment.jwtSecretKey, {expiresIn: "24h"}) 
                }

            } catch (err) {
                console.log(err);
                return {
                    code:1,
                    message:err, 
                    data:undefined,
                    success:false
                }
            }

        }

        return {
            code:2,
            message:'Ha ocurrido un error, no se pudo validar el codigo de confirmacion', 
            data:undefined,
            success:false,
        }

    }

    
    
    @UseMiddleware(isAuthenticated)
    @Mutation(() => ValidateRegisterUserOutput)
    async addUserFriend(@Arg("InputData") data: AddUserFriendInput , @Ctx() { user }: Context):Promise<AddFriendUserOutput> {
        const recordUser = await User.findOne({ where: { email:user?.email } });

        if (!recordUser) {
            throw new Error("Could not find user");
        }

        try {
            await Friends.insert({
                userId_1:user?.id,
                userId_2:data.idFriend    
            });

            return {
                code:200,
                message:'Ahora son amigos',
                success:true
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false
            }
        }

    }

    @UseMiddleware(isAuthenticated)
    @Query(() => GetUserFriendsOutput)
    async getUserFriends( @Ctx() { user }: Context):Promise<GetUserFriendsOutput> {
        try {
            const recordUser = await User.findOne({ where: { id:user?.id } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

            const userFriends = await getManager().createQueryBuilder()
            .select("friendUser.id,friendUser.name,friendUser.email,friendUser.serviceId,friendUser.role,friendUser.status,friendUser.createdAt")
            .from(User,"user")
            .innerJoin(Friends,"friends","friends.userId_1 = user.id")
            .innerJoin(User,"friendUser","friends.userId_2 = friendUser.id")
            .where("friends.userId_1 = :result",{
                result: user?.id
            })
            .execute();

            console.log(userFriends);

            return {
                code:200,
                message:'Se obtuvieron amigos',
                success:true,
                data: userFriends
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false
            }
        }
    }

    @UseMiddleware(isAuthenticated)
    @Query(() => IsUserFriendOutput)
    async isFriend(@Arg("InputData") data: IsFriendInput,@Ctx() { user }: Context):Promise<IsUserFriendOutput> {
        try {
            const recordUser = await User.findOne({ where: { id:user?.id } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

            const userFriend = await getManager().createQueryBuilder()
            .select("*")
            .from(Friends,"friends")
            .where("friends.userId_1 = :result",{
                result: user?.id
            }).andWhere("friends.userId_2 = :result2",{
                result2: data?.idUser
            })
            .execute();

            var friend=false;
            if(userFriend.length>0)
                friend=true;

            console.log("userFriends"+JSON.stringify(userFriend));

            return {
                code:200,
                message:'Se obtuvieron amigos',
                success:true,
                data: friend
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false,
                data:false
            }
        }
    }

    @UseMiddleware(isAuthenticated)
    @Mutation(() => IsUserFriendOutput)
    async deleteFriend(@Arg("InputData") data:  DeleteFriendInput,@Ctx() { user }: Context):Promise<IsUserFriendOutput> {
        try {
            const recordUser = await User.findOne({ where: { id:user?.id } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

            const userFriend = await Friends.delete({userId_1:user?.id,userId_2:data.idUser})
            console.log("amigo elminado"+userFriend)

            return {
                code:200,
                message:'Se obtuvieron amigos',
                success:true,
                data: true
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false,
                data:false
            }
        }
    }


    

    @UseMiddleware(isAuthenticated)
    @Query(() => GetCurrentUserOutput)
    async getCurrentUser(@Ctx() { user }: Context):Promise<GetCurrentUserOutput> {
        try {
            const recordUser = await User.findOne({ where: { id:user?.id } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

     
            return {
                code:200,
                message:'Se obtuvo el usuario logueado',
                success:true,
                data: recordUser
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false
            }
        }
    }


    @UseMiddleware(isAuthenticated)
    @Query(() => GetUserByIdOutput )
    async getUserById(@Arg("InputData") user : GetUserByIdInput):Promise<GetUserByIdOutput > {
        try {
            const recordUser = await User.findOne({ where: { id:user?.idUser } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

     
            return {
                code:200,
                message:'Se obtuvo el usuario logueado',
                success:true,
                data: recordUser
            }

        } catch (err) {
            return {
                code:1,
                message:err,
                success:false
            }
        }
    }


    @UseMiddleware(isAuthenticated)
    @Query(() => GetAllUsersReportOutput)
    async getAllUsersReport(@Ctx() { user }: Context):Promise<GetAllUsersReportOutput> {
        try {
            const recordUser = await User.findOne({ where: { id:user?.id } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

            const userFriends = await getManager().createQueryBuilder()
            .select("*")
            .from(User,"user")
            .orderBy("user.createdAt")
            .execute();

            console.log(userFriends);

            return {
                code:200,
                message:'Se obtuvo el reporte de usuarios',
                success:true,
                data: userFriends
            }

        } catch (err) {
            console.log(err);
            return {
                code:1,
                message:err,
                success:false
            }
        }
    }



    @Query(() => GetUserProfileOutput)
    async getUserProfile(@Ctx() { user }: Context,@Arg("serviceData", () => GetUserProfileByIdInput) data: GetUserProfileByIdInput):Promise<GetUserProfileOutput> {
        try {
            
            //const recordReviews = await Review.find({where:{serviceId:data.serviceId}});


            const recordUsers = await getManager().createQueryBuilder()
            //.select("reviews.id,reviews.description,reviews.createdAt,reviews.serviceId,reviews.rating,reviews.creatorUserId,user.name,user.lastName,user.id")
            .select("user.name,user.lastName,user.email,user.serviceId,user.id,services.createdAt,services.title, services.description")
            .from(User,"user")
            .leftJoin(Service,"services","user.serviceId = services.id")
            //.innerJoin(Review,"review","review.serviceId. = services.id")
            //.from(Review,"review")
            
            //.innerJoin(User,"user","user.id = reviews.creatorUserId")
            //.innerJoin(ResponseComment,"ResponseComment.","ResponseComment.creatorReviewId")
            .where("user.id = :result",{
                result: data.idUser
            })
            .groupBy("user.id")
            .execute();

            console.log("service id"+JSON.stringify(recordUsers[0]))

            if(recordUsers.length>0){
                const recordReviews = await getManager().createQueryBuilder()
                .select("reviews.id,reviews.description,reviews.createdAt,reviews.serviceId,reviews.rating,reviews.creatorUserId,user.name,user.lastName")
                .from(Review,"reviews")
                .innerJoin(User,"user","user.id = reviews.creatorUserId")
                //.innerJoin(ResponseComment,"ResponseComment.","ResponseComment.creatorReviewId")
                .where("reviews.serviceId= :result",{
                    result: recordUsers[0].serviceId
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

                if(recordReviews){
                    recordUsers[0].reviews = recordReviews;

                }
    
                //recordUsers[0].reviews = recordReviews[0];

            }


            if(!recordUsers){
                throw new Error("Could not find reviews");
            }
    
            return {
                code:200,
                message:'Se obtubieron servicios',
                success:true,
                data: recordUsers
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