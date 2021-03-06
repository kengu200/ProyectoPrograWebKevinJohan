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
import { getConnection, getManager, Not } from "typeorm"

import enviroment from "../../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../../middleware/is-authenticated";
import { Context } from "../../interfaces/context.interface";
import { UserInput, RegisterUserInput, ValidateRegisterUserInput, AddUserFriendInput } from "./user.input"
import { LoginUserOutput, RegisterUserOutput, ValidateRegisterUserOutput, AddFriendUserOutput, GetUserFriendsOutput } from "./user.response";
import { GMailService } from '../mailer/mailer.resolver'
import { CodConfirmationType } from '../utils/utils.resolver'


@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users() {
        return User.find();
    }
    @UseMiddleware(isAuthenticated)
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
    async getId(@Ctx() { user }: Context) {
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


            return {code:200,message:"El usuario ya existe, si no recuerdas tu contrase??a se ha enviado un  codigo de verificacion a tu correo", data:undefined,success:true};
        }


        const hashedPassword = await hash(data.password, 13);
        try {

            const savedUser = await User.insert({
                ...data,
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
                    token: sign({ user: user }, enviroment.jwtSecretKey, {expiresIn: "10h"}) 
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
    async getUserFriends(@Ctx() { user }: Context):Promise<GetUserFriendsOutput> {
        try {
            const recordUser = await User.findOne({ where: { email:user?.email } });

            if (!recordUser) {
                throw new Error("Could not find user");
            }

            const userFriends = await getManager().createQueryBuilder()
            .select("*")
            .from(User,"user")
            .innerJoin(Friends,"friends")
            .where("friends.userId_1 = :result",{
                result: user?.id
            }).orWhere("friends.userId_2 = :result",{
                result: user?.id
            }).andWhere("user.id = :result",{
                result: Not(user?.id)
            }).execute();

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

    
    
}