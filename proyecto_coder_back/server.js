import express from 'express';
import cors from 'cors'

import productRouter from './routers/prodRouter.js'
import cartRouter from './routers/cartRouter.js'

import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/carrito', cartRouter);
app.use('/api/productos', productRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

app.on('error', err => console.log("Error message:" + err))