import { Router } from "express";


const sessionsViewRouter = Router();

sessionsViewRouter.get("/register",  (req, res) => {
	res.render("session/register");
});
sessionsViewRouter.get("/failregister", (req, res) => {
	res.status(401).render("error", { error: "passport register failed" });
});

sessionsViewRouter.get("/",  (req, res) => {
	res.render("session/login");
});
sessionsViewRouter.get("/failregister", (req, res) => {
	res.status(401).render("error", { error: "passport login failed" });
});

export default sessionsViewRouter;