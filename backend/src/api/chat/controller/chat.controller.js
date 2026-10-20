import * as chatService from '../service/chat.service.js';

export const createChat = async (req, res, next) => {
    try {
        const chat = await chatService.createChatSession(req.user.id, req.body.title);
        res.status(201).json(chat);
    } catch (error) {
        next(error);
    }
};

export const getChats = async (req, res, next) => {
    try {
        const chats = await chatService.getUserChats(req.user.id);
        res.json(chats);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const messages = await chatService.getChatMessages(req.params.chatId, req.user.id);
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const response = await chatService.sendMessageService(
            req.user.id,
            req.params.chatId,
            req.body.message
        );
        res.json(response);
    } catch (error) {
        next(error);
    }
};