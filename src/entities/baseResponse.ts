import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class BaseResponse {

  @Field()
  success!: Boolean;

  @Field()
  message!: String;

  @Field({nullable:true})
  description?: String;

  @Field({description: `Internal Server Error 500\nForbidden 403`, nullable: true})
  code!: Number;
}