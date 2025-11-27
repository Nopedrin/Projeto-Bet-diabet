document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const contaNav = document.querySelector(".botoesHome a:last-child");

  if (usuarioLogado) {

    contaNav.innerHTML = `${usuarioLogado.username} - R$${usuarioLogado.saldo.toFixed(2)} <button id="sairBtn">Sair</button>`;

    const sairBtn = document.getElementById("sairBtn");
    sairBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  } else {
    if (!window.location.href.includes("login.html") && !window.location.href.includes("cadastro.html")) {
      window.location.href = "login.html";
    }
  }
});