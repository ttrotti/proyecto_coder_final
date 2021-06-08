import { db } from '../../DB/db.js'

class Product {
   async get(id, title, code, minPrice, maxPrice , minStock, maxStock) {
        try {
            if(minStock && maxStock) return db.from('productos').whereBetween('stock', [minStock, maxStock])
            if(minPrice && maxPrice) return db.from('productos').whereBetween('price', [minPrice, maxPrice])
            if(code) return db.from('productos').where('code', code)
            if(title) return db.from('productos').where('title', title)
            if(id) return db.from('productos').where('id', id)
            return db.from('productos').select()
        }
        catch(err) {
            console.log(err)
        }
    }

    async add(product) {
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
            
            await db.from('productos').insert(product)
            return product
        }
        catch(err) {
            console.log(err)
        }
    }

    async update(data, id) {
        try {
            await db.from('productos').where({ id: id }).update(data)
            return await this.get(id);
        }
        catch(err) {
            console.log(err)
        }
    }

    async delete(id) {
        try {
            const deleted = await this.get(id)
            await db.from('productos').where({ id: id }).del()
            return deleted
        }
        catch(err) {
            console.log(err)
        }
    }
}

export default new Product();