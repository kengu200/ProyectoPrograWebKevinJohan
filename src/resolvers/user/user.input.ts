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
    @Field({ nullable: true })
    name?: string

    @Field()
    notes!: string;

    @Field(() => RolesTypes)
    role!: RolesTypes;
}



@InputType({ description: "Editable user information" })
export class RegisterUserInput {

    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;

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




