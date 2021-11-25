import express from 'express';
import cors from 'cors';

import * as userController from './controllers/userController.js';
import * as transactionController from './controllers/transactionController.js';
import authToken from './middlewares/tokenAuth.js';
// import { getTransactions, postTransaction } from './routes/transactions.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/transactions', authToken);

app.post('/sign-up', userController.signUp);

app.post('/sign-in', userController.signIn);

app.get('/transactions', transactionController.getTransactions);

app.post('/transactions', transactionController.registerTransaction);

export default app;
