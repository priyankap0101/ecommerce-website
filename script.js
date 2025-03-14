document.addEventListener("DOMContentLoaded", function () {
    console.log("Page Loaded:", window.location.pathname);

    updateCartCount();
    
    if (document.getElementById("product-list")) {
        loadProducts();
    }
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    if (document.getElementById("product-container")) {
        loadProductDetails();
    }
});

// ✅ Load Products
function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.forEach(product => {
                let productElement = document.createElement("div");
                productElement.classList.add("product");
                productElement.innerHTML = `
                    <img src="${product.image}" width="150">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}">View Details</a>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
                `;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error("Error loading products:", error));
}

// ✅ Load Product Details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id === Number(productId));
            if (!product) {
                document.getElementById("product-container").innerHTML = "<p>Product not found.</p>";
                return;
            }

            let productDetails = `
                <img src="${product.image}" width="250">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
            `;

            document.getElementById("product-container").innerHTML = productDetails;
        })
        .catch(error => console.error("Error loading product details:", error));
}

// ✅ Add to Cart
function addToCart(productId) {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id === Number(productId));
            if (!product) return;

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            let existingItem = cart.find(item => item.id === productId);
            if (!existingItem) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                alert("Product added to cart! 🛒");
            } else {
                alert("This product is already in your cart.");
            }
        })
        .catch(error => console.error("Error adding to cart:", error));
}

// ✅ Buy Now - Skips Cart and Goes to Checkout
function buyNow(productId) {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id === Number(productId));
            if (!product) {
                alert("Product not found!");
                return;
            }
            localStorage.setItem("checkoutItems", JSON.stringify([product]));
            window.location.href = "checkout.html";
        })
        .catch(error => console.error("Error loading product details:", error));
}

// ✅ Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// ✅ Display Cart Items
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.getElementById("cart-total");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalElement.innerText = "0.00";
        return;
    }

    let total = 0;
    cart.forEach(product => {
        let item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <img src="${product.image}" width="50">
            <p>${product.name}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(item);

        total += product.price;
    });

    cartTotalElement.innerText = total.toFixed(2);
}

// ✅ Remove Item from Cart (Fix)
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}
