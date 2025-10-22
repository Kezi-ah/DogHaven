document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.querySelector(".cart-count");
  const emptyCartSection = document.getElementById("empty-cart");
  const cartContainer = document.getElementById("cart-container");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  // Load from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🔁 Update everything on page load
  updateCartView();

  // 🧠 Function to render the cart view
  function updateCartView() {
    cartCount.textContent = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    if (cart.length === 0) {
      emptyCartSection.classList.remove("hidden");
      cartContainer.classList.add("hidden");
    } else {
      emptyCartSection.classList.add("hidden");
      cartContainer.classList.remove("hidden");
    }

    renderCartItems();
    updateSummary();
  }

  // 🎨 Function to render each cart item
  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>₦${item.price.toLocaleString()}</p>
        </div>

        <div class="quantity-control">
          <button class="qty-btn decrease" data-index="${index}">−</button>
          <span class="quantity">${item.quantity || 1}</span>
          <button class="qty-btn increase" data-index="${index}">+</button>
        </div>

        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      cartItemsContainer.appendChild(itemDiv);
    });

    // Add button event listeners
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartView();
      });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1); // Remove item if it hits 0
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartView();
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartView();

      });
    });
  }

  // 💰 Calculate totals
  function updateSummary() {
    let subtotal = cart.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    let tax = subtotal * 0.05;
    let total = subtotal + tax;

    subtotalEl.textContent = subtotal.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);

    // 💾 Save order totals in localStorage
    const orderSummary = { subtotal, tax, total };
    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
  }

});


document.addEventListener("DOMContentLoaded", () => {
  console.log("Cart.js loaded ✅");

  const checkoutBtn = document.getElementById("checkout-btn");
  console.log("Checkout button:", checkoutBtn);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      console.log("Checkout button clicked 🚀");
      // Store the cart data for the confirmation page
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      localStorage.setItem("checkoutItems", JSON.stringify(cart));

      // Redirect directly to confirmation page
      window.location.href = "checkout.html";
    });
  } else {
    console.error("Checkout button not found ❌");
  }
});

// Load order data
window.addEventListener("DOMContentLoaded", () => {
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));

  if (orderSummary) {
    document.getElementById("subtotal").textContent = orderSummary.subtotal.toFixed(2);
    document.getElementById("tax").textContent = orderSummary.tax.toFixed(2);
    document.getElementById("total").textContent = orderSummary.total.toFixed(2);

    const payBtn = document.getElementById("payBtn");
    if (payBtn) payBtn.textContent = `Complete Payment - $${orderSummary.total.toFixed(2)}`;
  }

  // Show default card section if payment page
  const cardDetails = document.getElementById("card-details");
  if (cardDetails) cardDetails.style.display = "block";
});



// Switch payment methods
function selectMethod(method) {
  const methods = ['card', 'paypal', 'bank'];
  methods.forEach(m => {
    document.getElementById(`${m}-method`).classList.remove('active');
    document.getElementById(`${m}-details`).style.display = 'none';
  });

  document.getElementById(`${method}-method`).classList.add('active');
  document.getElementById(`${method}-details`).style.display = 'block';
}

// Simulate payment processing
function processPayment() {
  const btn = document.getElementById('payBtn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  setTimeout(() => {
    window.location.href = 'confirmation.html';
  }, 2000);
}

function saveAndContinue() {
  // Get user details
  const userInfo = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    street: document.getElementById("street").value.trim(),
    city: document.getElementById("city").value.trim(),
    state: document.getElementById("state").value.trim(),
    instructions: document.getElementById("instructions").value.trim(),
  };

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const orderSummary = JSON.parse(localStorage.getItem("orderSummary")) || { subtotal: 0, tax: 0, total: 0 };

  const orderData = {
    userInfo,
    cartItems,
    order: orderSummary
  };

  localStorage.setItem("checkoutData", JSON.stringify(orderData));
  console.log(" Checkout data saved:", orderData);
}


// ================================
// 🐶 CONFIRMATION PAGE LOGIC
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.href.includes("confirmation.html")) return;

  const data = JSON.parse(localStorage.getItem("checkoutData"));
  if (!data) {
    console.error("❌ No checkout data found!");
    return;
  }

  // Generate random order number
  const orderNumber = "DOG-" + Date.now();

  // Current order date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB"); // e.g. 21/10/2025

  // Expected delivery (2 weeks later)
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 14);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // 🐾 Fill order number & summary
  document.getElementById("order-number").textContent = orderNumber;
  document.getElementById("summary-order-number").textContent = orderNumber;
  document.getElementById("order-date").textContent = formattedDate;

  // 💰 Summary totals
  document.getElementById("summary-subtotal").textContent = data.order.subtotal.toLocaleString();
  document.getElementById("summary-tax").textContent = data.order.tax.toLocaleString();
  document.getElementById("summary-total").textContent = data.order.total.toLocaleString();

  // 📦 Delivery info
  const addressLines = `
  ${data.userInfo.address || "No address provided"}<br>
   ${data.userInfo.phone || "No phone number"}
`;
  document.getElementById("delivery-address").innerHTML = addressLines;
  document.getElementById("expected-delivery").textContent = formattedDelivery;
  document.getElementById("email-display").textContent = data.userInfo.email || "";

  // 🐶 Render dog list
  const dogList = document.getElementById("dog-list");
  data.cartItems.forEach((dog) => {
    const div = document.createElement("div");
    div.classList.add("dog-item");
    div.innerHTML = `
      <div class="dog-card">
        <img src="${dog.image}" alt="${dog.name}" />
        <div>
          <h4>${dog.name}</h4>
          <p>${dog.breed || ""} • ${dog.age || ""}</p>
          <p>Quantity: ${dog.quantity || 1}</p>
        </div>
        <span class="price">₦${dog.price.toLocaleString()}</span>
      </div>
    `;
    dogList.appendChild(div);
  });

  console.log("✅ Confirmation page loaded successfully!");
});
