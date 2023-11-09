import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({

    products: {
        type:[{
            userEmail: {
                type: String,
                required: true,
                unique: true,
            },
                _id:{
                    type: mongoose.Types.ObjectId,
                    ref: 'products'
                },
                quantity:{
                    type: Number,
                    default:1
                }
                    
            }
        ],
        default:[]
    }
});
cartSchema.pre('find', function(next){
    this.populate('products._id');
    next();
});
const cartModel = mongoose.model(cartCollection, cartSchema)
export default cartModel 
