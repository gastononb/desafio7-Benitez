import { Router } from "express";
import { __dirname } from "../utils.js";

import * as productController from "../controllers/productController.js"


 const router = Router();
 router.get('/products', productController.getProductsView)
 
 router.get("/realtimeproducts", productController.realTimeProductsView)
router.get("/chat",(req,res)=>{
    res.render("chat")
    })

 export default router;
