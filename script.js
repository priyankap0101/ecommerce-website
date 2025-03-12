document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("product-list")) {
        loadProducts();
    }
    if (document.getElementById("cart-items")) {
        displayCart();
    }
    if (document.getElementById("product-container")) {
        loadProductDetails();
    }
    if (document.getElementById("order-summary")) {
        displayOrderSummary();
    }
    if (document.getElementById("checkout-form")) {
        document.getElementById("checkout-form").addEventListener("submit", function (event) {
            event.preventDefault();
            placeOrder();
        });
    }
    if (document.getElementById("order-number")) {
        loadOrderConfirmation();
    }

    updateCartCount();

    let checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", proceedToCheckout);
    } else {
        console.error("❌ ERROR: checkout-btn not found!");
    }
});

// ✅ Load Products
function loadProducts() {
    fetch("products.json")
        .then((response) => response.json())
        .then((products) => {
            let productList = document.getElementById("product-list");
            products.forEach((product) => {
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
        .catch((error) => console.error("Error loading products:", error));
}

// ✅ Add to Cart
function addToCart(productId) {
    console.log("Adding to cart:", productId);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert("Product added to cart! 🛒");
    } else {
        alert("This product is already in your cart.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    displayCart();
    updateCartCount();

    let checkoutButton = document.getElementById("checkout-selected");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", proceedToCheckout);
    } else {
        console.error("❌ ERROR: checkout-selected button not found!");
    }
});

// ✅ Display Cart with Checkboxes
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.querySelector(".total-price");
    let totalPrice = 0;

    console.log("Cart Items (from localStorage):", cart);

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
                    itemElement.setAttribute("data-id", product.id);
                    itemElement.innerHTML = `
                        <input type="checkbox" class="cart-checkbox" value="${product.id}">
                        <img src="${product.image}" width="50">
                        <h4 class="product-name">${product.name}</h4>
                        <p class="product-price">Price: $${product.price.toFixed(2)}</p>
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

// ✅ Proceed to Checkout with Selected Items
function proceedToCheckout() {
    let selectedItems = [];
    document.querySelectorAll(".cart-item").forEach((item) => {
        let checkbox = item.querySelector("input.cart-checkbox");
        if (checkbox && checkbox.checked) {
            let productId = item.getAttribute("data-id");
            let productName = item.querySelector(".product-name").innerText;
            let productPrice = parseFloat(item.querySelector(".product-price").innerText.replace("Price: $", ""));

            selectedItems.push({
                id: productId,
                name: productName,
                price: productPrice
            });
        }
    });

    console.log("Selected Checkout Items:", selectedItems); // Debugging log

    if (selectedItems.length === 0) {
        alert("Please select at least one item to proceed to checkout.");
        return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    window.location.href = "checkout.html";
}

// ✅ Update Cart Count in Navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// ✅ Remove from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(id => Number(id) !== Number(productId)); // Fix type mismatch
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}


// ✅ Display Cart
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotalElement = document.querySelector(".total-price");
    let totalPrice = 0;

    console.log("Cart Items (from localStorage):", cart);

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
                    itemElement.setAttribute("data-id", product.id);
                    itemElement.innerHTML = `
                        <input type="checkbox" class="cart-checkbox" value="${product.id}">
                        <img src="${product.image}" width="50">
                        <h4 class="product-name">${product.name}</h4>
                        <p class="product-price">Price: $${product.price.toFixed(2)}</p>
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

// ✅ Remove from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(id => Number(id) !== Number(productId)); // Fix type mismatch
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// ✅ Proceed to Checkout
function proceedToCheckout() {
    let selectedItems = [];
    document.querySelectorAll(".cart-item").forEach((item) => {
        let checkbox = item.querySelector("input.cart-checkbox");
        if (checkbox && checkbox.checked) {
            let productId = item.getAttribute("data-id");
            let productName = item.querySelector(".product-name").innerText;
            let productPrice = parseFloat(item.querySelector(".product-price").innerText.replace("Price: $", ""));

            selectedItems.push({
                id: productId,
                name: productName,
                price: productPrice
            });
        }
    });

    console.log("Selected Checkout Items:", selectedItems); // Debug log

    if (selectedItems.length === 0) {
        alert("Please select at least one item to proceed to checkout.");
        return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    window.location.href = "checkout.html";
}
