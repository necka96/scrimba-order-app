import { menuData } from "./data.js";
let myOrder = [];
const icon = document.getElementById("icon");
// localstorage
const local = localStorage.getItem("theme");

if (local === "light") {
  document.body.classList.remove("dark-mode");
  icon.scr = "./image/moon.png";
} else if (local === "dark") {
  document.body.classList.add("dark-mode");
  icon.scr = "./image/sun.png";
}

// event
document.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    handleOrderClick(e.target.dataset.id);
  } else if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  } else if (e.target.id === "pay-btn") {
    handleOrderBtnClick();
  } else if (e.target.id === "submit-btn") {
    e.preventDefault();
    handleSubmint();
  } else if (e.target.id === "close") {
    document.querySelector(".form").classList.remove("active");
  } else if (e.target.id === "icon") {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      icon.src = "./image/sun.png";
    } else {
      localStorage.setItem("theme", "light");
      icon.src = "./image/moon.png";
    }
  }
});

// display order
const handleOrderClick = (itemId) => {
  const menuObj = menuData.filter((menuItem) => {
    return parseInt(menuItem.id) === parseInt(itemId);
  })[0];

  if (myOrder.includes(menuObj)) {
    menuObj.quantity++;
  } else {
    menuObj.quantity++;
    myOrder.unshift(menuObj);
    document.querySelector(".order").classList.add("active");
    document.querySelector(".order-message").classList.remove("active");
  }
  renderOrdersHtml();
  renderPrice(itemId);
};

// remove item from order list
const handleRemoveClick = (itemId) => {
  const menuObj = menuData.filter((menuItem) => {
    return parseInt(menuItem.id) === parseInt(itemId);
  })[0];

  if (menuObj.quantity >= 2) {
    menuObj.quantity--;
  } else if (menuObj.quantity === 1) {
    menuObj.quantity--;
    myOrder.filter((orderItem, index) => {
      if (parseInt(orderItem.id) === parseInt(itemId)) {
        myOrder.splice(index, 1);
      }
    });
  }

  renderPrice(itemId);
  renderOrdersHtml();
};

// render price from order with discount
const renderPrice = (itemId) => {
  const priceText = document.querySelector(".total-price-text");
  const price = document.querySelector(".price-holder");
  let totalPrice = 0;

  const menuObj = menuData.filter((menuItem) => {
    return parseInt(menuItem.id) === parseInt(itemId);
  })[0];

  myOrder.forEach((orderItem) => {
    totalPrice += orderItem.price * orderItem.quantity;
  });

  if (myOrder.length >= 3 || menuObj.quantity >= 3) {
    totalPrice -= 12;
    priceText.textContent = `Total price with discount of $12 :`;
  } else {
    priceText.textContent = `Total price:`;
  }
  price.textContent = `$${totalPrice}`;
};

// display order form
const handleOrderBtnClick = () => {
  if (myOrder.length > 0) {
    document.querySelector(".form").classList.add("active");
  }
};

// sumbint order form and display a message
const handleSubmint = () => {
  const input = document.querySelectorAll(".form input");
  const form = document.querySelector("#form");
  const orderMessage = document.querySelector(".order-message");
  const contactFomrData = new FormData(form);
  const name = contactFomrData.get("name");
  if (
    input[0].value !== "" &&
    input[1].value !== "" &&
    input[2].value.length === 3
  ) {
    form.classList.remove("active");
    document.querySelector(".order").classList.remove("active");
    orderMessage.classList.add("active");
    orderMessage.innerHTML = `
    <p>Thanks, ${name}! Your order is on its way!</p>
    `;
  }
  input[0].value = "";
  input[1].value = "";
  input[2].value = "";
  myOrder.splice(0, myOrder.length);
};

// order html structure
const getOrderHtml = () => {
  let orderHtml = ``;

  myOrder.forEach((orderItem) => {
    orderHtml += `
  <div class="order-container">
   <div class="order-item" data-item="${orderItem.id}">
     <p class="order-name">
      ${orderItem.name}
     </p>
  
       <button class="remove-btn" id="remove-id-${orderItem.id}" data-remove="${orderItem.id}" >remove</button>
   </div>
   <div class="price-item">
     <p class="price" id="price-${orderItem.id}">
     $${orderItem.price} * ${orderItem.quantity}
     </p>
   </div>
  
  </div>
  `;
  });
  return orderHtml;
};

// render order strukture
const renderOrdersHtml = () => {
  document.querySelector(".order-feed").innerHTML = getOrderHtml();
};

// html menu sturkture
const getMenuHtml = () => {
  let menuHtml = ``;

  menuData.forEach((menuItem) => {
    menuHtml += `
   <div class="menu-conteinar">
    <div class="menu-item">
     <div class="icon"><h2>${menuItem.emoji}</h2></div>
      <div class="menu-details">
       <p class="item-name">${menuItem.name}</p>
       <p class="item-ingredient">${menuItem.ingredients}</p>
       <p class="item-price">$${menuItem.price}</p>
      </div>
    </div>
    <div>
     <button class="menu-btn" ><i class="fa-solid fa-plus" data-id="${menuItem.id}"></i></button>
    </div>
   </div>
  `;
  });
  return menuHtml;
};

// render menu strukture
const renderMenuHtml = () => {
  document.querySelector(".order-menu").innerHTML = getMenuHtml();
};
renderMenuHtml();
