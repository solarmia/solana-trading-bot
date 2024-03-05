import * as web3 from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import { encode } from 'js-base64';

import { RpcURL, userPath } from '../config';
import { Iuser } from '../utils/type';
import { readData, writeData } from '../utils';

let userData: Iuser = {}

const connection = new web3.Connection(RpcURL)

export const init = async () => {
  userData = await readData(userPath)
}

export const checkInfo = async (chatId: number) => {
  if (chatId.toString() in userData) return true
  else false
}

export const fetch = async (chatId: number, botName?: string) => {
  try {
    const balance = (await connection.getBalance(new web3.PublicKey(userData[chatId].publicKey))) / 1e9
    userData[chatId].balance = balance
    writeData(userData, userPath)
    return {
      publicKey: userData[chatId].publicKey,
      privateKey: userData[chatId].privateKey,
      referralLink: userData[chatId].referralLink,
      balance
    }
  } catch (e) {
    return {
      publicKey: userData[chatId].publicKey,
      privateKey: userData[chatId].privateKey,
      referralLink: userData[chatId].referralLink,
      balance: 0
    }
  }
}

export const createWalletHelper = async (chatId: number, botName: string) => {
  const newKepair = new web3.Keypair();
  const publicKey = newKepair.publicKey.toString();
  const privateKey = bs58.encode(Buffer.from(newKepair.secretKey))
  const referralLink = `https://t.me/${botName}?ref=${encode(chatId.toString())}`
  userData[chatId] = {
    privateKey,
    publicKey,
    balance: 0,
    referralLink,
    referees: [],
    referrer: ''
  }
  writeData(userData, userPath)
  return {
    publicKey,
    balance: 0
  }
}

export const importWalletHelper = async (chatId: number, privateKeyHex: string, botName: string) => {
  const privateKeyBuffer = bs58.decode(privateKeyHex);
  const privateKeyUint8Array = new Uint8Array(privateKeyBuffer);
  const keypair = web3.Keypair.fromSecretKey(privateKeyUint8Array);
  const publicKey = keypair.publicKey;
  const privateKey = bs58.encode(Buffer.from(keypair.secretKey))
  const referralLink = `https://t.me/${botName}?ref=${encode(chatId.toString())}`
  try {
    const balance = (await connection.getBalance(new web3.PublicKey(publicKey))) / 1e9
    userData[chatId] = {
      privateKey,
      publicKey: publicKey.toString(),
      balance,
      referralLink,
      referees: [],
      referrer: ''
    }
    writeData(userData, userPath)
    return {
      publicKey,
      privateKey,
      referralLink,
      balance
    }

  } catch (e) {
    userData[chatId] = {
      privateKey,
      publicKey: publicKey.toString(),
      balance: 0,
      referralLink,
      referees: [],
      referrer: ''
    }
    writeData(userData, userPath)
    return {
      publicKey,
      privateKey,
      referralLink,
      balance: 0
    }

  }
}

export const checkValidAddr = async (addr: string) => {
  try {
    const tokenAccountInfo = await connection.getParsedAccountInfo(new web3.PublicKey(addr))
    if (tokenAccountInfo.value?.data) {
      const info = (JSON.parse(JSON.stringify(tokenAccountInfo.value?.data))).parsed
      console.log(info)
      // if ('amount' in tokenAccountInfo.value && 'decimals' in tokenAccountInfo.value) {
      // console.log(await connection.getAccountInfo(new web3.PublicKey(addr)))
      // } else {
      //   return null;
      // }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e)
  }
}