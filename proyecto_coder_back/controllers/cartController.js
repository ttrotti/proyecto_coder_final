import { Cart } from './repoController.js'

class CartController {
    async add (req, res) {
        if(!req.session.username) {
            console.log(req.session.passport)
            res.json({error: 'Debes estar logueado'})
        } else {
            const { id } = req.params;
            const newData = await Cart.add(id);
            if(!newData) {
                return res.json({
                    error: "producto no encontrado"
                })
            }
            res.status(201).json(newData)
        }
    }
    
    async get(req, res) {
        const { id } = req.params;
        const data = await Cart.get(id);
        if(!data || data.length < 1) {
            return res.json({
                error: "No hay archivos cargados"
            })
        }
        res.json(data)
    }

    async delete(req, res) {
        const { id } = req.params;
        const deletedProduct = await Cart.delete(id)
        if(!deletedProduct) {
            return res.json({
                error: "producto no encontrado"
            })
        }
        res.json(deletedProduct);
    }
}

export default new CartController();