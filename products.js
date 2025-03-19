document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("product-list")) {
        loadProducts();
    }
    updateCartCount(); 
});


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
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
                `;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error("Error loading products:", error));
}


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
