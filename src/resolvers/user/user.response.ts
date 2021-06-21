import {
    Field,
    ObjectType,
    ID
} from "type-graphql";
import { BaseResponse} from '../../entities/baseResponse';
import { User } from '../../entities/user'
import { Service } from "../../entities/services";
import { Image } from "../../entities/images";
import { Review } from "../../entities/review";

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
export class IsAuthOutput extends BaseResponse {
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

@ObjectType()
export class GetCurrentUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field(() => User,{ nullable: true })
  data?: User;

}

@ObjectType()
export class GetUserByIdOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field(() => User,{ nullable: true })
  data?: User;

}



@ObjectType()
export class GetAllUsersReportOutput extends BaseResponse {
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



@ObjectType()
export class UsersProfileData{
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

    @Field(() => String,{nullable:true})
    title!: string;

    @Field(() => String,{nullable:true})
    description!: string;

    @Field(() => String,{nullable:true})
    url!: string;
}

@ObjectType()
export class GetUserProfileOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field(() => [UsersProfileData],{ nullable: true })
  data?: UsersProfileData[];

}

@ObjectType()
export class IsUserFriendOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field({ nullable: true })
  data!: boolean;

}

@ObjectType()
export class UpdateUserOutput extends BaseResponse {
  constructor(data: any) {
    super();
    this.message = data.message;
    this.success = data.success;
    this.description = data.description;
    this.data = data.data;
  }

  @Field({ nullable: true })
  data?:User;

}







