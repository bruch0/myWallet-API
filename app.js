import express from 'express';
import cors from 'cors';

import {signIn} from './routes/signIn.js';
import {signUp} from './routes/signUp.js';
import {getTransactions, postTransaction} from './routes/transactions.js';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-in', signIn);

app.post('/sign-up', signUp);

app.get('/transactions', getTransactions);

app.post('/transactions', postTransaction);

export default app;
