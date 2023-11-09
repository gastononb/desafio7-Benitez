import { Router } from "express";
import  cartModel  from "../dao/models/cartModel.js";
import {getProductsFromCart} from "../controllers/cartController.js"

const cartsViewsRouter = Router();

cartsViewsRouter.get("/", async (req, res) => {
	try {
		const result = await cartModel
			.find()
			.populate("products._id")
			.lean()
			.exec();

		console.log(result);
		res.render("allcarts", { result });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Error interno del servidor");
	}
});

cartsViewsRouter.get("/:cid", async (req, res) => {
	try {
		const result = await getProductsFromCart(req, res);

		const cart = result.response.payload;

		res.render("cart", { cart });
	} catch (error) {
		
		console.error("Error:", error);
		res.status(500).send("Error interno del servidor");
	}
});

export default cartsViewsRouter;