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
    document
      .getElementById("checkout-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        placeOrder();
      });
  }
  if (document.getElementById("order-number")) {
    loadOrderConfirmation();
  }

  updateCartCount();
});

// ✅ Function to Redirect to Checkout Page
function goToCheckout() {
  window.location.href = "checkout.html"; // ✅ Redirects to the checkout page
}

// ✅ Load Products from JSON and Display on Home Page
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

// ✅ Load Product Details on product.html
function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.getElementById("product-container").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      let product = products.find((p) => p.id == productId);
      if (product) {
        document.getElementById("product-container").innerHTML = `
                  <div class="product-container">
                      <img class="product-image" src="${product.image}" alt="${product.name}">
                      <div class="product-info">
                          <h2 class="product-name">${product.name}</h2>
                          <p class="price">$${product.price.toFixed(2)} 
                              <span class="original-price">$${(product.price * 1.2).toFixed(2)}</span> 
                              <span class="discount">20% OFF</span>
                          </p>
                          <p class="description">${product.description}</p>
                          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                      </div>
                  </div>
              `;
      } else {
        document.getElementById("product-container").innerHTML =
          "<p>Product not found.</p>";
      }
    })
    .catch((error) => console.error("Error loading product details:", error));
}

// ✅ Add to Cart
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart successfully!");
  } else {
    alert("This item is already in your cart!");
  }
}

// ✅ Update Cart Count
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.length;
}

// ✅ Display Cart Items on cart.html
function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsContainer = document.getElementById("cart-items");
  let cartTotalElement = document.querySelector(".total-price");
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalElement.innerText = "0.00";
    return;
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      cartItemsContainer.innerHTML = "";
      cart.forEach((productId) => {
        let product = products.find((p) => p.id === Number(productId));
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

      cartTotalElement.innerText = totalPrice.toFixed(2);
    })
    .catch((error) => console.error("Error loading products:", error));
}

// ✅ Remove Item from Cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((id) => id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// ✅ Load Order Confirmation Page
function loadOrderConfirmation() {
  let orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

  if (!orderDetails) {
    document.body.innerHTML =
      "<h2 style='text-align:center;'>No recent orders found.</h2>";
    return;
  }

  document.getElementById("order-number").innerText = orderDetails.orderNumber;
  document.getElementById("payment-method").innerText = orderDetails.paymentMethod;
  document.getElementById("order-total").innerText = orderDetails.totalAmount;

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      let orderedItemsContainer = document.getElementById("ordered-items");
      orderedItemsContainer.innerHTML = "";

      orderDetails.items.forEach((productId) => {
        let product = products.find((p) => p.id === Number(productId));
        if (product) {
          orderedItemsContainer.innerHTML += `<p>✅ ${product.name} - $${product.price.toFixed(2)}</p>`;
        }
      });
    })
    .catch((error) => console.error("Error loading products:", error));
}
