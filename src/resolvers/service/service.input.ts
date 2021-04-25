import {
    Field,
    InputType,
} from "type-graphql";

@InputType({ description: "Editable service information" })
export class ServiceInput {
    @Field()
    title!:string;
    
    @Field()
    description!:string;
}



