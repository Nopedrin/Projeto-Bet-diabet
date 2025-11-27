window.onload = function() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const saldoBox = document.getElementById("saldoBox");

  if (usuarioLogado) {
    saldoBox.textContent = `Saldo: R$${usuarioLogado.saldo.toFixed(2)}`;
  } else {
    saldoBox.textContent = "Saldo: --";
  }
};