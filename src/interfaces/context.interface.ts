import { Request, Response } from "express";
import { User } from "../entities/user";

export interface Context {
  req: Request;
  res: Response;
  // payload?: { userId: string };
  user?: User;
}