const checkOutButton = document.getElementById("checkout-button");
const paymentGif = document.getElementById("payment-gif");

function animatedAction() {
  paymentGif.style = "display: flex";
  setTimeout(() => {
    location = "/"; // añadir la dirección de la sala de espera
  }, 2000);
}

checkOutButton.addEventListener("click", () => animatedAction());
