document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("cadastroForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const novoUsuario = { email, username, password, saldo: 200 };

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (usuarios.some(user => user.email === email)) {
            alert("Esse email já foi cadastrado!");
            return;
        }

        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Cadastro realizado com sucesso!");
        form.reset();
    });
});