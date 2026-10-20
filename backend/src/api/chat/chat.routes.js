import { Router } from 'express';
import { createChat, getChats, getMessages, sendMessage } from './controller/chat.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.post('/', createChat);
router.get('/', getChats);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

export default router;