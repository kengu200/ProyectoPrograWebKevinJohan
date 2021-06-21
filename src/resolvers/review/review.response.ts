import {
    Field,
    ObjectType,
    ID
} from "type-graphql";
import { BaseResponse} from '../../entities/baseResponse';
import { User,RolesTypes } from '../../entities/user';
import { Service } from '../../entities/services';
import { Review, StateReviews } from '../../entities/review';
import { ResponseComment } from '../../entities/responseComment';

@ObjectType()
export class AddServiceReviewOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;

  }

  @Field(type => ResponseComment ,{ nullable: true })
  data?: ResponseComment;

}

@ObjectType()
export class AddResponseReviewOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;

  }

  @Field(type => ResponseComment,{ nullable: true })
  data?: ResponseComment;

}



@ObjectType()
export class ResponseCommentData{

  @Field()
  id!: number;
  
  @Field()
  description!: string;

  @Field(() => User)
  creatorUser!: User;

  @Field()
  creatorUserId!:number;

  @Field(() => Service)
  service!: Service;

  @Field()
  serviceId?: number;

  @Field(() => StateReviews)
  state!: StateReviews;

  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;

  @Field()
  name!: string;

  @Field()
  lastName!: string;


}


@ObjectType()
export class ServiceReviewData{

    @Field()
    id!: number;

    @Field()
    description!: string;

    @Field()
    rating!: number;

    @Field(() => User)
    creatorUser!: User;

    @Field()
    creatorUserId!:number;

    @Field(() => Service)
    service!: Service;

    @Field()
    serviceId?: number;

    @Field(() => StateReviews)
    state!: StateReviews;

    @Field()
    createdAt!: string;

    @Field()
    updatedAt!: string;

    @Field()
    name!: string;

    @Field()
    lastName!: string;

    @Field(type=>[ResponseCommentData],{nullable:true})
    responses?:ResponseCommentData[];

}

@ObjectType()
export class GetServiceReviewsOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;

  }

  @Field(type => [ServiceReviewData],{ nullable: true })
  data?: ServiceReviewData[];

}