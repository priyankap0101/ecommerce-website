document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("product-list")) {
        loadProducts();
    }
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    if (document.getElementById("product-container")) {
        loadProductDetails(); // ✅ Load product details for product.html
    }
    updateCartCount();
});

// ✅ Load Products from JSON and Display on Home Page
function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("product-list");

            products.forEach(product => {
                let productElement = document.createElement("div");
                productElement.classList.add("product");
                productElement.innerHTML = `
                    <img src="${product.image}" width="150">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}">View Details</a>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error("Error loading products:", error));
}

// ✅ Load Product Details on product.html
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("product-container").innerHTML = "<p>Product not found.</p>";
        return;
    }

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id == productId);
            if (product) {
                document.getElementById("product-container").innerHTML = `
                    <img src="${product.image}" width="200">
                    <h2>${product.name}</h2>
                    <p class="price">Price: $${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
            } else {
                document.getElementById("product-container").innerHTML = "<p>Product not found.</p>";
            }
        })
        .catch(error => console.error("Error loading product details:", error));
}

// ✅ Add to Cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.includes(productId)) {
        alert("This item is already in your cart!");
        return;
    }

    cart.push(Number(productId));
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart successfully!");
}

// ✅ Update Cart Count & Total Price
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

// ✅ Display Cart Items on Cart Page
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
                        <p >Price: $${product.price.toFixed(2)}</p>
                        <button onclick="removeFromCart(${product.id})">Remove</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    totalPrice += product.price;
                }
            });

            cartTotalElement.innerText = totalPrice.toFixed(2);
        })
        .catch(error => console.error("Error loading products:", error));
}

// ✅ Remove Item from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart.filter(id => id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    displayCart();
    updateCartCount();
}

// ✅ Checkout Function
function checkout() {
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}
