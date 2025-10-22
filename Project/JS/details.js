''
  function addToCart() {
    const item = {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "2 years",
      price: 1500,
      image: "images/golden-retriever.jpg",
      quantity: 1
    };

    // Get cart or create new one
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push(item);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Redirect to cart page
    window.location.href = "cart.html";
  }


document.addEventListener('DOMContentLoaded', function() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    if (!navLinks.length) return;

    // 1) Build a list of target identifiers from nav links (unique)
    const targets = Array.from(new Set(navLinks.map(l => (l.getAttribute('data-target') || '').trim()).filter(Boolean)));

    // 2) Collect candidate content elements:
    //    - any element with class that exactly matches a target
    //    - any element with data-content attribute that matches a target
    //    - any element with id that matches a target
    //    - ALSO include elements whose class ends with "-content" (catch-all)
    const contentSet = new Set();

    // helper to add NodeList or element(s)
    function addNodes(nodes) {
      if (!nodes) return;
      if (nodes instanceof Element) contentSet.add(nodes);
      else nodes.forEach && nodes.forEach(n => n && contentSet.add(n));
    }

    // find by targets
    targets.forEach(t => {
      // try id
      addNodes(document.getElementById(t));
      // try data-content
      addNodes(document.querySelectorAll(`[data-content="${t}"]`));
      // try class (exact match in classList)
      addNodes(Array.from(document.querySelectorAll('*')).filter(el => Array.from(el.classList).some(c => c === t)));
      // try selector with dot (in case someone wrote ".class-name" inside data-target)
      if (t.startsWith('.') || t.startsWith('#')) {
        try { addNodes(document.querySelectorAll(t)); } catch(e) {}
      }
    });

    // also include everything that has a class ending with "-content" as a fallback
    addNodes(Array.from(document.querySelectorAll('*')).filter(el => Array.from(el.classList).some(c => c.endsWith('-content'))));

    // convert to array
    const allContents = Array.from(contentSet);

    // If we found nothing, as a final fallback include direct children of .container
    if (!allContents.length) {
      const container = document.querySelector('.container');
      if (container) addNodes(container.children);
    }

    // Final array
    const contents = Array.from(contentSet);

    // Utility: hide all content nodes
    function hideAll() {
      contents.forEach(node => {
        node.style.display = 'none';
        node.classList.remove('tab-visible');
        node.classList.add('tab-hidden');
      });
    }

    // Utility: show one node
    function showNode(node) {
      node.style.display = ''; // allow CSS to decide if any, but default to visible
      // Force block if computed display is none (to be safe)
      if (getComputedStyle(node).display === 'none') node.style.display = 'block';
      node.classList.remove('tab-hidden');
      node.classList.add('tab-visible');
    }

    // Initialize: hide all, then show the content that corresponds to the currently active nav-link (if any),
    // otherwise show the first content found
    (function init() {
      hideAll();

      // find a nav link that already has 'active'
      const preActiveLink = navLinks.find(l => l.classList.contains('active'));
      let initialShown = null;

      if (preActiveLink) {
        const t = preActiveLink.getAttribute('data-target');
        initialShown = findContentForTarget(t);
      }

      if (!initialShown && contents.length) initialShown = contents[0];

      if (initialShown) showNode(initialShown);
    })();

    // function: find appropriate content element for a given target string
    function findContentForTarget(target) {
      if (!target) return null;
      target = target.trim();
      // direct id
      const byId = document.getElementById(target);
      if (byId && contents.includes(byId)) return byId;

      // by data-content
      const byData = document.querySelector(`[data-content="${target}"]`);
      if (byData && contents.includes(byData)) return byData;

      // by exact class match
      const byClass = contents.find(n => Array.from(n.classList).some(c => c === target));
      if (byClass) return byClass;

      // by contains class that ends with target (rare)
      const byContains = contents.find(n => Array.from(n.classList).some(c => c.includes(target)));
      if (byContains) return byContains;

      // try selector with dot or hash
      if (target.startsWith('.') || target.startsWith('#')) {
        try {
          const node = document.querySelector(target);
          if (node && contents.includes(node)) return node;
        } catch (e) {}
      }

      return null;
    }

    // attach click handlers
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        // make this link active only
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // hide everything
        hideAll();

        // find the content to show
        const target = this.getAttribute('data-target') || '';
        const nodeToShow = findContentForTarget(target);

        if (nodeToShow) {
          showNode(nodeToShow);
        } else {
          // nothing found: try showing a content whose class includes the target substring
          const fallback = contents.find(n => Array.from(n.classList).some(c => c.indexOf(target) !== -1));
          if (fallback) showNode(fallback);
          else console.warn('Tabs: no content element matched target:', target);
        }

        console.log('Tab clicked ->', target);
      });
    });
  });

  function changeImage(src, index) {
  const mainImage = document.getElementById("mainDogImage");
  const imageCount = document.getElementById("imageCount");
  const thumbnails = document.querySelectorAll(".thumbnail");

  mainImage.src = src;
  imageCount.textContent = `${index} / ${thumbnails.length}`;

  thumbnails.forEach(t => t.classList.remove("active"));
  thumbnails[index - 1].classList.add("active");
}

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
