import {
    Field,
    ObjectType,
    ID
} from "type-graphql";
import { BaseResponse} from '../../entities/baseResponse';
import { User,RolesTypes } from '../../entities/user';
import { Service } from '../../entities/services';
import { Review } from '../../entities/review';

@ObjectType()
export class AddServiceReviewOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;

  }

  @Field(type => Review,{ nullable: true })
  data?: Review;

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

  @Field(type => [Review],{ nullable: true })
  data?: Review[];

}