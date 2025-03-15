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

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((product) => product.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }

  document
    .getElementById("clear-cart")
    .addEventListener("click", function () {
      localStorage.removeItem("cart");
      displayCart();
    });

  document
    .getElementById("checkout")
    .addEventListener("click", function () {
      alert("Proceeding to checkout...");
    });



document.getElementById("clear-cart").addEventListener("click", function () {
    localStorage.removeItem("cart");
    displayCart();
});

document.getElementById("checkout").addEventListener("click", function () {
    alert("Proceeding to checkout...");
});
