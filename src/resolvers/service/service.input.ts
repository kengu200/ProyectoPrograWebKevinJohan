import {
    Field,
    InputType,
    ID
} from "type-graphql";


@InputType()
export class LikesDataService {

    @Field()
    tag!: string;


}


@InputType({ description: "Editable service information" })
export class ServiceInput {
    @Field()
    title!:string;
    
    @Field()
    description!:string;

    @Field({nullable:true})
    image!:string;

    @Field(()=>[LikesDataService],{nullable:true})
    likesList!: LikesDataService[];

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


@InputType({ description: "Get service by id" })
export class GetServicesAndUser{

    @Field({nullable:true})
    wordFilter!:string;

    @Field({nullable:true})
    dateFilter!:string;

    @Field({nullable:true})
    onlyFriends!:boolean;

    @Field({nullable:true})
    categoria!:string;
    
}





