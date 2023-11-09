import {productsModel} from "../models/productModel.js"


class ProductManager{
    categories = async () => {
        try {
            const categories = await productsModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: { $addToSet: "$category" }
                    }
                }
            ])

            return categories[0].categories

        }
        catch (err) {
            console.log(err);
            return err
        }

    }


    
    paginate = async (filterOption, paginateOption) =>{
        try{
            response = await productsModel.paginate(filterOption, paginateOption)
            return response
        } catch (error) {
            return {
                statusCode: 500,
                response: {
                    status: "error",
                    error: error.message,
                },
            };
    }
}
    getProductById = async (id) => {
        try {
            return await productsModel.findById(id)
            
        } catch (err) {
            return {error: err.message}
        }
    
    }


    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch (err) {
            return err
        }
      
      }


      updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product })
        } catch (err) {
            return err
        }
      
      }


      deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err
        }

    }
}
export default ProductManager;