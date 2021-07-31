import Product from '../Products/ProductMemory.js'
import logger from '../../lib/logger.js'
let CART = {};

class Cart {
    constructor() {
        this.counter = 0;
    }

    async get(id) {
        try {
            if(!CART || CART.products < 1) return false
            if(id) {
                const filtered = CART.products.filter((product) => product.id === parseInt(id))[0];            
                if (!filtered) return false;
                return filtered;
            }
            return CART
        }
        catch (err) {
            logger.error(err)
        }
    };
    
    async add(productId) {
        try {
            if(!CART.products) {
                CART = {
                    id: this.counter++,
                    timestamp: Date.now(),
                    products: []
                }
            };
            const newItem = await Product.get(productId)
            if(!newItem) return false
            CART.products.push(newItem)

            logger.trace("Producto añadido al carrito con éxito")
            return CART
        }
        catch(err) {
            logger.error(err)
        }
    }

    async delete(productId) {
        try {
            const filtered = CART.products.filter((product) => product.id == parseInt(productId))[0];
            if (!filtered) return false
    
            CART.products = CART.products.filter((product) => product.id !== parseInt(productId));


            logger.trace("Producto eliminado del carrito con éxito")
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Cart()