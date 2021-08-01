import { db } from '../../DB/db.js'
import Product from '../Products/ProductMySQL.js'
import logger from '../../lib/logger.js'

// db.schema.createTable('cart', table => {
//     table.increments('id')
//     table.timestamp("timestamp")
//     table.json("products")
// }).then(() => console.log("table created"))
// db.schema.dropTable('cart').then(() => console.log("table deleted"))

class Cart {
    constructor() {
        this.counter = 0;
    }
    
    async get(id) {
        try {
            if(!id) return db.from('cart').select()
            return db.from('cart').where('id', id)
        }
        catch(err) {
            logger.error(err)
        }
    };
    
    async add(productId) {
        try {
            let cart = await this.get();
            if(!cart || cart.length < 1) {
                cart = {
                    id: this.counter++,
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    products: []
                }
            };
            const newItem = await Product.get(productId)
            if(!newItem || newItem.length < 1) return false
            if(cart.products) {
                cart.products.push(newItem[0])
                cart.products = JSON.stringify(cart.products)
                await db.table('cart').insert(cart)
            } else if(cart[0].products) {
                const cartObj = cart[0]
                cartObj.products = JSON.parse(cartObj.products)
                
                cartObj.products.push(newItem[0])
                cartObj.products = JSON.stringify(cartObj.products)
                await db.table('cart').where({id: cartObj.id}).update({
                    products: cartObj.products
                })
            }
            
            logger.info("Producto añadido al carrito con éxito")
            return await this.get()
        }
        catch(err) {
            logger.error(err)
        }
    }

    async delete(productId) {
        try {
            let cart = await this.get();
            const cartObj = cart[0]
            cartObj.products = JSON.parse(cartObj.products)
            const filtered = cartObj.products.filter((product) => product.id == parseInt(productId))[0];
            if (!filtered) return false
            cartObj.products = cartObj.products.filter((product) => product.id !== parseInt(productId));
            cartObj.products = JSON.stringify(cartObj.products)
            await db.table('cart').where({id: cartObj.id}).update({
                products: cartObj.products
            })
            logger.info("Producto eliminado del carrito con éxito")
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Cart();