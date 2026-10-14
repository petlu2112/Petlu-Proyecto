// PETLÚS - JavaScript ES6
// IMPORTANTE: cambia este número por el WhatsApp de la marca, con código de país y solo dígitos.
// Perú: 51 + número. Número configurado para PETLÚS.
const WHATSAPP_NUMBER = "51908862769";

const products = [
  {id:1,name:"Pelota saltarina",category:"perros",label:"Más vendido",price:18.90,description:"Diversión y movimiento para sus paseos.",image:"https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Rascador de sisal",category:"gatos",label:"Favorito felino",price:49.90,description:"Un espacio para afilar sus garritas.",image:"https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Collar paseo feliz",category:"accesorios",label:"Nuevo",price:24.90,description:"Cómodo, bonito y listo para salir.",image:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Cama nube",category:"perros",label:"Súper cómodo",price:89.90,description:"Su rincón favorito para descansar.",image:"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Ratón de juguete",category:"gatos",label:"Hora de jugar",price:12.90,description:"Pequeño juguete para grandes aventuras.",image:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Comedero doble",category:"accesorios",label:"Práctico",price:35.00,description:"Su comida y agua siempre a la mano.",image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Premios crocantes",category:"perros",label:"Rico y feliz",price:16.50,description:"Un premio para celebrar sus logros.",image:"https://images.unsplash.com/photo-1582798358481-d199fb7347bb?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Varita con plumas",category:"gatos",label:"Instinto juguetón",price:14.90,description:"Para perseguir, saltar y jugar juntos.",image:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80"}
];

const money = value => new Intl.NumberFormat("es-PE", {style:"currency",currency:"PEN"}).format(value);
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const filterGroup = document.querySelector("#filterGroup");
const sortSelect = document.querySelector("#sortSelect");
const emptyState = document.querySelector("#emptyState");
const cartDrawer = document.querySelector("#cartDrawer");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartFooter = document.querySelector("#cartFooter");
const toast = document.querySelector("#toast");
let activeCategory = "todos";
let cart = JSON.parse(localStorage.getItem("petlus-cart") || "[]");
let toastTimer;

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  let visible = products.filter(product => {
    const categoryMatch = activeCategory === "todos" || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("es").includes(query);
    return categoryMatch && searchMatch;
  });
  if (sortSelect.value === "low") visible.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "high") visible.sort((a,b) => b.price - a.price);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-tag">${product.label}</span></div>
      <div class="product-info">
        <span class="product-category">${categoryName(product.category)}</span>
        <h3>${product.name}</h3><p class="product-description">${product.description}</p>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span><button class="add-button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">+</button></div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("hidden", visible.length > 0);
}
function categoryName(category) {
  return ({perros:"Para perros",gatos:"Para gatos",accesorios:"Accesorios"})[category] || category;
}
function saveCart() {
  localStorage.setItem("petlus-cart", JSON.stringify(cart));
  renderCart();
}
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({id,quantity:1});
  saveCart();
  showToast("¡Agregado al carrito! 🐾");
}
function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  cart = cart.filter(entry => entry.quantity > 0);
  saveCart();
}
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  showToast("Producto eliminado");
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum,item) => {
    const product = products.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  document.querySelector("#cartCount").textContent = count;
  document.querySelector("#drawerCount").textContent = `(${count})`;
  document.querySelector("#cartSubtotal").textContent = money(subtotal);
  cartEmpty.classList.toggle("hidden", count > 0);
  cartFooter.classList.toggle("hidden", count === 0);
  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    if (!product) return "";
    return `<div class="cart-row">
      <img src="${product.image}" alt="">
      <div><h3>${product.name}</h3><span class="row-price">${money(product.price * item.quantity)}</span>
      <div class="qty-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Quitar uno">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Agregar uno">+</button></div></div>
      <button class="remove-item" data-remove="${product.id}" aria-label="Eliminar ${product.name}">×</button>
    </div>`;
  }).join("");
}
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function sendOrder() {
  if (!cart.length) return;
  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return product ? `• ${product.name} x${item.quantity} — ${money(product.price * item.quantity)}` : "";
  }).filter(Boolean);
  const subtotal = cart.reduce((sum,item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0);
  const message = `¡Hola, PETLÚS! 🐾 Quiero hacer este pedido:\n\n${lines.join("\n")}\n\n*Subtotal: ${money(subtotal)}*\n\n¿Me ayudan a coordinar el envío?`;
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
filterGroup.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  filterGroup.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) removeItem(Number(removeButton.dataset.remove));
});
document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.querySelector("#continueShopping").addEventListener("click", () => { closeCart(); document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"}); });
document.querySelector("#checkoutButton").addEventListener("click", sendOrder);
document.querySelector("#contactWhatsapp").href = whatsappUrl("¡Hola, PETLÚS! 🐾 Quisiera información sobre sus productos.");
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#menuToggle").addEventListener("click", () => {
  const nav = document.querySelector("#mainNav");
  const isOpen = nav.classList.toggle("open");
  document.querySelector("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  document.querySelector("#mainNav").classList.remove("open");
  document.querySelector("#menuToggle").setAttribute("aria-expanded","false");
}));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

renderProducts();
renderCart();
