import db from '../../../../db/db.config.js';
import { generateGeminiResponse } from '../../../utils/gemini.util.js';

export const createChatSession = async (userId, title) => {
    const [result] = await db.query(
        'INSERT INTO chats (user_id, title) VALUES (?, ?)',
        [userId, title || 'New Chat']
    );
    return { id: result.insertId, title: title || 'New Chat' };
};

export const getUserChats = async (userId) => {
    const [rows] = await db.query(
        'SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows;
};

export const getChatMessages = async (chatId, userId) => {
    const [chats] = await db.query('SELECT id FROM chats WHERE id = ? AND user_id = ?', [chatId, userId]);
    if (chats.length === 0) throw new Error('Chat not found or unauthorized');

    const [messages] = await db.query(
        'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
        [chatId]
    );
    return messages;
};

export const sendMessageService = async (userId, chatId, promptText) => {
    const [chats] = await db.query('SELECT id FROM chats WHERE id = ? AND user_id = ?', [chatId, userId]);
    if (chats.length === 0) throw new Error('Chat session not found');

    const [historyRows] = await db.query(
        'SELECT sender, text FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
        [chatId]
    );

    const { replyText, promptTokens, completionTokens, totalTokens } =
        await generateGeminiResponse(historyRows, promptText);

    await db.query(
        'INSERT INTO messages (chat_id, sender, text) VALUES (?, ?, ?)',
        [chatId, 'user', promptText]
    );

    const [result] = await db.query(
        `INSERT INTO messages (chat_id, sender, text, prompt_tokens, completion_tokens, total_tokens) VALUES (?, ?, ?, ?, ?, ?)`,
        [chatId, 'model', replyText, promptTokens, completionTokens, totalTokens]
    );

    return {
        userMessage: { sender: 'user', text: promptText },
        botMessage: {
            id: result.insertId,
            sender: 'model',
            text: replyText,
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: totalTokens
        }
    };
};