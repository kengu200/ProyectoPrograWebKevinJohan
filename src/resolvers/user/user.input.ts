import {
    Field,
    InputType,
} from "type-graphql";
import { RolesTypes } from "../../entities/user"

@InputType({ description: "Editable user information" })
export class UserInput {
    @Field({ nullable: true })
    name?: string

    @Field()
    notes!: string;

    @Field(() => RolesTypes)
    role!: RolesTypes;
}



