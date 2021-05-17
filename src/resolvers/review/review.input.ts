import {
    Field,
    InputType,
    ID
} from "type-graphql";
import { Review } from "../../entities/review"
import { User,RolesTypes } from '../../entities/user';
import { Service } from '../../entities/services';

@InputType()
export class AddReviewInput {

    @Field()
    description!: string;

    @Field()
    rating!: number;

    @Field()
    serviceId!:number;

}


@InputType()
export class GetServiceReviewsInput {

    @Field()
    serviceId!:number;

}