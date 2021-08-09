import { Cart } from './repoController.js'
import logger from '../lib/logger.js'

class CartController {
    async add (req, res) {
        const username = req.user.username
        if(!username) {
            res.json({error: 'Debes estar logueado'})
        } else {
            const { productId } = req.params;
            const newData = await Cart.add(productId, username);
            if(!newData) {
                return res.json({
                    error: "producto no encontrado"
                })
            }
            res.status(201).json(newData)
        }
    }
    
    async get(req, res) {
        const { owner, id } = req.query
        const data = await Cart.get(owner, id);
        if(!data || data.length < 1) {
            return res.json({
                error: "No hay archivos cargados"
            })
        }
        res.json(data)
    }

    async delete(req, res) {
        const { productId } = req.params;
        const deletedProduct = await Cart.delete(productId)
        if(!deletedProduct) {
            return res.json({
                error: "producto no encontrado"
            })
        }
        res.json(deletedProduct);
    }

    async placeOrder(req, res) {
        const { username, id } = req.body;
        console.log(username)
        const data = await Cart.placeOrder(username);
        if(!data) {
            return res.json({
                error: "ha ocurrido un error"
            })
        }
        res.json(data)
    }
}

export default new CartController();