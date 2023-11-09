import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";

export const getProductsFromCart = async (req, res) => {
	try {
		const id = req.params.cid;
		const result = await cartModel
			.findById(id)
			.populate("products.productId")
			.lean();

		if (result === null) {
			return {
				statusCode: 404,
				response: {
					status: "error",
					error: "Carrito no encontrado.",
					message: "Carrito no encontrado.",
				},
			};
		}

		return {
			statusCode: 200,
			response: {
				status: "success",
				payload: result,
			},
		};
	} catch (error) {
		return {
			statusCode: 500,
			response: {
				status: "error",
				message: "Error al recuperar productos del carrito.",
				error: error.message,
			},
		};
	}
};

export const getAllCarts = async (req, res) => {
	try {
		const allCarts = await cartModel.find().lean().exec();
		res.status(200).json(allCarts);
	} catch (error) {
		console.error(chalk.red("Error al recuperar carritos:", error.message));
		res.status(500).json({ error: error.message });
	}
};

export const createCart = async (req, res) => {
	try {
		const { userEmail } = req.body;

		if (!userEmail) {
			return res
				.status(400)
				.json({ error: "El correo electrónico del usuario es necesario para crear un carrito." });
		}

		const newCart = new cartModel({
			userEmail,
			products: [],
		});

		const savedCart = await newCart.save();

		res.status(201).json(savedCart);
	} catch (error) {
		console.error(chalk.red("Error al crear el carrito:", error.message));

		if (error.code === 11000) {
			return res.status(400).json({ error: "El correo electrónico del usuario ya existe." });
		}

		res.status(500).json({ error: error.message });
	}
};

export const updateCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const newQuantity = req.body.quantity;

		const cartToUpdate = await cartModel.findById(cartId).exec();

		if (!cartToUpdate) {
			return res
				.status(404)
				.json({ error: `Carrito con ID ${cartId} no encontrado.` });
		}

		const productIndex = cartToUpdate.products.findIndex(
			(productItem) => productItem.productId.toString() === productId
		);

		if (productIndex === -1) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${productId} no encontrado en el carrito.` });
		}

		if (newQuantity === 0) {
			cartToUpdate.products.splice(productIndex, 1);
		} else {
			cartToUpdate.products[productIndex].quantity = newQuantity;
		}

		const updatedCart = await cartToUpdate.save();
		res.status(200).json(updatedCart);
	} catch (error) {
		console.error("Error al actualizar la cantidad del producto en el carrito:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getCartByID = async (req, res) => {
	try {
		const result = await getProductsFromCart(req, res);
		res.status(200).json({ status: "success", payload: result });
	} catch (error) {
		console.error("Error al recuperar el carrito:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const quantity = req.body.quantity || 1;

		const cartToUpdate = await cartModel.findById(cartId).exec();

		if (!cartToUpdate) {
			return res
				.status(404)
				.json({ error: `Carrito con ID ${cartId} no encontrado.` });
		}

		const product = await productModel.findById(productId).exec();

		if (!product) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${productId} no encontrado.` });
		}

		const existingProduct = cartToUpdate.products.find(
			(productItem) => productItem.productId.toString() === productId
		);

		if (existingProduct) {
			existingProduct.quantity += quantity;
		} else {
			cartToUpdate.products.push({
				productId: product._id,
				quantity,
			});
		}

		const updatedCart = await cartToUpdate.save();
		res.status(200).json(updatedCart);
	} catch (error) {
		console.error("Error al agregar el producto al carrito:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteProductFromCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const cartToUpdate = await cartModel.findById(cartId);

		if (!cartToUpdate) {
			return res
				.status(404)
				.json({ error: `Carrito con ID ${cartId} no encontrado.` });
		}

		const productToDelete = await productModel.findById(productId);

		if (!productToDelete) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${productId} no encontrado.` });
		}

		const productIndex = cartToUpdate.products.findIndex(
			(product) => product.productId.toString() === productId
		);

		if (productIndex === -1) {
			return res.status(404).json({
				error: `Producto con ID ${productId} no encontrado en el carrito. ¿Quizás ya fue eliminado?`,
			});
		} else {
			cartToUpdate.products.pull({ productId: productToDelete._id });
			const updatedCart = await cartToUpdate.save();
			res.status(200).json(updatedCart);
		}
	} catch (error) {
		console.error("Error al eliminar el producto del carrito:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const cartToUpdate = await cartModel.findById(cartId);

		if (!cartToUpdate) {
			return res.status(404).json({
				error: `Carrito con ID ${cartId} no encontrado.`,
			});
		}

		cartToUpdate.products = [];

		const updatedCart = await cartToUpdate.save();
		res.status(200).json({ status: "success", payload: updatedCart });
	} catch (error) {
		console.error(`Error al eliminar todos los productos del carrito ${error.message}`);
		res.status(500).json({ error: error.message });
	}
};
