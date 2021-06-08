import ProductMemory from '../models/Products/ProductMemory.js';
import ProductFs from '../models/Products/ProductFs.js';
import ProductMongo from '../models/Products/ProductMongo.js';
import ProductMySQL from '../models/Products/ProductMySQL.js';
import ProductSqlite3 from '../models/Products/ProductSqlite3.js';
import ProductFirebase from '../models/Products/ProductFirebase.js';

import CartMemory from '../models/Carts/CartMemory.js';
import CartFs from '../models/Carts/CartFs.js';
import CartMySQL from '../models/Carts/CartMySQL.js'
import CartSqlite3 from '../models/Carts/CartSqlite3.js'
import CartMongo from '../models/Carts/CartMongo.js'
import CartFirebase from '../models/Carts/CartFirebase.js'

import mongoose from 'mongoose';
import admin from 'firebase-admin'

export let Product;
export let Cart;

const repository = 5;
switch(repository) {
    case 0:
        Product = ProductMemory
        Cart = CartMemory
    break;
    case 1: 
        Product = ProductFs
        Cart = CartFs
    break;
    
    case 2: 
    case 3: 
        Product = ProductMySQL
        Cart = CartMySQL
    break;

    case 4: 
        Product = ProductSqlite3
        Cart = CartSqlite3
    break;

    case 5:
    case 6: 
    try {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log("MongoDB database connection established successfully");
        });
        Product = ProductMongo
        Cart = CartMongo
    }
    catch(err) {
        console.log(err)
    }
    break;
    case 7:
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                type: process.env.FIREBASE_TYPE,
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: process.env.FIREBASE_AUTH_URI,
                token_uri: process.env.FIREBASE_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            })
        });
        console.log("connected to firebase")
        const db = admin.firestore();
        Product = new ProductFirebase(db)
        Cart = new CartFirebase(db)
        }
        catch(err) {
            console.log(err)
        }

    break;
}