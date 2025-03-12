document.addEventListener("DOMContentLoaded", function () {
    displayOrderSummary();

    document.getElementById("checkout-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page
        placeOrder();
    });
});

// ✅ Function to display cart items in order summary
function displayOrderSummary() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let orderSummary = document.getElementById("order-summary");
    let totalPrice = 0;

    if (cart.length === 0) {
        orderSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            orderSummary.innerHTML = "";
            cart.forEach(productId => {
                let product = products.find(p => p.id == productId);
                if (product) {
                    orderSummary.innerHTML += `<p>${product.name} - $${product.price.toFixed(2)}</p>`;
                    totalPrice += product.price;
                }
            });

            orderSummary.innerHTML += `<hr><p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>`;
        })
        .catch(error => console.error("Error loading products:", error));
}

// ✅ Function to place an order
function placeOrder() {
    let name = document.getElementById("name").value.trim();
    let address = document.getElementById("address").value.trim();
    let paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!name || !address || !paymentMethod) {
        alert("Please fill in all required fields.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let orderNumber = "ORD-" + Math.floor(Math.random() * 1000000);
    let totalAmount = document.querySelector("#order-summary").innerText.match(/\$([\d.]+)/);
    totalAmount = totalAmount ? totalAmount[1] : "0.00";

    // ✅ Save order details in localStorage
    localStorage.setItem("orderDetails", JSON.stringify({
        orderNumber: orderNumber,
        paymentMethod: paymentMethod.value,
        totalAmount: totalAmount,
        items: cart
    }));

    alert("Order placed successfully! 🎉");

    localStorage.removeItem("cart"); // Clear cart
    window.location.href = "order-confirmation.html"; // Redirect to confirmation page
}
