document.addEventListener("DOMContentLoaded", function () {
    displayCart();
});
window.addToCart = function(productId) {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id === Number(productId));
            if (!product) {
                alert("Product not found!");
                return;
            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));

            updateCartCount();
            alert("Product added to cart!");
        })
        .catch(error => console.error("Error adding product to cart:", error));
};


function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        return;
    }

    cart.forEach(product => {
        let item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <img src="${product.image}" width="50">
            <p>${product.name}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="buyNow(${product.id})">Buy Now</button>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;

        cartContainer.appendChild(item);
        total += product.price;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
}

// ✅ Buy Now (Redirects to Checkout)
function buyNow(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(p => p.id === productId);

    if (!product) {
        alert("Product not found in cart!");
        return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify([product])); // Store only the selected product
    window.location.href = "checkout.html"; // Redirect to checkout
}

// ✅ Remove Item from Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// ✅ Clear Entire Cart
document.getElementById("clear-cart").addEventListener("click", function () {
    localStorage.removeItem("cart");
    displayCart();
});
