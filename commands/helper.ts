import * as web3 from '@solana/web3.js'

import { rpcURL, userInfoPath } from '../config';
import { Iuser } from '../utils/type';
import { readData, writeData } from '../utils';
import bs58 from 'bs58';

const userPath = userInfoPath
let userData: Iuser = {}

export const init = async () => {
  userData = await readData(userInfoPath)
}

export const fetch = async (chatId: number) => {
  let newKepair: any
  let pubkey: any
  let privkey: any
  if (!(chatId.toString() in userData)) {
    newKepair = new web3.Keypair();
    pubkey = newKepair.publicKey.toString();
    privkey = bs58.encode(Buffer.from(newKepair.secretKey))
    userData[chatId] = {
      privateKey: privkey,
      publicKey: pubkey,
      balance: 0,
    }
    writeData(userData, userPath)
    return {
      pubkey: pubkey.toString(),
      privkey: privkey.toString(),
      balance: 0
    }
  } else {
    try {
      const connection = new web3.Connection(rpcURL)
      const balance = await connection.getBalance(new web3.PublicKey(userData[chatId].publicKey))
      userData[chatId].balance = balance
      return {
        pubkey: userData[chatId].publicKey,
        privkey: userData[chatId].privateKey,
        balance
      }
    } catch (e) {
      return {
        pubkey: userData[chatId].publicKey,
        privkey: userData[chatId].privateKey,
        balance: 0
      }
    }
  }
}
