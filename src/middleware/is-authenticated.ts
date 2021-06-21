import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "../interfaces/context.interface";
import enviroment from "../config/enviroments.config";
import { User } from "../entities/user";

export const isAuthenticated: MiddlewareFn<Context> = ({ context }, next) => {

 
  const authorization = context.req.headers["authorization"];
  const bearer_prefix = "Bearer ";

  if (!authorization) {
    console.log("No esta auth");
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.replace(bearer_prefix, "");
    const payload:any = verify(token, enviroment.jwtSecretKey ?? '');
    context.user = payload.user as User;
  } catch (err) {
    throw new Error("Not authenticated");
  }
  return next();
};

export const isAppUser: MiddlewareFn<Context> = ({ context }, next) => {

  const authorization = context.req.headers["authorization"];
  const bearer_prefix = "Bearer ";

  if (!authorization) {
    console.log("No esta auth");
  }

  if(authorization){
    try {
      const token = authorization.replace(bearer_prefix, "");
      const payload:any = verify(token, enviroment.jwtSecretKey ?? '');
      context.user = payload.user as User;
    } catch (err) {
      
    }
    return next();

  }

  return next();

};