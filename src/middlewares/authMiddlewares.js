export const privateRoutes = (req, res, next) => {
	if (req.session.user) return res.redirect("/productos");
	next();
};

export const publicRoutes = (req, res, next) => {
	if (!req.session.user) return res.redirect("/login");
	next();
};