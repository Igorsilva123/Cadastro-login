import dotenv from 'dotenv';
import express from 'express';
import useRouter from './routes/registro.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/', useRouter);

app.listen(process.env.PORT , () => {
   console.log('server rodando!');
})

