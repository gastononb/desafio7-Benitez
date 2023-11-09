import config from "../configuration/envConfig.js";
import productModel from "../dao/models/productModel.js";
import mongoose from "mongoose";


const PORT = config.APISERVER.PORT;

export const getAllProducts = async (req, res) => {
	try {
		const limit = req.query.limit || 10;
		const page = req.query.page || 1;

		const filterOptions = {};

		if (req.query.stock) filterOptions.stock = req.query.stock;
		if (req.query.category) filterOptions.category = req.query.category;

		const paginateOptions = { lean: true, limit, page };

		if (req.query.sort === "asc") paginateOptions.sort = { price: 1 };
		if (req.query.sort === "desc") paginateOptions.sort = { price: -1 };

		const result = await productModel.paginate(filterOptions, paginateOptions);

		let prevLink;

		if (!req.query.page) {
			prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${result.prevPage}`;
		} else {
			const modifiedUrl = req.originalUrl.replace(
				`page=${req.query.page}`,
				`page=${result.prevPage}`
			);
			prevLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
		}
		let nextLink;

		if (!req.query.page) {
			nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`;
		} else {
			const modifiedUrl = req.originalUrl.replace(
				`page=${req.query.page}`,
				`page=${result.nextPage}`
			);
			nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`;
		}
		return {
			statusCode: 200,
			response: {
				status: "success",
				payload: result.docs,
				totalPages: result.totalPages,
				prevPage: result.prevPage,
				nextPage: result.nextPage,
				page: result.page,
				hasPrevPage: result.hasPrevPage,
				hasNextPage: result.hasNextPage,
				prevLink: result.hasPrevPage ? prevLink : null,
				nextLink: result.hasNextPage ? nextLink : null,
			},
		};
	} catch (error) {
		return {
			statusCode: 500,
			response: {
				status: "error",
				error: error.message,
			},
		};
	}
};

export const getProducts = async (req, res) => {
	try {
		console.log(products);
		const products = await getAllProducts(req, res);
		res.status(products.statusCode).json(products); 
		console.log(products);
	} catch (error) {
		console.log("Error:", error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

export const getProductById = async (req, res) => {
	try {
		const id = req.params.pid;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "ID de producto no válido." });
		}

		const product = await productModel.findById(id).lean().exec();

		if (!product) {
			return res.status(404).json({ error: "Producto no encontrado." });
	}

		res.status(200).json({ payload: product });
	} catch (error) {
		console.log("Error al obtener el producto:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const addProduct = async (req, res) => {
	try {
		const { title, description, price, thumbnail, code, stock, category } =
			req.body;

		const newProduct = new productModel({
			title,
			description,
			price,
			thumbnail,
			code,
			stock,
			category,
		});

		const addedProduct = await newProduct.save();

		res.status(201).json({
			message: "Producto agregado exitosamente.",
			payload: addedProduct,
		});
	} catch (error) {
		console.log("Error al agregar el producto:", error.message);
		res.status(500).json({ error: error.message });
	} finally {
		if (res.statusCode == 201) {
			console.log("Publicación completada con éxito");
		} else {
			console.log("Error en la publicación");
		}
	}
};

export const updateProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const updatedProductdata = req.body;

		const updatedProduct = await productModel.findByIdAndUpdate(
			id,
			updatedProductdata,
			{
				new: true,
			}
		);

		if (!updatedProduct) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${id} no encontrado.` });
		}

		res.status(200).json({
			message: "Producto actualizado exitosamente.",
			product: updatedProduct,
		});
	} catch (error) {
		console.log("Error al actualizar el producto:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	let deletedProduct;

	try {
		const id = req.params.pid;

		deletedProduct = await productModel.findByIdAndRemove(id);

		if (!deletedProduct) {
			return res
				.status(404)
				.json({ error: `Producto con ID ${id} no encontrado.` });
		}

		res.status(200).json({
			message: "Producto eliminado exitosamente.",
			productDeleted: deletedProduct,
		});
	} catch (error) {
		console.log("Error al eliminar el producto:", error.message);
		res.status(500).json({ error: error.message });
	} finally {
		if (deletedProduct) {
			console.log(
				`Producto con ID ${deletedProduct._id} eliminado:`
			);
			console.log(deletedProduct);
		}
	}
};

export const getProductsView = async (req, res) => {
	try {
		const filterOptions = {};
		if (req.query.category) {
			filterOptions.category = req.query.category;
		}

		const products = await getAllProducts(req, filterOptions);

		if (products.statusCode === 200) {
			const totalPages = [];
			let link;
			const currentPage = parseInt(req.query.page || 1);

			for (let index = 1; index <= products.response.totalPages; index++) {
				const isCurrent = index === currentPage;

				if (!req.query.page) {
					link = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${index}`;
				} else {
					const modifiedUrl = req.originalUrl.replace(
						`page=${req.query.page}`,
						`page=${index}`
					);
					link = `http://${req.hostname}:${PORT}${modifiedUrl}`;
				}
				totalPages.push({ page: index, link, isCurrent });
			}

			const categories = await productModel.distinct("category").exec();

			categories.unshift("Todas las categorías");

			const user = req.user?.user;

			const cartID = user?.cart;
			const isAdmin = user?.role === "admin";

			const paginateInfo = {
				hasPrevPage: products.response.hasPrevPage,
				hasNextPage: products.response.hasNextPage,
				prevLink: products.response.prevLink,
				nextLink: products.response.nextLink,
				totalPages,
			};

			const updatedProducts = products.response.payload.map((product) => ({
				...product,
				cartID: cartID,

			}));

			console.log(updatedProducts);
			res.render("home", {
				isAdmin,
				user,
				products: updatedProducts,
				paginateInfo,
				categories,
				cartID,
			});
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Error interno del servidor");
	}
};

export const getProductByIDView = async (req, res) => {
	try {
		const id = req.params.pid;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "ID de producto no válido." });
		}

		const product = await productModel.findById(id).lean().exec();

		if (!product) {
			return res.status(404).json({ error: "Producto no encontrado." });
		}
		const user = req.user;

		const cartID = user.cart;

		res.render("productPage", { product, cartID });
	} catch (error) {
		console.log("Error al obtener el producto:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const realTimeProductsView = async (req, res) => {
	try {
		const products = await productModel.find().lean().exec();
		const processedProducts = products.map((product) => ({
			...product,
			shortId: product._id.toString().slice(-4),
		}));
		res.render("realTimeProducts", { processedProducts });
	} catch (error) {
		console.error("Error:", error);
		res.status(500).send("Error interno del servidor");
	}
};
