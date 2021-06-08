import mongoose from 'mongoose';
import Product from '../Products/ProductMongo.js'

const cartSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    products: {
        type: Array,
        required: true
    }
})

const carts = mongoose.model('cart', cartSchema);

class Cart {
    get = async (id) => {
        try {
            if(!id) return carts.find({})
            return carts.findById(id)
        }
        catch(err) {
            console.log(err)
        }
    }

    add = async (productId) => {
        try {
            let cart = await this.get()
            if(!cart || cart.length < 1) {
                cart = {
                    timestamp: Date.now(),
                    products: []
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
            return await this.get()
        }
        catch(err) {
            console.log(err)
        }
    }

    update = async (data, id) => {
        try {
            await carts.updateOne({_id: id}, data)
            return await this.get(id);
        }
        catch(err) {
            console.log(err)
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
            console.log("Producto eliminado del carrito con éxito")
            return deleted;
        }
        catch(err) {
            console.log(err)
        }
    }
}

export default new Cart();