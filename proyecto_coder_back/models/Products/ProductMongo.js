import mongoose from 'mongoose';
import logger from '../../lib/logger.js'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
})

const products = mongoose.model('productos', productSchema);

class Product {
    get = async (id, title, code, minPrice, maxPrice , minStock, maxStock) => {
        try {
            if(minStock && maxStock) return products.find({stock: { $gt: minStock, $lt: maxStock }})
            if(minPrice && maxPrice) return products.find({price: { $gt: minPrice, $lt: maxPrice }})
            if(code) return products.find({code: code})
            if(title) return products.find({title: title})
            if(id) return products.findById(id)
            return products.find({})
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

            const codeIsUnique = await products.find({code: product.code})

            if(!codeIsUnique.length) {
                await products(product).save()
                return product
            } else {
                return {error: "El producto ya existe"}
            }
        }
        catch(err) {
            logger.error(err)
        }
    }

    update = async (data, id) => {
        try {
            await products.updateOne({_id: id}, data)
            return await this.get(id);
        }
        catch(err) {
            logger.error(err)
        }
    }

    delete = async (id) => {
        try {
            const deleted = await this.get(id)
            await products.deleteOne({_id: id})
            return deleted
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Product();