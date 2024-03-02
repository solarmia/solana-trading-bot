import "dotenv/config";
import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import * as commands from './commands'
import { BotToken } from "./config";

const token = BotToken
const bot = new TelegramBot(token!, { polling: true });

console.log("Bot started")

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!

    console.log(`${chatId} -> ${action}`)
    try {
        switch (action) {
            case 'buy':
                bot.sendMessage(
                    chatId,
                    (await commands.buy(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.buy(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                bot.once(`message`, async (msg) => {
                    // check token address
                    console.log(msg.text)
                    return
                })

                break

            case 'sell':
                bot.sendMessage(
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
                bot.sendMessage(
                    chatId,
                    (await commands.wallet(chatId, msgId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.wallet(chatId, msgId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'export':
                bot.sendMessage(
                    chatId,
                    (await commands.exportKey()).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.exportKey()).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'show':
                bot.sendMessage(
                    chatId,
                    (await commands.showKey(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.showKey(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )

                break

            case 'cancel':
                bot.deleteMessage(chatId, msgId)
                break

            default:
                break
        }
    } catch (e) {
        console.log(e)
    }

})

bot.on(`message`, async (msg) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username = msg.from!.username!
    console.log(`${chatId} -> ${text}`)
    try {
        switch (text) {
            case `/start`:
                bot.sendMessage(
                    chatId,
                    (await commands.welcome(chatId)).title,
                    {
                        reply_markup: {
                            inline_keyboard: (await commands.welcome(chatId)).content
                        }, parse_mode: 'HTML'
                    }
                )
                break;

            default:
                // bot.deleteMessage(chatId, msgId)
                break
        }
    } catch (e) {
        console.log(e)
    }
});
