import fs from 'fs';
import logger from '../../lib/logger.js'

class Product {
    constructor() {
        this.path = "./productos.txt"
    }

    async get(id) {
        try {
            let files = await fs.promises.readFile(this.path, "utf-8");
            files = JSON.parse(files)
            if(!files) return false
            if(id) {
                const filtered = files.filter((product) => product.id === parseInt(id))[0];            
                if (!filtered) return false;
                return filtered;
            }
            return files
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
            let files = await this.get();
            if(!files) files = []

            if(files.length % 2 == 0) {
                data.thumbnail = "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"
            } else {
                data.thumbnail = "https://cdn3.iconfinder.com/data/icons/education-209/64/apple-fruit-science-school-512.png"
            }
            data.id = files.length + 1;
            data.timestamp = Date.now();
            files.push(data)

            await fs.promises.writeFile(this.path,
                JSON.stringify(files, null, "\t")
            )
            logger.info("Producto guardado con éxito")
            return data
        }
        catch(err) {
            logger.error(err)
        }
    }

    async update(data, id) {
        try {
            const files = await this.get();
            const filtered = files.filter((product) => product.id === parseInt(id))[0];
            if (!filtered) return false;
            filtered.title = data.title;
            filtered.description = data.description;
            filtered.code = data.code;
            filtered.thumbnail = data.thumbnail;
            filtered.price = data.price;
            filtered.stock = data.stock;
            await fs.promises.writeFile(this.path,
                JSON.stringify(files, null, "\t")
            )
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }

    async delete(id) {
        try {
            let files = await this.get();
            const filtered = files.filter((product) => product.id === parseInt(id));
            if (!filtered) return false
    
            files = files.filter((product) => product.id !== parseInt(id));

            await fs.promises.writeFile(this.path,
                JSON.stringify(files, null, "\t")
            )
            logger.info("Producto borrado con éxito")
            return filtered;
        }
        catch(err) {
            logger.error(err)
        }
    }
}

export default new Product();