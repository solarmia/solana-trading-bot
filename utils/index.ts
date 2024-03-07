import axios from 'axios';
import fs from 'fs';
import * as web3 from '@solana/web3.js'
import bs58 from 'bs58';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

import { RpcURL, feeAccountAddr, feeAccountSecret, quoteURL, swapURL } from '../config';

const connection = new web3.Connection(RpcURL)

export const readData = async (Path: string): Promise<any> => {
  return JSON.parse(fs.readFileSync(Path, `utf8`));
}

export const writeData = async (data: any, path: any) => {
  const dataJson = JSON.stringify(data, null, 4);
  fs.writeFile(path, dataJson, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log(`wrote file ${path}`);
    }
  });
}

export const tokenSwap = async (inputMint: string, outputMint: string, amount: number, slippageBps: number, swapMode: string, platformFeeBps: number, userPublicKey: string, userPrivateKey: string, computeUnitPriceMicroLamports: number) => {
  let signature = ''
  try {
    const quoteResponse = (await axios.get(quoteURL, {
      params: {
        inputMint,
        outputMint,
        amount,
        slippageBps,
        swapMode,
        platformFeeBps
      }
    })).data

    const feePayerAccount = web3.Keypair.fromSecretKey(bs58.decode(feeAccountSecret))

    const feeTokenAccount = await getOrCreateAssociatedTokenAccount(connection, feePayerAccount, new web3.PublicKey(outputMint), new web3.PublicKey(feeAccountAddr))

    const swapTransaction = (await axios.post(swapURL, {
      quoteResponse,
      userPublicKey,
      feeAccount: new web3.PublicKey(feeTokenAccount.address).toString(),
      computeUnitPriceMicroLamports
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })).data.swapTransaction

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = web3.VersionedTransaction.deserialize(swapTransactionBuf);

    // sign the transaction
    transaction.sign([web3.Keypair.fromSecretKey(bs58.decode(userPrivateKey))]);

    // Excute transaction
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2
    });
    signature = `https://solscan.io/tx/${txid}`
    console.log(signature)
    await connection.confirmTransaction(txid, "confirmed");
    return { signature: signature }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.name, signature: signature }
    } else return { error: 'Unknown error, please check your transaction history.', signature: signature }
  }
}