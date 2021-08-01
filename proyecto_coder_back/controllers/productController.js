import isAdmin from './adminController.js'
import { Product } from './repoController.js'

export class ProductController {
    async add(req, res) {
        if(!isAdmin) return res.json({
            error: -1, description: `ruta '${req.path}' método '${req.method}' no autorizada`
        })
        const data = req.body;
        const newData = await Product.add(data);
        if(!newData) {
            return res.json({
                error: "Algo salió mal"
            })
        }
        res.json(newData)
    }
    
    async get(req, res) {
        const { id, title, code, minPrice, maxPrice , minStock, maxStock } = req.query
        const data = await Product.get(id, title, code, minPrice, maxPrice , minStock, maxStock);
        if(!data || data.length < 1) {
            return res.json({
                error: "No hay archivos cargados"
            })
        }
        res.json(data)
    }

    async update(req, res) {
        if(!isAdmin) return res.json({
            error: -1, description: `ruta '${req.path}' método '${req.method}' no autorizada`
        })
        const data = req.body;
        const { id } = req.params;
        const updatedProduct = await Product.update(data, id)
        if(!updatedProduct) {
            return res.json({
                error: "producto no encontrado"
            })
        }
        res.json(updatedProduct);
    }

    async delete(req, res)  {
        if(!isAdmin) return res.json({
            error: -1, description: `ruta '${req.path}' método '${req.method}' no autorizada`
        })
        const { id } = req.params;
        const deletedProduct = await Product.delete(id)
        if(!deletedProduct) {
            return res.json({
                error: "producto no encontrado"
            })
        }
        res.json(deletedProduct);
    }
}

export default new ProductController();