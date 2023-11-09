import messageModel from "../dao/models/messageModel.js";

export const chatController = async (req, res) => {
	const messages = await messageModel.find().lean().exec();
	const user = req.user?.user;
	console.log(user);
	res.render("chat", { messages, user });
};