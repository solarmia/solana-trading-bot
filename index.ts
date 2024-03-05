import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';

import * as commands from './commands'
import { BotToken } from "./config";
import { init } from "./commands/helper";

const token = BotToken
const bot = new TelegramBot(token!, { polling: true });
let botName: string

console.log("Bot started");

bot.getMe().then(user => {
    botName = user.username!.toString()
})

bot.setMyCommands(commands.commandList)

init()

bot.on(`message`, async (msg) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username = msg.from!.username!
    if (text) console.log(`message : ${chatId} -> ${text}`)
    else return
    try {
        switch (text) {
            case `/start`:
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.welcome(chatId, botName)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.welcome(chatId, botName)).content
                        }, parse_mode: 'HTML'
                    }
                )
                break;

            case `/settings`:
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.settings(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.settings(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )
                break;

            case '/wallet':
                await bot.deleteMessage(chatId, msgId)
                const id = await bot.sendMessage(
                    chatId,
                    (await commands.wallet(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.wallet(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case '/buy':
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.buy(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.buy(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                bot.once(`message`, async (msg) => {
                    await commands.getTokenInfo(msg.text!)
                    console.log(msg.text)
                    return
                })

                break

            case '/sell':
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.sell(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.sell(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case '/referral':
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.refer(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.refer(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case '/help':
                await bot.deleteMessage(chatId, msgId)

                break

            default:
                break
        }
    } catch (e) {
        console.log('error -> \n',e)
        await bot.sendMessage(
            chatId,
            (await commands.invalid()).title
        )
    }
});

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!
    const callbackQueryId = query.id;

    console.log(`query : ${chatId} -> ${action}`)
    try {
        switch (action) {
            case 'import':
                await bot.deleteMessage(chatId, msgId)
                const inputmsg = await bot.sendMessage(
                    chatId,
                    `Please input your private key`
                )

                bot.once(`message`, async (msg) => {
                    await bot.deleteMessage(chatId, inputmsg.message_id)
                    await bot.deleteMessage(chatId, msg.message_id)
                    await bot.sendMessage(
                        chatId,
                        (await commands.importWallet(chatId, msg.text!, botName)).title,
                        {
                            reply_markup: {
                                inline_keyboard: (await commands.importWallet(chatId, msg.text!, botName)).content
                            }, parse_mode: 'HTML'
                        }
                    )
                    return
                })

                break

            case 'create':
                await bot.deleteMessage(chatId, msgId)
                await bot.sendMessage(
                    chatId,
                    (await commands.createWallet(chatId, botName)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.createWallet(chatId, botName)).content
                        }, parse_mode: 'HTML'
                    }
                )
                break

            case 'buy':
                await bot.sendMessage(
                    chatId,
                    (await commands.buy(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.buy(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                bot.once(`message`, async (msg) => {
                    await commands.getTokenInfo(msg.text!)
                    console.log('msg.text')
                    return
                })

                break

            case 'sell':
                await bot.sendMessage(
                    chatId,
                    (await commands.sell(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.sell(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'wallet':
                await bot.sendMessage(
                    chatId,
                    (await commands.wallet(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.wallet(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'reset':
                await bot.sendMessage(
                    chatId,
                    (await commands.confirm('resetWallet')).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.confirm('resetWallet')).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'export':
                await bot.sendMessage(
                    chatId,
                    (await commands.confirm('exportKey')).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.confirm('exportKey')).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'show':
                await bot.sendMessage(
                    chatId,
                    (await commands.showKey(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.showKey(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'refer':
                await bot.sendMessage(
                    chatId,
                    (await commands.refer(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.refer(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'settings':
                await bot.sendMessage(
                    chatId,
                    (await commands.settings(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.settings(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'refresh':
                await bot.deleteMessage(chatId, msgId)

                bot.sendMessage(
                    chatId,
                    (await commands.refreshWallet(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.refreshWallet(chatId)).content
                        }, parse_mode: 'HTML'
                    })

                break

            case 'pin':
                await bot.editMessageReplyMarkup(
                    {
                        inline_keyboard: (await commands.welcome(chatId, botName, true)).content
                    },
                    {
                        chat_id: chatId,
                        message_id: msgId
                    }
                )
                await bot.pinChatMessage(chatId, msgId)
                break

            case 'unpin':
                await bot.editMessageReplyMarkup(
                    {
                        inline_keyboard: (await commands.welcome(chatId, botName, false)).content
                    },
                    {
                        chat_id: chatId,
                        message_id: msgId
                    }
                )
                await bot.unpinChatMessage(chatId)
                break

            case 'cancel':
                await bot.deleteMessage(chatId, msgId)
                break

            default:
                break
        }
    } catch (e) {
        console.log('error -> \n',e)
        await bot.sendMessage(
            chatId,
            (await commands.invalid()).title
        )
    }

})
