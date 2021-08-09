import mongoose from 'mongoose';
import Product from '../Products/ProductMongo.js'
import logger from '../../lib/logger.js'
import { sendMail } from '../../lib/mailer.js'
import { sendMessage } from '../../lib/twilio.js'

const cartSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    dateOfPurchase: {
        type: Date
    }
})

const carts = mongoose.model('cart', cartSchema);

class Cart {
    get = async (username, id) => {
        try {
            if(username) return carts.find({owner: username, active: true})
            if(id) return carts.findById(id)
            return carts.find({})
        }
        catch(err) {
            logger.error(err)
        }
    }

    add = async (productId, username) => {
        try {
            let cart = await this.get(username)
            if(!cart || cart.length < 1) {
                cart = {
                    timestamp: Date.now(),
                    products: [],
                    owner: username,
                    active: true
                }
            }
            
            const newItem = await Product.get(productId)
            if(!newItem || newItem.length < 1) return false

            if(cart.products) {
                cart.products.push(newItem)
                await carts(cart).save()
            } else if(cart[0].products) {
                const cartObj = cart[0]
                cartObj.products.push(newItem)
                await this.update(cartObj, cartObj.id)
            }
            logger.info(`El usuario ${username} agregó un objeto a su carrito`)
            return await this.get()
        }
        catch(err) {
            logger.error(err)
        }
    }

    update = async (data, id) => {
        try {
            await carts.updateOne({_id: id}, data)
            return await this.get(id);
        }
        catch(err) {
            logger.error(err)
        }
    }

    delete = async (productId) => {
        try {
            let cart = await this.get();
            const cartObj = cart[0]
            const deleted = await Product.get(productId)
            if (!deleted) return false
            cartObj.products = cartObj.products.filter((product) => product._id !== deleted._id);
            await this.update(cartObj, cartObj._id)
            logger.info("Producto eliminado del carrito con éxito")
            return deleted;
        }
        catch(err) {
            logger.error(err)
        }
    }

    placeOrder = async(username) => {
        try {
            const cart = await this.get(username)
            sendMessage(username, 'orden')
            sendMail(username, 'orden')
            cart.active = false;
            cart.dateOfPurchase = Date.now()
            if(!cart) {
                return {error: "Parece que el carrito que intentas comprar no es tuyo"}
            }
            logger.info(`El usuario ${username} realizó un pedido de ${cart[0].products}`)
            return cart
        } catch(err) {
            logger.error(err)
        }
    }
}

export default new Cart();