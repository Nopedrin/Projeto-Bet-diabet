document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            alert(`Login realizado com sucesso! Bem-vindo, ${usuario.username}`);
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        } else {
            alert("Email ou senha incorretos!");
        }

        form.reset();
    });
});