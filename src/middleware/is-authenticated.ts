import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context } from "../interfaces/context.interface";
import enviroment from "../config/enviroments.config";
import { User } from "../entities/user";

export const isAuthenticated: MiddlewareFn<Context> = ({ context }, next) => {

  const authorization = context.req.headers["authorization"];
  const bearer_prefix = "Bearer ";

  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.replace(bearer_prefix, "");
    console.log(token);
    const payload:any = verify(token, enviroment.jwtSecretKey ?? '');
    context.user = payload.user as User;
    console.log(payload);
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};