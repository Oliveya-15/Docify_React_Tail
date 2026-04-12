// ─────────────────────────────────────────────────────────────────────────────
// FILE: backend/routes/chatRoute.js
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import { chatWithDocTalk } from '../controllers/chatController.js';

const chatRouter = express.Router();
chatRouter.post('/', chatWithDocTalk);
export default chatRouter;

