import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Product } from "../entities/product";
import { RolesTypes } from "../entities/user";

@InputType()
class ProductInput {
    @Field()
    name!: string
    @Field()
    quantity!: number
}

@Resolver()
export class ProductResolver {
    @Authorized()
    @Mutation(() => Product)
    async createProduct(
        @Arg("data", () => ProductInput) data: ProductInput
    ) {
        const newData = Product.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Product)
    async updateProduct(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => ProductInput) data: ProductInput
    ) {
        await Product.update({ id }, data);
        const dataUpdated = await Product.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteProduct(
        @Arg("id", () => Int) id: number
    ) {
        await Product.delete(id);
        return true;
    }

    @Query(() => [Product])
    products() {
        return Product.find()
    }

    @Query(() => [Product])
    productById(
        @Arg("id", () => Int) id: number
    ) {
        return Product.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}