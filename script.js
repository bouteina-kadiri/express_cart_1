const loadProducts = async () => {
    const response = await fetch("/products");
    const products = await response.json();
    const productsDiv = document.getElementById("products");

    productsDiv.innerHTML = "";
    products.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onclick="viewProduct(${product.id})">
            <h3>${product.name} - $${product.price}</h3>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productsDiv.appendChild(div);
    });
};

const viewProduct = async (id) => {
    const response = await fetch(`/products/${id}`);
    const product = await response.json();
    alert(`Product: ${product.name}\nPrice: $${product.price}`);
};

const addToCart = async (id, name, price, image) => {
    if (!id || !name || !price || !image) {
        console.error("Invalid product data:", { id, name, price, image });
        return;
    }

    const response = await fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, price, image })
    });

    const result = await response.json();
    console.log("Added to cart:", result);
    loadCart();  // Refresh the cart display after adding an item
};


const loadCart = async () => {
    const response = await fetch("/cart");
    const cart = await response.json();
    const cartDiv = document.getElementById("cart");

    // ✅ Clear previous cart content before adding new items
    cartDiv.innerHTML = "";

    // ✅ Filter out any invalid entries
    cart.forEach(item => {
        if (!item.name || !item.price) return;  // Skip if missing values

        const div = document.createElement("div");
        div.innerHTML = `<h3>${item.name} - $${item.price}</h3>`;
        cartDiv.appendChild(div);
    });
};

window.onload = () => {
    loadProducts();
    loadCart();
};
