import express from 'express';
import {
    createCheckoutSession,
    handleWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleWebhook
);

export default router;
