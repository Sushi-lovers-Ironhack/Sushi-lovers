const checkOutButton = document.getElementById("checkout-button");
const paymentGif = document.getElementById("payment-gif");

function animatedAction() {
  paymentGif.style = "display: flex";
  setTimeout(() => {
    const cartId = location.pathname.split("/")[3];
    location = `/cart/setcartordered/${cartId}`;
  }, 2000);
}

checkOutButton.addEventListener("click", () => animatedAction());
