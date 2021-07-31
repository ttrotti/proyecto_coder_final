import logger from '../../lib/logger.js'
let PRODUCTS = []

class Product {
    async get(id) {
        try {
            if(!PRODUCTS || PRODUCTS.length < 1) return false
            if(id) {
                const filtered = PRODUCTS.filter((product) => product.id === parseInt(id))[0];            
                if (!filtered) return false;
                return filtered;
            }
            return PRODUCTS
        }
        catch (err) {
            logger.error(err)
        }
    };
    
    async add(data) {
        try {
            if(data.title === undefined || data.title === '') {
                return({
                    error: "debe completar un título para su artículo"
                })
            }
            if(data.price === undefined || data.price === '') {
                return({
                    error: "debe completar un precio para su artículo"
                })
            }
            if(data.thumbnail === undefined || data.thumbnail === '') {
                return({
                    error: "debe completar un thumbnail para su artículo"
                })
            }
            if(data.stock === undefined || data.stock === '') {
                return({
                    error: "debe completar un stock para su artículo"
                })
            }
            if(data.description === undefined || data.description === '') {
                return({
                    error: "debe completar una descripción para su artículo"
                })
            }
            if(!PRODUCTS) PRODUCTS = []

            if(PRODUCTS.length % 2 == 0) {
                data.thumbnail = "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"
            } else {
                data.thumbnail = "https://cdn3.iconfinder.com/data/icons/education-209/64/apple-fruit-science-school-512.png"
            }
            data.id = PRODUCTS.length + 1;
            data.timestamp = Date.now();
            PRODUCTS.push(data)
            logger.trace("Producto guardado con éxito")
            return data
        }
        catch(err) {
            logger.error(err)
        }
    }

    async update(data, id) {
        try {
            const filtered = PRODUCTS.filter((product) => product.id === parseInt(id))[0];
            if (!filtered) return false;
            filtered.title = data.title;
            filtered.description = data.description;
            filtered.code = data.code;
            filtered.thumbnail = data.thumbnail;
            filtered.price = data.price;
            filtered.stock = data.stock;
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }

    async delete(id) {
        try {
            const filtered = PRODUCTS.filter((product) => product.id === parseInt(id));
            if (!filtered) return false
    
            PRODUCTS = PRODUCTS.filter((product) => product.id !== parseInt(id));

            logger.trace("Producto borrado con éxito")
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Product()