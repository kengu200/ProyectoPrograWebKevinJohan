import {
    Field,
    InputType,
    ID
} from "type-graphql";
import { User,RolesTypes, UserStatusTypes } from "../../entities/user"
import { Service } from '../../entities/services';
import { Review } from '../../entities/review';




@InputType({ description: "Editable user information" })
export class UserInput {

    //@Authorized()
    @Field()
    name!: string;

    @Field({nullable:true,defaultValue:"Gutierrez"})
    lastName!: string;

    @Field(() => RolesTypes,{nullable:true})
    role!: RolesTypes;

    @Field(() => UserStatusTypes,{nullable:true})
    status?: UserStatusTypes;
}

@InputType()
export class UpdateUserByIdInput {

    @Field()
    idUser!: number;

    @Field(()=>UserInput)
    userData!:UserInput;

}


@InputType()
export class LikesData {

    @Field()
    tag!: string;


}



@InputType({ description: "Editable user information" })
export class RegisterUserInput {

    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;

    @Field()
    lastName!: string;


    @Field(()=>[LikesData],{nullable:true})
    likesList!: LikesData[];

}

@InputType()
export class ValidateRegisterUserInput {

    @Field()
    email!: string;

    @Field()
    code!: string;

}

@InputType()
export class AddUserFriendInput {

    @Field()
    idFriend!: number;

}


@InputType()
export class IsFriendInput {

    @Field()
    idUser!: number;

}

@InputType()
export class DeleteFriendInput {

    @Field()
    idUser!: number;

}

@InputType()
export class GetUserByIdInput {

    @Field()
    idUser!: number;

}

@InputType()
export class GetUserProfileByIdInput {

    @Field()
    idUser!: number;

}




