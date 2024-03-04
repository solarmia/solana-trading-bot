import dotenv from "dotenv";
dotenv.config();

export const BotToken = process.env.TOKEN!
export const RpcURL = process.env.RPC_URL!

export const userPath = './user.json'