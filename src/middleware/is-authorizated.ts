
import { AuthChecker } from "type-graphql"
import { Context } from "../interfaces/context.interface";
import { verify } from "jsonwebtoken";
import enviroment from "../config/enviroments.config";
import { User } from "../entities/user";
export const isAuthorizated: AuthChecker<Context> = ({ context }, roles) => {

    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("Not authenticated");
    }
    if (authorization.indexOf("bearer ", 0) < 0) {
        throw new Error("Not authenticated");
    }
    try {
        const token = authorization.replace("bearer ", "");
        const payload = verify(token, enviroment.jwtSecretKey ?? '');
        context.user = payload as User;
    } catch (err) {
        console.log(err);
        throw new Error("Not authenticated");
    }

    const user = context.user;
    if (roles.length === 0) {
        // if `@Authorized()`, check only if user exists
        return user !== undefined;
    }
    // there are some roles defined now

    if (!user) {
        // and if no user, restrict access
        return false;
    }
    if (roles.includes(user.role)) {
        // grant access if the roles overlap
        return true;
    }
    // no roles matched, restrict access
    return false;
};