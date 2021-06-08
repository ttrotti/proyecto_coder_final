import ProductFirebase from '../Products/ProductFirebase.js'
class Cart {
    constructor(db) {
        this.carts = db.collection("carts")
        this.Product = new ProductFirebase(db)
    }

    get = async (id) => {
        try {
            if(!id) {
                const querySnapshot = await this.carts.get();
                const docs = querySnapshot.docs;
                const response = docs.map((doc) => ({
                    id: doc.id,
                    timestamp: doc.data().timestamp,
                    description: doc.data().description,
                    products: doc.data().products 
                }))
                return response
            }    
            const doc = this.carts.doc(`${id}`);
            const item = await doc.get();
            const response = item.data();
            response.id = item.id;
            return response
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

            const newItem = await this.Product.get(productId)
            if(!newItem || newItem.length < 1) return false
            
            if(cart.products) {
                cart.products.push(newItem)
                await this.carts.add(cart)
            } else if(cart[0].products) {
                const doc = this.carts.doc(`${cart[0].id}`);
                const cartObj = cart[0]

                cartObj.products.push(newItem)
                await this.update(cartObj, cart[0].id)
            }
            console.log("Producto añadido con éxito")
            return await this.get()
        }
        catch(err) {
            console.log(err)
        }
    }

    update = async (data, id) => {
        try {
            const doc = this.carts.doc(`${id}`);
            await doc.update({
                products: data.products
            });
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
            const deleted = await this.Product.get(productId)
            if (!deleted) return false
            cartObj.products = cartObj.products.filter((product) => product.id !== productId)
            await this.update(cartObj, cartObj.id)
            console.log("Producto eliminado del carrito con éxito")
            return deleted;
        }
        catch(err) {
            console.log(err)
        }
    }
}

export default Cart;