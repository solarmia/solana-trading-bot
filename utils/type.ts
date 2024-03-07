import { Enum } from "@solana/web3.js"

export interface Iuser {
  [key: string]: {
    privateKey: string,
    publicKey: string,
    balance: number,
    referralLink: string,
    referees: string[],
    referrer: string
  }
}

export interface IUserTokenList {
  [key: string]: IUserToken[]
}
export interface IUserToken {
  token: string,
  symbol: string,
  name: string,
  balance: number,
  decimals: number,
  website: string
}

export interface ISettings {
  [key: string]: {
    announcement: boolean
    buy1: number
    buy2: number
    sell1: number
    sell2: number
    slippage1: number
    slippage2: number
    priority: string
    priorityAmount: number
  }
}

export const initialSetting = {
  announcement: false,
  buy1: 1,
  buy2: 2,
  sell1: 20,
  sell2: 80,
  slippage1: 10,
  slippage2: 20,
  priority: 'Medium',
  priorityAmount: 0.0001 //0.0005 0.001
}

export interface ITokenData {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  extensions: {
    website: string
  }
};

export const errorTitle: {
  [key: string]: string
} = {
  inputBuyTokenAddress: `Token not found. Make sure address is correct.`,
  inputTokenAmount: `Invalid amount. Make sure amount is correct.`,
  internal: `Invalid action, please try again.`,
}