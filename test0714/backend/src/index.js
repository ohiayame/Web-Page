import userRouter from '../router/user.js'
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/login', userRouter);

app.listen(3000, ()=>{
    console.log('start!!!!!!');
});