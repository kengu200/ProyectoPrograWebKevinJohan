import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { addAgency,getAgency } from "factura-middle"

@Resolver()
export class PingResolver{
    @Query(()=>String)
    ping(){
        
        return "Pong!";
    }
    @Mutation(() => String)
    async hello(
        @Arg("name") name: string) {
            var agency = {
                phone:{
                  e164: "+50671902321",
                  countryCode:"506",
                  nationalNumber:"71902321"
                },
                address:{
                  country:"Costa Rica",
                  address:"Miravalles",
                  province:"San Jose"
                  
                },
                agencyName:"Agencia #3"
              }

            var prueba = await getAgency("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDViZjg5M2MzNDkwZGEwNTc3YTM1YmMiLCJuYW1lIjoiS0VWSU4iLCJleHAiOjE2MjE4ODIyNjYuNTYyLCJpYXQiOjE2MTY2OTgyNjZ9.0KogCv0w63Yc2rKX84lBW13OU_Kcd-Xx3LrjwOt4_0E");
            console.log(prueba);

        return `Hello my friend ${name}`;
    }
}


