// The products are stored in a simple array of objects.
const products = [
  {
    id: 1,
    name: "Classic Backpack",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Everyday Sneakers",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  }
];

const productsList = document.querySelector("#products-list");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");

// Read saved cart data. If there is no saved cart, start with an empty array.
let cart = JSON.parse(localStorage.getItem("miniCart")) || [];

function displayProducts() {
  let productsHTML = "";

  products.forEach(function (product) {
    productsHTML += `
      <div class="col-sm-6 col-lg-3">
        <article class="card product-card">
          <img class="product-image" src="${product.image}" alt="${product.name}">
          <div class="card-body p-4">
            <h3 class="h5">${product.name}</h3>
            <p class="product-price mb-4">$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary w-100 mt-auto" data-id="${product.id}">Add to Cart</button>
          </div>
        </article>
      </div>`;
  });

  productsList.innerHTML = productsHTML;
}

function addToCart(productId) {
  const product = products.find(function (item) {
    return item.id === productId;
  });

  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCart();
}

function changeQuantity(productId, change) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (cartItem && cartItem.quantity + change >= 1) {
    cartItem.quantity += change;
  }

  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  updateCart();
}

function displayCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart mb-0">Your cart is empty. Add a product to get started!</p>';
    return;
  }

  let cartHTML = "";

  cart.forEach(function (item) {
    const subtotal = item.price * item.quantity;

    cartHTML += `
      <div class="cart-item row align-items-center g-3">
        <div class="col-md-4 cart-item-details">
          <h3 class="h6 mb-1">${item.name}</h3>
          <span class="text-muted">Unit price: $${item.price.toFixed(2)}</span>
        </div>
        <div class="col-7 col-md-3">
          <div class="quantity-controls">
            <button class="btn btn-outline-secondary btn-sm" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">−</button>
            <span class="quantity-number">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
          </div>
        </div>
        <div class="col-5 col-md-3 text-end fw-semibold">$${subtotal.toFixed(2)}</div>
        <div class="col-12 col-md-2 text-md-end">
          <button class="btn btn-link btn-sm text-danger p-0" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>`;
  });

  cartItems.innerHTML = cartHTML;
}

function calculateTotal() {
  let total = 0;

  cart.forEach(function (item) {
    total += item.price * item.quantity;
  });

  return total;
}

function updateCartCount() {
  let count = 0;

  cart.forEach(function (item) {
    count += item.quantity;
  });

  cartCount.textContent = count;
}

function saveCart() {
  localStorage.setItem("miniCart", JSON.stringify(cart));
}

function updateCart() {
  displayCart();
  cartTotal.textContent = "$" + calculateTotal().toFixed(2);
  updateCartCount();
  saveCart();
}

productsList.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    const productId = Number(event.target.dataset.id);
    addToCart(productId);
  }
});

cartItems.addEventListener("click", function (event) {
  const productId = Number(event.target.dataset.id);
  const action = event.target.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  } else if (action === "decrease") {
    changeQuantity(productId, -1);
  } else if (action === "remove") {
    removeFromCart(productId);
  }
});

displayProducts();
updateCart();
