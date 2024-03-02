import { fetch } from './helper'

export const welcome = async (userId: number) => {
    const { pubkey, balance } = await fetch(userId)

    const title = `Welcome to HonestBot
    
To get started with trading, send some SOL to your Honestbot wallet address:

<code>${pubkey}</code>

Sol balance: ${balance}

Once done tap refresh and your balance will appear here.`

    const content = [
        [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
        [{ text: `Help`, callback_data: 'help' }, { text: `Refer Friend`, callback_data: 'refer' }],
        [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
        [{ text: `Pin`, callback_data: 'pin' }, { text: `Refresh`, callback_data: 'refresh' }],
    ]

    return {
        title, content
    }
}

export const buy = async (chatId: number) => {
    const title = `Buy Token:
  
Input token address to buy.`

    const content = [
        [{ text: `Cancel`, callback_data: 'cancel' }]
    ]

    return {
        title, content
    }
}

export const sell = async (chatId: number) => {
    const title = `Token List:
    
    Select token to sell.`

    // Get token list
    const content = [
        [{ text: `Cancel`, callback_data: 'cancel' }]
    ]

    return {
        title, content
    }
}

export const wallet = async (chatId: number, msgId:number) => {
    const { pubkey, balance } = await fetch(chatId)
    const title = `Your Wallet:
    
    Address: <code>${pubkey}</code>
    Balance: ${balance} SOL
    
    Tap to copy the address and send SOL to deposit.`

    const content = [
        [{ text: `View on solscan`, url: `https://solscan.io/account/${pubkey}` }, { text: `Refresh`, callback_data: `refresh:${msgId}` }],
        [{ text: `Withdraw all SOL`, callback_data: `withdraw` }, { text: `Withdraw X SOL`, callback_data: `withdrawX` }],
        [{ text: `Export Private Key`, callback_data: `export` }, { text: `Close`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const exportKey = async () =>{
    const title = `Are you sure you want to export your Private Key?`

    const content = [
        [{ text: `Confirm`, callback_data: `show` }, { text: `Cancel`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const showKey = async (chatId:number) =>{
    const {privkey} = await fetch(chatId)
    const title = `Your Private Key is:

<code>${privkey}</code>
    
Delete this message once you are done.`

    const content = [
        [{ text: `Delete`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}