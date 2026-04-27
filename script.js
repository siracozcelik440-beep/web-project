"use strict";

/*
  Project data simulates a backend/database table.
  In a real production app this would typically come from an API (JSON),
  but for course requirements we keep it in an array of objects and render
  it dynamically to the DOM.
*/
const products = [
  {
    id: 1,
    name: "fairing",
    category: "Bodywork",
    price: 2499,
    stock: "In Stock",
    featured: true,
    image: "assets/fairing.png",
    description: "Full replacement set reducing weight while improving airflow."
  },
  {
    id: 2,
    name: "winglet",
    category: "Aerodynamics",
    price: 799,
    stock: "In Stock",
    featured: true,
    image: "assets/winglet.png",
    description: "Track-focused winglets designed for high-speed corner stability."
  },
  {
    id: 3,
    name: "slider",
    category: "Protection",
    price: 339,
    stock: "Limited",
    featured: false,
    image: "assets/slider.png",
    description: "Impact-ready carbon-reinforced sliders for frame protection."
  },
  {
    id: 4,
    name: "tail",
    category: "Bodywork",
    price: 980,
    stock: "In Stock",
    featured: true,
    image: "assets/tail.png",
    description: "Ultra-light tail unit with premium glossy clearcoat."
  },
  {
    id: 5,
    name: "guard",
    category: "Ergonomics",
    price: 199,
    stock: "In Stock",
    featured: false,
    image: "assets/guard.png",
    description: "Improves rider grip feel while protecting boots and frame."
  },
  {
    id: 6,
    name: "intake",
    category: "Aerodynamics",
    price: 420,
    stock: "Pre-Order",
    featured: false,
    image: "assets/intake.png",
    description: "Engineered channels for cleaner airflow and aggressive styling."
  }
];

const featuredGrid = document.querySelector("#featuredGrid");
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const emptyState = document.querySelector("#emptyState");
const navToggle = document.querySelector("#navToggle");
const primaryNav = document.querySelector("#primaryNav");
const contactForm = document.querySelector("#contactForm");
const formSuccess = document.querySelector("#formSuccess");
const yearElement = document.querySelector("#year");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function createCardTemplate(product) {
  /*
    Template literals are used here because they produce readable, structured HTML
    and make it easy to inject dynamic values from each product object.
  */
  return `
    <article class="card" role="listitem" aria-label="${product.name}">
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-content">
        <h3>${product.name}</h3>
        <p class="meta">${product.category} • ${product.stock}</p>
        <p>${product.description}</p>
        <p class="price">${formatPrice(product.price)}</p>
      </div>
    </article>
  `;
}

function renderFeaturedItems() {
  const featuredProducts = products.filter((product) => product.featured);
  featuredGrid.innerHTML = featuredProducts.map(createCardTemplate).join("");
}

function renderCategoryOptions() {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const optionsMarkup = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
  categorySelect.insertAdjacentHTML("beforeend", optionsMarkup);
}

function renderCatalog(filteredProducts) {
  productGrid.innerHTML = filteredProducts.map(createCardTemplate).join("");
  emptyState.hidden = filteredProducts.length !== 0;
}

function filterProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  const filtered = products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  renderCatalog(filtered);
}

function toggleMobileMenu() {
  const isOpen = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

const validators = {
  fullName: (value) => {
    if (value.trim().length < 3) return "Please enter at least 3 characters.";
    return "";
  },
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
    return "";
  },
  bikeModel: (value) => {
    if (value.trim().length < 2) return "Bike model should be at least 2 characters.";
    return "";
  },
  message: (value) => {
    if (value.trim().length < 12) return "Please write at least 12 characters.";
    return "";
  }
};

function showFieldError(fieldName, message) {
  const errorElement = document.querySelector(`#${fieldName}Error`);
  const inputElement = document.querySelector(`#${fieldName}`);
  errorElement.textContent = message;
  inputElement.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(fieldName) {
  const field = document.querySelector(`#${fieldName}`);
  const message = validators[fieldName](field.value);
  showFieldError(fieldName, message);
  return !message;
}

function setupFormValidation() {
  const fieldNames = Object.keys(validators);

  fieldNames.forEach((fieldName) => {
    const field = document.querySelector(`#${fieldName}`);
    /*
      Real-time validation improves UX by giving immediate feedback
      instead of waiting until submit.
    */
    field.addEventListener("input", () => {
      validateField(fieldName);
      formSuccess.textContent = "";
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formIsValid = fieldNames.every((fieldName) => validateField(fieldName));

    if (!formIsValid) {
      formSuccess.textContent = "";
      return;
    }

    formSuccess.textContent = "Your request has been received. We will contact you shortly.";
    contactForm.reset();
    fieldNames.forEach((fieldName) => showFieldError(fieldName, ""));
  });
}

function setupEventListeners() {
  searchInput.addEventListener("input", filterProducts);
  categorySelect.addEventListener("change", filterProducts);
  navToggle.addEventListener("click", toggleMobileMenu);

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function init() {
  renderFeaturedItems();
  renderCategoryOptions();
  renderCatalog(products);
  setupEventListeners();
  setupFormValidation();
  yearElement.textContent = String(new Date().getFullYear());
}

init();
