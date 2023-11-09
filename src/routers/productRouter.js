import { Router } from "express";
import { __dirname, handlePolicies } from "../utils.js";
import * as productController from "../controllers/productController.js"

const router = Router();




router.get('/',handlePolicies, productController.getProducts)

// traer producto por id
router.get("/:pid",handlePolicies, productController.getProductById);

  // agregar un producto
  router.post("/", handlePolicies, productController.addProduct);

  // actualizar un producto
  router.put("/:pid", handlePolicies, productController.updateProduct);
 
  // borrar un producto
  router.delete("/:pid", handlePolicies, productController.deleteProduct);


export default router;