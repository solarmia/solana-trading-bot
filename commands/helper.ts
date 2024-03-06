import * as web3 from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import { encode } from 'js-base64';
import axios from 'axios';
import fs from 'fs';

import { RpcURL, userPath, tokenPath, statusPath, logoPath, settingsPath } from '../config';
import { ISettings, IStatus, ITokenData, Iuser, initialSetting } from '../utils/type';
import { readData, writeData } from '../utils';

let userData: Iuser = {}
let userStatus: IStatus = {}
let tokens: ITokenData[]
let settings: ISettings = {}

const connection = new web3.Connection(RpcURL)

export const init = async () => {
  userData = await readData(userPath)
  userStatus = await readData(statusPath)
  tokens = await readData(tokenPath)
  settings = await readData(settingsPath)
}

export const checkInfo = async (chatId: number) => {
  if (!(chatId.toString() in settings)) {
    settings[chatId] = initialSetting
    writeData(settings, settingsPath)
  }

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
    const info = tokens.filter((val: any) => val.address == addr)
    if (info) {
      const response = await axios.get(info[0].logoURI, { responseType: 'arraybuffer' });
      fs.writeFileSync(logoPath, Buffer.from(response.data));
      return { symbol: info[0].symbol, name: info[0].name, decimals: info[0].decimals, logo: logoPath, website: info[0].extensions.website }
    } else return null
  } catch (e) {
    console.log(e)
  }
}

export const getSetting = async (chatId: number) => {
  settings = await readData(settingsPath)
  return settings[chatId]
}

export const setSettings = async (chatId: number, category: string, value?: any) => {
  if (category == 'announcement') settings[chatId]['announcement'] = !settings[chatId]['announcement']
  else {
    //@ts-ignore
    settings[chatId][category] = value
  }
  writeData(settings, settingsPath)
  return settings[chatId]
}