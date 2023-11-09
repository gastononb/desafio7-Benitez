import ProductManager from "../dao/controllers/productManager.js";
const productManager = new ProductManager()
const socketProducts = (socketServer)=>{
socketServer.on("connection", async(socket)=>{
    console.log("client connected, Id:", socket.id);
    const productList = await productManager.paginate();
    socket.emit("products", productList);

    socket.on('addProduct', async data => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.paginate(); 
socket.emit('productosupdated', updatedProducts);})

socket.on("deleteProduct", async (id) => {
    console.log("ID del producto a eliminar:", id);
    const deletedProduct = await productManager.deleteProduct(id);
    const updatedProducts = await productManager.paginate();
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
  
  