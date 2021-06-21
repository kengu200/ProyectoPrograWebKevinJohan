import {
    Field,
    ObjectType,
    ID
} from "type-graphql";
import { BaseResponse} from '../../entities/baseResponse';
import { User,RolesTypes } from '../../entities/user';
import { Service } from '../../entities/services';
import { Review } from '../../entities/review';
import { Image } from '../../entities/images';


@ObjectType()
export class UsersAndServicesData{
    @Field(() => ID)
    id!: number;

    @Field(() => String)
    name!: string;

    @Field(() => String, {nullable:true})
    lastName!: string;

    @Field(() => String)
    email!: string;

    @Field(() => [Review],{nullable:true})
    reviews?: Review[];

    @Field(() => String,{nullable:true})
    serviceId?: number;

    @Field(() => Service,{nullable:true})
    service?: Service;

    @Field(() => String)
    createdAt!: string;

    @Field(() => String)
    title!: string;

    @Field(() => String)
    description!: string;

    @Field(() => String)
    likes!: string;

    @Field(() => String,{nullable:true})
    url!: string;

    @Field(() => [Image],{nullable:true})
    images!: Image[];


}

@ObjectType()
export class GetUsersAndServiserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
    this.token = data.token;
  }

  @Field(type => [UsersAndServicesData],{ nullable: true })
  data?: [UsersAndServicesData];

  @Field({ nullable: true })
  token?: String;
}


@ObjectType()
export class ReportServiceOutput extends BaseResponse {
    constructor(data: any) {
        super();
        this.message = data.message;
        this.success = data.success;
        this.description = data.description;

    }

}

@ObjectType()
export class GetServiceByIdOutput extends BaseResponse {
    constructor(data: any) {
        super();
        this.message = data.message;
        this.success = data.success;
        this.description = data.description;
        this.data = data.data;
    }

    @Field(type => Service,{ nullable: true })
    data?: Service;

}


@ObjectType()
export class GetReportedServicesOutput extends BaseResponse {
    constructor(data: any) {
        super();
        this.message = data.message;
        this.success = data.success;
        this.description = data.description;
        this.data = data.data;
    }

    @Field(type => [Service],{ nullable: true })
    data?: [Service];

}


@ObjectType()
export class GetAllServicesreport{

    @Field()
    count!: number;
    
    @Field(type => [Service],{ nullable: true })
    services?: Service[];

}

@ObjectType()
export class GetAllServicesreportOutput extends BaseResponse {
    constructor(data: any) {
        super();
        this.message = data.message;
        this.success = data.success;
        this.description = data.description;
        this.data = data.data;
    }

    @Field(type => GetAllServicesreport,{ nullable: true })
    data?: GetAllServicesreport;

}