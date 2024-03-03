import * as web3 from '@solana/web3.js'
import bs58 from 'bs58';
import { encode } from 'js-base64';

import { RpcURL, userInfoPath } from '../config';
import { Iuser } from '../utils/type';
import { readData, writeData } from '../utils';

const userPath = userInfoPath
let userData: Iuser = {}

export const init = async () => {
  userData = await readData(userInfoPath)
}

export const fetch = async (chatId: number, botName?: string) => {
  if (!(chatId.toString() in userData)) {
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
      privateKey,
      referralLink,
      balance: 0
    }
  } else {
    try {
      const connection = new web3.Connection(RpcURL)
      const balance = await connection.getBalance(new web3.PublicKey(userData[chatId].publicKey))
      userData[chatId].balance = balance
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
}
