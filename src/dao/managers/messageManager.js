import messageModel from "../models/messageModel.js";

 class MessagesManager {
    getMessages = async () => {
      try {
        return await messageModel.find().lean().exec();
      } catch (error) {
        return error;
      }
    }
  
    createMessage = async (message) => {
      if (message.user.trim() === '' || message.message.trim() === '') {
         
          return null;
      }
  
      try {
          return await messageModel.create(message);
      } catch (error) {
          return error;
      }
  }
  

  deleteAllMessages = async () => {
    try {
        console.log("Deleting all messages...");
        const result = await messageModel.deleteMany({});
        console.log("Mensajes borrados:", result);
        return result;
    } catch (error) {
        console.error("Error al eliminar mensajes:", error);
        return error;
    }
}

  }
  export default MessagesManager