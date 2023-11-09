import dotenv from "dotenv";

dotenv.config();

export default {
	APISERVER: {
		PORT: process.env.PORT || 8080,
	},
	MONGO: {
		URI: process.env.MONGO_URI,
		SECRET: process.env.MONGO_SECRET,
	
	},
	ADMIN: {
		EMAIL: process.env.ADMIN_EMAIL,
		PASSWORD: process.env.ADMIN_PASSWORD,
	},
	
};