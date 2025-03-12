document.addEventListener("DOMContentLoaded", function () {
  console.log("checkout.js is loaded!"); // ✅ Debug Log

  displayOrderSummary();

  let checkoutForm = document.getElementById("checkout-form");
  if (!checkoutForm) {
      console.error("❌ ERROR: Checkout form not found!");
      return;
  }

  checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Place Order button clicked!"); // ✅ Debug Log
      placeOrder();
  });
});

function displayOrderSummary() {
  let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  console.log("Checkout Items Retrieved:", checkoutItems); // ✅ Debug Log

  let orderSummaryContainer = document.getElementById("order-summary");
  if (!orderSummaryContainer) {
      console.error("❌ ERROR: Order summary container not found!");
      return;
  }

  let totalPrice = 0;
  if (checkoutItems.length === 0) {
      orderSummaryContainer.innerHTML = "<p>No items selected for checkout.</p>";
      return;
  }

  let summaryHTML = "<h3>Order Summary</h3>";
  checkoutItems.forEach((item) => {
      summaryHTML += `<p>${item.name} - $${item.price.toFixed(2)}</p>`;
      totalPrice += item.price;
  });

  summaryHTML += `<p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>`;
  orderSummaryContainer.innerHTML = summaryHTML;
}
// ✅ Place Order
function placeOrder() {
    let name = document.getElementById("name").value.trim();
    let address = document.getElementById("address").value.trim();
    let paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!name || !address || !paymentMethod) {
        alert("Please fill in all required fields.");
        return;
    }

    let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];

    // 🛠 Fix: Ensure the total amount is the sum of all selected items
    let totalAmount = checkoutItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    let orderNumber = "ORD-" + Math.floor(Math.random() * 1000000);

    localStorage.setItem("orderDetails", JSON.stringify({
        orderNumber: orderNumber,
        paymentMethod: paymentMethod.value,
        totalAmount: totalAmount, // ✅ Now correctly storing the full total
        items: checkoutItems
    }));

    alert("Order placed successfully! 🎉");

    localStorage.removeItem("checkoutItems");

    setTimeout(() => {
        window.location.href = "order-confirmation.html";
    }, 1000);
}
