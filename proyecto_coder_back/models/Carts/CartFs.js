import fs from 'fs';
import Product from '../Products/ProductFs.js'
import logger from '../../lib/logger.js'

class Cart {
    constructor() {
        this.path = "./cart.txt"
        this.counter = 0;
    }

    
    async get(id) {
        try {
            let cart = await fs.promises.readFile(this.path, "utf-8");
            cart = JSON.parse(cart)
            if(!cart) return false
            if(id) {
                const filtered = cart.products.filter((product) => product.id === parseInt(id))[0];            
                if (!filtered) return false;
                return filtered;
            }
            return cart
        }
        catch (err) {
            logger.error(err)
        }
    };
    
    async add(productId) {
        try {
            let cart = await this.get();
            if(!cart) {
                cart = {
                    id: this.counter++,
                    timestamp: Date.now(),
                    products: []
                }
            };
            const newItem = await Product.get(productId)
            if(!newItem) return false
            cart.products.push(newItem)

            await fs.promises.writeFile(this.path,
                JSON.stringify(cart, null, "\t")
            )
            logger.info("Producto añadido al carrito con éxito")
            return cart
        }
        catch(err) {
            logger.error(err)
        }
    }

    async delete(productId) {
        try {
            let cart = await this.get();
            if(cart.id !== this.counter) return false

            const filtered = cart.products.filter((product) => product.id == parseInt(productId))[0];
            if (!filtered) return false
    
            cart.products = cart.products.filter((product) => product.id !== parseInt(productId));

            await fs.promises.writeFile(this.path,
                JSON.stringify(cart, null, "\t")
            )
            logger.info("Producto eliminado del carrito con éxito")
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Cart();