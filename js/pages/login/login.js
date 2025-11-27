document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (usuarioLogado) {
    loginSection.innerHTML = `
        <h2>Minha Conta</h2>
        <div class="user-info">
            <p><strong>Nome:</strong> ${usuarioLogado.username}</p>
            <p><strong>Email:</strong> ${usuarioLogado.email}</p>
            <p><strong>Saldo:</strong> R$${usuarioLogado.saldo.toFixed(2)}</p>
            <button id="logoutBtn">Sair da conta</button>
        </div>`;

    document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            location.reload();
            });

        return;
}

form.addEventListener("submit", (event) => {
event.preventDefault();
const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(
        (u) => u.email === email && u.password === password && u.username === username
        );

        if (usuario) {
            alert(`✅ Login realizado com sucesso! Bem-vindo, ${usuario.username}`);
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            location.reload();
        }
        else {
            alert("❌ Email, usuário ou senha incorretos!");
        }
        });
      });