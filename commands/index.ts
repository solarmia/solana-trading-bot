import { checkInfo, checkValidAddr, createWalletHelper, fetch, getSetting, importWalletHelper, setSettings } from './helper'

interface IConfirm {
    [key: string]: {
        title: string;
        content: { text: string; callback_data: string; }[][];
    };
}

const confirmList: IConfirm =
{
    exportKey: {
        title: "Are you sure you want to export your Private Key?",
        content: [
            [{ text: `Confirm`, callback_data: `show` }, { text: `Cancel`, callback_data: `cancel` }]
        ]
    },
    resetWallet: {
        title: "Are you sure you want to reset your wallet?",
        content: [
            [{ text: `Reset Wallet`, callback_data: `import` }, { text: `Cancel`, callback_data: `cancel` }]
        ]
    },
}
export const commandList = [
    { command: 'start', description: 'Start the bot' },
    { command: 'settings', description: 'Show the settings menu' },
    { command: 'wallet', description: 'View wallet info' },
    { command: 'buy', description: 'Buy tokens' },
    { command: 'sell', description: 'Sell your token' },
    { command: 'referral', description: 'Refer your friend' },
    { command: 'help', description: 'Tips and faqs' }
];

// export const welcome1 = async (chatId: number, botName?: string, pin: boolean = false) => {
//     const { publicKey, balance } = await fetch(chatId, botName)

//     const title = `To get started with trading, send some SOL to your Honestbot wallet address:
// <code>${publicKey}</code>

// Sol balance: ${balance}

// Once done tap refresh and your balance will appear here.`

//     const content = [
//         [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
//         [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
//         [{ text: `Refer Friend`, callback_data: 'refer' }, { text: `Help`, callback_data: 'help' }],
//         [{ text: `Refresh`, callback_data: 'refresh' }, { text: `${pin ? 'Unpin' : 'Pin'}`, callback_data: `${pin ? 'unpin' : 'pin'}` }],
//     ]

//     return {
//         title, content
//     }
// }

export const welcome = async (chatId: number, botName?: string, pin: boolean = false) => {

    if (await checkInfo(chatId)) {
        const { publicKey, balance } = await fetch(chatId, botName)

        const title = `Welcome to HonestBot
        
To get started with trading, send some SOL to your Honestbot wallet address:
<code>${publicKey}</code>

Sol balance: ${balance} SOL

Once done tap refresh and your balance will appear here.`

        const content = [
            [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
            [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
            [{ text: `Refer Friend`, callback_data: 'refer' }, { text: `Help`, callback_data: 'help' }],
            [{ text: `Refresh`, callback_data: 'refresh' }, { text: `${pin ? 'Unpin' : 'Pin'}`, callback_data: `${pin ? 'unpin' : 'pin'}` }],
        ]

        return {
            title, content
        }
    } else {

        const title = `Welcome to HonestBot
    
Are you going to create new wallet or import your own wallet?`

        const content = [
            [{ text: `Import`, callback_data: 'import' }, { text: `Create`, callback_data: 'create' }],
        ]

        return {
            title, content
        }
    }
}

export const importWallet = async (chatId: number, privateKey: string, botName: string) => {
    const { publicKey, balance } = await importWalletHelper(chatId, privateKey, botName)

    const title = `Successfully imported!
    
Your Honestbot wallet address:
<code>${publicKey}</code>

Sol balance: ${balance} SOL`

    const content = [
        [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
        [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
        [{ text: `Refer Friend`, callback_data: 'refer' }, { text: `Help`, callback_data: 'help' }],
        [{ text: `Refresh`, callback_data: 'refresh' }, { text: `${'Pin'}`, callback_data: `${'pin'}` }],
    ]

    return {
        title, content
    }
}

export const refreshWallet = async (chatId: number) => {
    const { publicKey, balance } = await fetch(chatId)
    const title = `Successfully refreshed!
    
Your Honestbot wallet address:
<code>${publicKey}</code>

Sol balance: ${balance} SOL`

    const content = [
        [{ text: `View on solscan`, url: `https://solscan.io/account/${publicKey}` }, { text: `Refresh`, callback_data: `refresh` }],
        [{ text: `Withdraw all SOL`, callback_data: `withdraw` }, { text: `Withdraw X SOL`, callback_data: `withdrawX` }],
        [{ text: `Export Private Key`, callback_data: `export` }, { text: `Reset wallet`, callback_data: `reset` }],
        [{ text: `Close`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const createWallet = async (chatId: number, botName: string) => {
    const { publicKey, balance } = await createWalletHelper(chatId, botName)

    const title = `Successfully Created!
    
To get started with trading, send some SOL to your Honestbot wallet address:
<code>${publicKey}</code>

Sol balance: ${balance} SOL

Once done tap refresh and your balance will appear here.`

    const content = [
        [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
        [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
        [{ text: `Refer Friend`, callback_data: 'refer' }, { text: `Help`, callback_data: 'help' }],
        [{ text: `Refresh`, callback_data: 'refresh' }, { text: `${'Pin'}`, callback_data: `${'pin'}` }],
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

export const wallet = async (chatId: number) => {
    const { publicKey, balance } = await fetch(chatId)
    const title = `Your Wallet:
    
Your Honestbot wallet address: <code>${publicKey}</code>
Balance: ${balance} SOL

${balance == 0 ? 'Tap to copy the address and send SOL to deposit.' : ''}`

    const content = [
        [{ text: `View on solscan`, url: `https://solscan.io/account/${publicKey}` }, { text: `Refresh`, callback_data: `refresh` }],
        [{ text: `Withdraw all SOL`, callback_data: `withdraw` }, { text: `Withdraw X SOL`, callback_data: `withdrawX` }],
        [{ text: `Export Private Key`, callback_data: `export` }, { text: `Reset wallet`, callback_data: `reset` }],
        [{ text: `Close`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const confirm = async (status: string) => {
    const title = confirmList[status].title

    const content = confirmList[status].content

    return {
        title, content
    }
}

export const showKey = async (chatId: number) => {
    const { privateKey } = await fetch(chatId)
    const title = `Your Private Key is:

<code>${privateKey}</code>
    
Delete this message once you are done.`

    const content = [
        [{ text: `Delete`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const refer = async (chatId: number) => {
    const { referralLink } = await fetch(chatId)
    const title = `Referral Link: 
<code>${referralLink}</code>

Referrals: 0
You can get reward if you refer someone`

    const content = [
        [{ text: `Close`, callback_data: `cancel` }]
    ]

    return {
        title, content
    }
}

export const settings = async (chatId: number) => {
    //     const title = `Settings

    // GENERAL SETTINGS
    // Honest bot Announcements: Occasional announcements. Tap to toggle.
    // Minimum Position Value: Minimum position value to show in portfolio. Will hide tokens below this threshhold. Tap to edit.

    // SLIPPAGE CONFIG
    // Customize your slippage settings for buys and sells. Tap to edit.
    // Max Price Impact is to protect against trades in extremely illiquid pools.

    // TRANSACTION PRIORITY
    // Increase your Transaction Priority to improve transaction speed. Select preset or tap to edit.`
    const title = `Settings

GENERAL SETTINGS
Honest bot Announcements: Occasional announcements. Tap to toggle.
Minimum Position Value: Minimum position value to show in portfolio. Will hide tokens below this threshhold. Tap to edit.

BUTTONS CONFIG
Customize your buy and sell buttons for buy token and manage position. Tap to edit.

SLIPPAGE CONFIG
Customize your slippage settings for buys and sells. Tap to edit.
Max Price Impact is to protect against trades in extremely illiquid pools.

TRANSACTION PRIORITY
Increase your Transaction Priority to improve transaction speed. Select preset or tap to edit.`

    const { announcement, buy1, buy2, sell1, sell2, slippage1, slippage2, priority, priorityAmount } = await getSetting(chatId)
    const content = [
        [{ text: `--- General settings ---`, callback_data: `general config` }],
        [{ text: `Announcements`, callback_data: `announcement config` }, {
            text: `${announcement ? '🟢 Enable' : '🔴 Disable'}`, callback_data: `announcement`
        }],
        [{ text: `--- Buy Amount Config ---`, callback_data: `buy config` }],
        [{ text: `✎ Left: ${buy1} SOL`, callback_data: `buy1` }, {
            text: `✎ Right: ${buy2} SOL`, callback_data: `buy2`
        }],
        [{ text: `--- Sell Amount Config ---`, callback_data: `sell config` }],
        [{ text: `✎ Left: ${sell1} %`, callback_data: `sell1` }, {
            text: `✎ Right: ${sell2} %`, callback_data: `sell2`
        }],
        [{ text: `--- Slippage Percentage Config ---`, callback_data: `slippage config` }],
        [{ text: `✎ Buy: ${slippage1} %`, callback_data: `slippage1` }, {
            text: `✎ Sell: ${slippage2} %`, callback_data: `slippage2`
        }],
        [{ text: `--- Transaction Priority Config ---`, callback_data: `priority config` }],
        [{ text: `⇌ ${priority}`, callback_data: `priority-config` }, {
            text: `✎ ${priorityAmount} SOL`, callback_data: `priority-custom`
        }],
    ]

    return { title, content }
}

export const newSettings = async (chatId: number, category: string, value?: any) => {
    const { announcement, buy1, buy2, sell1, sell2, slippage1, slippage2, priority, priorityAmount } = await setSettings(chatId, category, value)
    const content = [
        [{ text: `--- General settings ---`, callback_data: `general config` }],
        [{ text: `Announcements`, callback_data: `announcement` }, {
            text: `${announcement ? '🟢 Enable' : '🔴 Disable'}`, callback_data: `announcement`
        }],
        [{ text: `--- Buy Amount Config ---`, callback_data: `buy config` }],
        [{ text: `✎ Left: ${buy1} SOL`, callback_data: `buy1` }, {
            text: `✎ Right: ${buy2} SOL`, callback_data: `buy2`
        }],
        [{ text: `--- Sell Amount Config ---`, callback_data: `sell config` }],
        [{ text: `✎ Left: ${sell1} %`, callback_data: `sell1` }, {
            text: `✎ Right: ${sell2} %`, callback_data: `sell2`
        }],
        [{ text: `--- Slippage Percentage Config ---`, callback_data: `slippage config` }],
        [{ text: `✎ Buy: ${slippage1} %`, callback_data: `slippage1` }, {
            text: `✎ Sell: ${slippage2} %`, callback_data: `slippage2`
        }],
        [{ text: `--- Transaction Priority Config ---`, callback_data: `priority config` }],
        [{ text: `⇌ ${priority}`, callback_data: `priority-config` }, {
            text: `✎ ${priorityAmount} SOL`, callback_data: `priority-custom`
        }],
    ]

    return { content }
}

export const getTokenInfo = async (address: string) => {
    console.log("commands")
    const result = await checkValidAddr(address)
    if (result) {
        const image = result.logo;
        const caption = `${result.name} | ${result.symbol}

Address: <code>${address}</code>

Decimals: ${result.decimals}

Website: ${result.website}`

        const content = [
            [{ text: `Website`, url: `${result.website}` }, { text: `Explorer`, url: `https://explorer.solana.com/address/${address}` }, { text: `Birdeye`, url: `https://birdeye.so/token/${address}?chain=solana` }],
            [{ text: `Buy 0.1 sol`, callback_data: `buy1` }, {
                text: `Buy 1 sol`, callback_data: `buy2`
            }, { text: `Buy X sol`, callback_data: `buyX` }],
            [{ text: `Close`, callback_data: `cancel` }]
        ]
        return { image, caption, content }
    } else null
}

export const invalid = async () => {
    const title = 'Invalid behaviour'

    return { title }
}