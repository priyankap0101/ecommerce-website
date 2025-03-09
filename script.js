document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("product-list")) {
        loadProducts();
    }
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    updateCartCount();
});

// Load Products from JSON and Display on Home Page
function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("product-list");

            products.forEach(product => {
                let productElement = document.createElement("div");
                productElement.classList.add("product");
                productElement.innerHTML = `
                    <img src="${product.image}" width="100">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error("Error loading products:", error));
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.includes(productId)) {
        alert("This item is already in your cart!");
        return; // Stop execution if item is already in cart
    }

    cart.push(Number(productId)); // Ensure IDs are stored as numbers
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart successfully!");
}

// Update Cart Count & Total Price
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPrice = 0;
    document.getElementById("cart-count").innerText = cart.length;

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            totalPrice = cart.reduce((sum, productId) => {
                let product = products.find(p => p.id === Number(productId));
                return product ? sum + product.price : sum;
            }, 0);

            let totalElement = document.getElementById("cart-total-price");
            if (totalElement) {
                totalElement.innerText = totalPrice.toFixed(2);
            }
        })
        .catch(error => console.error("Error loading products:", error));
}

// Display Cart Items on Cart Page
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalElement.innerText = "0.00";
        return;
    }

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            cartItemsContainer.innerHTML = "";

            cart.forEach(productId => {
                let product = products.find(p => p.id === Number(productId));
                if (product) {
                    let itemElement = document.createElement("div");
                    itemElement.classList.add("cart-item");
                    itemElement.innerHTML = `
                        <img src="${product.image}" width="50">
                        <h4>${product.name}</h4>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <button onclick="removeFromCart(${product.id})">Remove</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    totalPrice += product.price;
                }
            });

            // ✅ Update the cart total on cart page
            cartTotalElement.innerText = totalPrice.toFixed(2);
        })
        .catch(error => console.error("Error loading products:", error));
}

// Remove Item from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart.filter(id => id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    displayCart();
    updateCartCount();
}

// Checkout Function
function checkout() {
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}
