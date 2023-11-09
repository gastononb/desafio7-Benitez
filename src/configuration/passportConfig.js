import passport from "passport"
import local from 'passport-local'
import { createHash, isValidPassword } from "../utils.js"
import UserModel from "../dao/models/userModel.js"
import config from "../configuration/envConfig.js"
import cartModel from "../dao/models/cartModel.js"

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                return done(null, false,  { message: "El usuario ya existe" })
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash(password),role: email === config.ADMIN.EMAIL ? "admin" : "user"
            }
            const newCart = new cartModel({ userEmail: email, products: [] });
					await newCart.save();
                    newUser.cart = newCart._id;
            const result = await UserModel.create(newUser)
            return done(null, result)

        } catch(err) {
            return done(err)
        }
    }))

    passport.use(
        "login",
        new localStrategy({
        
            usernameField: "email",
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username });
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }
    
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: "Invalid password" });
                }
            
            
                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id)
        console.log(user._id);
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
        console.log(user);
    })

}

export default initializePassport