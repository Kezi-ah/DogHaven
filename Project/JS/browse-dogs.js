function filterDogs() {
  const breed = document.getElementById("breed").value.toLowerCase();
  const size = document.getElementById("size").value.toLowerCase();

  // Grab all dog cards
  const allDogs = document.querySelectorAll(".card");
  let matchFound = false;

  // Hide all by default
  allDogs.forEach(dog => dog.style.display = "none");
  document.getElementById("no-match").style.display = "none";

  // If no breed selected, show all dogs
  if (!breed) {
    allDogs.forEach(dog => dog.style.display = "block");
    return;
  }

  // Handle each breed condition
  if (breed === "golden retriever" && (size === "large" || size === "all sizes")) {
    document.getElementById("golden-retriever").style.display = "block";
    matchFound = true;
  } 
  else if (breed === "bulldog" && (size === "medium" || size === "all sizes")) {
    document.getElementById("bulldog").style.display = "block";
    matchFound = true;
  } 
  else if (breed === "german shepherd" && (size === "large" || size === "all sizes")) {
    document.getElementById("german-shepherd").style.display = "block";
    matchFound = true;
  } 
  else if (breed === "beagle" && (size === "small" || size === "all sizes")) {
    document.getElementById("beagle").style.display = "block";
    matchFound = true;
  } 
  else if (breed === "maltese" && (size === "small" || size === "all sizes")) {
    document.getElementById("maltese").style.display = "block";
    matchFound = true;
  } 
  else if (breed === "cocker spaniel" && (size === "medium" || size === "all sizes")) {
    document.getElementById("cocker-spaniel").style.display = "block";
    matchFound = true;
  }

  // If no matches
  if (!matchFound && breed) {
    document.getElementById("no-match").style.display = "block";
  }
}


fetch('browse-dogs.html')
  .then(res => res.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    let matchedHTML = '';

    matchedDogs.forEach(dogId => {
      const dogEl = doc.querySelector(`#${dogId}`);
      if (dogEl) matchedHTML += dogEl.outerHTML;
    });

    const resultContainer = document.getElementById('result');
    if (matchedHTML) {
      resultContainer.innerHTML = `
        <h2>Your Matches</h2>
        ${matchedHTML}
        <button id="retake">Retake Quiz</button>
      `;
      document.getElementById('retake').addEventListener('click', resetQuiz);
    } else {
      resultContainer.innerHTML = `<p>No Dogs Matching Your Criteria</p>
        <button id="retake">Retake Quiz</button>`;
      document.getElementById('retake').addEventListener('click', resetQuiz);
    }
  });



document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");

  // Load cart data from localStorage or start empty
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Function to update the cart count in navbar
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  // Run once on page load
  updateCartCount();

  // Select all Add to Cart buttons
  const addButtons = document.querySelectorAll(".add-to-cart");

  addButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // Stop page redirect
      
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");

      // Add item to cart
      cart.push({ name, price, image });

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update navbar count
      updateCartCount();

      // Show confirmation and redirect
      alert(`${name} has been added to your cart! 🐶`);
      window.location.href = "cart.html"; // Redirect AFTER saving
    });
  });
});
