const socketClient=io()
const nombreUsuario=document.getElementById("nombreUsuario")
const formulario=document.getElementById("formulario")
const inputMensaje=document.getElementById("mensaje")
const chat=document.getElementById("chat")

let usuario=null

if(!usuario){
    Swal.fire({
        title:"Bienvenido al chat de Gaston",
        text:"Ingresa tu usuario",
        input:"text",
        inputValidator:(value)=>{
            if(!value){
                return "Necesitas ingresar tu Nombre"
            }
        }
    })
    .then(username=>{
        usuario=username.value
        nombreUsuario.innerHTML=usuario
        socketClient.emit("nuevousuario",usuario)
    })
}


formulario.onsubmit=(e)=>{
    e.preventDefault()
    const info={
        user:usuario,
        message:inputMensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje",info)
    inputMensaje.value=" "

}

socketClient.on("chat", (mensaje) => {
    const chatRender = mensaje.map(e => {
        const formattedTime = new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `<p><strong>${e.user}</strong> (${formattedTime}): ${e.message}</p>`;

    }).join("");
    chat.innerHTML = chatRender;
});


 socketClient.on("broadcast",usuario=>{
    Toastify({
        text:`Ingreso ${usuario} al chat`,
        duration:5000,
        position:'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast()
 })

 // Manejo del clic en el botón "Vaciar Chat"
document.getElementById("clearChat").addEventListener("click", () => {
    // Borrar el contenido del chat en el cliente
    document.getElementById("chat").textContent = "";
    
    // Emitir el evento "clearchat" al servidor usando socketClient
    socketClient.emit("clearchat");
});