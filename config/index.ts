import dotenv from "dotenv";
dotenv.config();

export const BotToken = process.env.TOKEN!
export const RpcURL = process.env.RPC_URL!
export const fee= Number(process.env.FEE)

export const userPath = './user.json'
export const tokenPath = './tokens.json'
export const statusPath = './status.json'
export const settingsPath = './settings.json'
export const logoPath = './logo.png'