import { Router } from "express";
import { __dirname } from "../utils.js";
import * as cartController from "../controllers/cartController.js";

const router = Router();



//ver todos los carritos 
router.get("/", cartController.getAllCarts)
//devuelve un carrito
router.get("/:cid", cartController.getCartByID)
//crear un carrito con o sin productos

router.post('/', cartController.createCart);
//colocar la cantidad de un producto
router.get("/:cid/product/:pid", cartController.addProductToCart)
// elimina producto del csrrito
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);

//actualiza productos en el carrito
router.put('/:cid', cartController.updateCart);


// ENDPOINT que elimina todos los productos de un carrito
router.delete('/:cid', cartController.deleteCart);

export default router