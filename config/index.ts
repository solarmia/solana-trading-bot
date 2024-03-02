import dotenv from "dotenv";
dotenv.config();

export const BotToken = process.env.TOKEN!
export const rpcURL = process.env.RPC_URL!

export const userInfoPath = './user.json'