import * as web3 from '@solana/web3.js'
import bs58 from 'bs58';
import { encode } from 'js-base64';

import { RpcURL, userPath } from '../config';
import { Iuser } from '../utils/type';
import { readData, writeData } from '../utils';

let userData: Iuser = {}

export const init = async () => {
  userData = await readData(userPath)
}

export const checkInfo = async (chatId: number) => {
  if (chatId.toString() in userData) return true
  else false
}

export const fetch = async (chatId: number, botName?: string) => {
  try {
    const connection = new web3.Connection(RpcURL)
    const balance = await connection.getBalance(new web3.PublicKey(userData[chatId].publicKey))
    userData[chatId].balance = balance
    writeData(userData,userPath)
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
  const connection = new web3.Connection(RpcURL)
  try {
    const balance = await connection.getBalance(new web3.PublicKey(publicKey))
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
      balance: 0
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