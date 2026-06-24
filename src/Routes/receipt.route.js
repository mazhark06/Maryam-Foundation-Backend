import express from 'express';
import { addReceipt, sendReceipt, updateReceipt } from '../Controllers/Reciept.controller.js';

const router = express.Router();

router.post('/add' , addReceipt)

router.put('/update', updateReceipt)

router.post('/send', sendReceipt)

export default router