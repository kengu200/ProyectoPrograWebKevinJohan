import {
    Field,
    InputType,
    ID
} from "type-graphql";

@InputType({ description: "Editable service information" })
export class ServiceInput {
    @Field()
    title!:string;
    
    @Field()
    description!:string;
}

@InputType({ description: "Editable service information" })
export class ReportServiceInput {

    @Field()
    serviceId!:number;
    
}


@InputType({ description: "Editable service information" })
export class CommentServiceInput {

    @Field()
    serviceId!:number;
    
}

@InputType({ description: "Get service by id" })
export class GetServiceById {

    @Field()
    serviceId!:number;
    
}




