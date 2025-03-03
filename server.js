const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const PRODUCTS_FILE = "products.json";
const CART_FILE = "cart.json";

// Load products
app.get("/products", (req, res) => {
    fs.readFile(PRODUCTS_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load products" });
        res.json(JSON.parse(data));
    });
});

// Get product details
app.get("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(PRODUCTS_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load product details" });
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);
        product ? res.json(product) : res.status(404).json({ error: "Product not found" });
    });
});

// Get cart items
app.get("/cart", (req, res) => {
    fs.readFile(CART_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to load cart" });
        res.json(JSON.parse(data));
    });
});

// Add to cart
app.post("/cart", (req, res) => {
    const { id, name, price, image } = req.body;

    if (!id || !name || !price || !image) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    fs.readFile(CART_FILE, (err, data) => {
        let cart = err ? [] : JSON.parse(data);
        
        // ✅ Ensure no duplicate items are added
        const existingItem = cart.find(item => item.id === id);
        if (!existingItem) {
            cart.push({ id, name, price, image });
        }

        fs.writeFile(CART_FILE, JSON.stringify(cart, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to update cart" });
            res.json({ message: "Added to cart", cart });
        });
    });
});
