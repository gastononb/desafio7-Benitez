
export const register = async (req, res) => {
	res.redirect("/");
};

export const login = async (req, res) => {
	if (!req.user) {
		return res.status(401).render("error", { error: "Error al loguear" });
	}
	req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
		cart: req.user.cart,
		role: req.user.role
    }
	res.redirect("/products")
};

export const logout = (req, res) => {
    req.session.destroy((error) => {
		if (error) {
			console.log(error);
			res.status(500).render("error", { error: error });
		} else res.redirect("/");
	});
};