import express from 'express';
import cors from 'cors'

import dayjs from 'dayjs'
import { signIn } from './routes/signIn.js';
import { signUp } from './routes/signUp.js';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-in', signIn);

app.post('/sign-up', signUp);

app.listen(4000);