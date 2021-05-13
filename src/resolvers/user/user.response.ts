import {
    Field,
    ObjectType,
} from "type-graphql";
import { BaseResponse} from '../../entities/baseResponse';
import { User } from '../../entities/user'


@ObjectType()
export class LoginResponseData {
    @Field()
    accessToken?: string;
}

@ObjectType()
export class LoginUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
    this.token = data.token;
  }

  @Field({ nullable: true })
  data?: LoginResponseData;

  @Field({ nullable: true })
  token?: String;
}

@ObjectType()
export class AddFriendUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
  }

}


@ObjectType()
export class RegisterUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field({ nullable: true })
  data?: User;

}

@ObjectType()
export class ValidateRegisterUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
    this.token = data.token;
  }

  @Field({ nullable: true })
  data?: User;

  @Field({ nullable: true })
  token?: String;
}

@ObjectType()
export class GetUserFriendsOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field(() => [User],{ nullable: true })
  data?: User[];

}




