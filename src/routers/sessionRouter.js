import { Router } from "express";
import * as sessionController from "../controllers/sessionController.js";
import passport from "passport";


const sessionsRouter = Router();
sessionsRouter.post("/register",passport.authenticate('register', {failureRedirect: '/session/registerFail'}), sessionController.register)


sessionsRouter.post("/login",passport.authenticate('login', {failureRedirect: '/session/loginFail'}), sessionController.login );

sessionsRouter.get("/logout", sessionController.logout)
export default sessionsRouter;