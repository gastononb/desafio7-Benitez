import express from "express"
import cartsViewsRouter from "./routers/cartViewsRouter.js"
import productRouter from "./routers/productRouter.js"
import cartRouter from "./routers/cartRouter.js"
import handlebars from "express-handlebars"
import path from "path"
import dbConect from "./configuration/serverConfiguration.js"
import config from "./configuration/envConfig.js"
import { Server } from "socket.io"
import { __dirname } from "./utils.js"
import viewRouter from "./routers/viewsRouter.js"
import socketChat from "./listeners/socketChat.js"
import socketProducts from "./listeners/socketProducts.js"
import sessionsRouter from "./routers/sessionRouter.js"
import sessionsViewRouter from "./routers/sessionViewsRouter.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport"
import initializePassport from "./configuration/passportConfig.js";
const app = express();
const PORT =config.APISERVER.PORT

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static( path.join(__dirname,"public")));
app.engine("handlebars", handlebars.engine())
app.set('view engine', 'hbs');
app.set("view engine", "handlebars")
app.set("views", __dirname+"/views")

const dbUrl = config.MONGO.URI
const secret = config.MONGO.SECRET
app.use(
    session({
        store: MongoStore.create({ mongoUrl: dbUrl} ),
        secret: secret,
        resave: true,
        saveUninitialized: true,
    })
);
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/", sessionsViewRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/carts", cartsViewsRouter);
app.use('/', viewRouter);

dbConect()

const httpServer = app.listen(PORT, ()=> console.log('server up'));

const socketServer = new Server(httpServer)
socketProducts(socketServer)
socketChat(socketServer)


