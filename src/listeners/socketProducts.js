
import * as productController  from "../controllers/productController.js"

const socketProducts = (socketServer)=>{
socketServer.on("connection", async(socket)=>{
    console.log("client connected, Id:", socket.id);
    const productList = productController.getProducts
    socket.emit("products", productList);

    socket.on('addProduct', async data => {
    productController.addProduct(data)
    const updatedProducts = productController.getProducts; 
socket.emit('productosupdated', updatedProducts);})

socket.on("deleteProduct", async (id) => {
    console.log("ID del producto a eliminar:", id);
    const deletedProduct = productController.deleteProduct(id)
    const updatedProducts = productController.getProducts
    socketProduct.emit("productosUpdated", updatedProducts);
  });
  socket.on("nuevousuario",(usuario)=>{
    console.log("usuario" ,usuario)
    socket.broadcast.emit("broadcast",usuario)
   })
   socket.on("disconnect",()=>{
       console.log(`Usuario con ID : ${socket.id} esta desconectado `)
   })
})

}

export default socketProducts