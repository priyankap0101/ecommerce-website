document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Checkout Page Loaded");

    displayOrderSummary();

    let checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) {
        console.error("❌ ERROR: Checkout form not found!");
        return;
    }

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("🛒 Placing Order...");
        placeOrder();
    });
});

// ✅ Display Order Summary (for "Buy Now" & Cart)
function displayOrderSummary() {
    let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    console.log("📦 Checkout Items:", checkoutItems);

    let orderSummaryContainer = document.getElementById("order-summary");
    let totalPriceElement = document.getElementById("total-price");

    if (!orderSummaryContainer || !totalPriceElement) {
        console.error("❌ ERROR: Order summary container not found!");
        return;
    }

    let totalPrice = 0;
    if (checkoutItems.length === 0) {
        orderSummaryContainer.innerHTML = "<p>No items selected for checkout.</p>";
        totalPriceElement.innerText = "0.00";
        return;
    }

    let summaryHTML = "";
    checkoutItems.forEach((item) => {
        summaryHTML += `<p>${item.name} - $${item.price.toFixed(2)}</p>`;
        totalPrice += item.price;
    });

    orderSummaryContainer.innerHTML = summaryHTML;
    totalPriceElement.innerText = totalPrice.toFixed(2);
}

// ✅ Place Order
function placeOrder() {
    let name = document.getElementById("name").value.trim();
    let address = document.getElementById("address").value.trim();
    let paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!name || !address || !paymentMethod) {
        alert("⚠️ Please fill in all required fields.");
        return;
    }

    let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    let totalAmount = checkoutItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    let orderNumber = "ORD-" + Math.floor(Math.random() * 1000000);

    localStorage.setItem("orderDetails", JSON.stringify({
        orderNumber: orderNumber,
        paymentMethod: paymentMethod.value,
        totalAmount: totalAmount,
        items: checkoutItems
    }));

    alert("🎉 Order placed successfully!");

    localStorage.removeItem("checkoutItems");

    setTimeout(() => {
        window.location.href = "order-confirmation.html";
    }, 1000);
}
