import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PingResolver{
    @Query(()=>String)
    ping(){
        
        return "Pong!";
    }
    @Mutation(() => String)
    async hello(
        @Arg("name") name: string) {

        return `Hello my friend ${name}`;
    }
}


