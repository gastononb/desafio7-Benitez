
const addToCartBtns = document.querySelectorAll(".addTocart");


// const productId = "product123"; // Reemplaza esto con la lógica para obtener el ID del producto
addToCartBtns.forEach((addToCartBtn) => {
	// Agrega un evento click a cada botón
	addToCartBtn.addEventListener("click", async () => {
	  // Obtén el ID del producto desde el atributo "data-product-id" del botón
	  const productId = addToCartBtn.getAttribute("data-product-id");
  
	  try {
		// Realiza una solicitud a tu API para obtener el producto
		const response = await fetch(`/api/products/${productId}`);
		if (!response.ok) {
		  // Maneja el caso en que el producto no se encuentre
		  throw new Error("Producto no encontrado");
		}
  
		const product = await response.json();
  
		// Ahora que tienes el producto, crea un nuevo carrito con este producto
		const cartResponse = await fetch("/api/carts", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		 body: JSON.stringify({
		 	products: [{ _id: product._id, quantity: 1 }],
		  }),
		});
		if (!cartResponse.ok) {
		  // Maneja el caso en que ocurra un error al crear el carrito
		  throw new Error("Error al crear el carrito");
		}
  
		const cart = await cartResponse.json();
		console.log("Carrito creado con éxito:", cart);
	  } catch (error) {
		console.error("Error:", error);
		// Maneja el error de la manera que mejor se adapte a tu aplicación
	  }
	  
	});
  });
  function incrementQuantity(button) { const productId =
	button.getAttribute("data-product-id"); const input =
	button.parentNode.querySelector('input[type="number"]'); input.value =
	parseInt(input.value) + 1; } function decrementQuantity(button) { const input
	= button.parentNode.querySelector('input[type="number"]'); const value =
	parseInt(input.value); if (value > 1) { input.value = value - 1; } }