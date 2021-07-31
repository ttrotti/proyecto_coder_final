import logger from '../../lib/logger.js'
class Product {
    constructor(db) {
        this.products = db.collection("productos")
    }

    get = async (id) => {
        try {
            if(id) {
                const doc = this.products.doc(`${id}`);
                const item = await doc.get();
                const response = item.data()
                response.id = item.id;
                return response
            }    
            const querySnapshot = await this.products.get();
            const docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                code: doc.data().code,                    
                price: doc.data().price,
                thumbnail: doc.data().thumbnail,
                stock: doc.data().stock,
            }))
            return response
        }
        catch(err) {
            logger.error(err)
        }
    }

    add = async (product) => {
        try {
            if(product.title === undefined) {
                return({
                    error: "debe completar un título para su artículo"
                })
            }
            if(product.price === undefined) {
                return({
                    error: "debe completar un precio para su artículo"
                })
            }
            if(product.thumbnail === undefined) {
                return({
                    error: "debe completar un thumbnail para su artículo"
                })
            }
            // esto lo mantengo solo para el env de prueba
            product.thumbnail = "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"

            this.products.add(product)
            return product
        }
        catch(err) {
            logger.error(err)
        }
    }

    update = async (data, id) => {
        try {
            const doc = this.products.doc(`${id}`);
            await doc.update(data);
            return await this.get(id);
        }
        catch(err) {
            logger.error(err)
        }
    }

    delete = async (id) => {
        try {
            const deleted = await this.get(id)
            const doc = this.products.doc(`${id}`);
            await doc.delete()
            return deleted
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default Product;