const symbols = ["🍒", "🍋", "🍉", "💎", "🔔", "⭐", "🍀"];
const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];
const spinBtn = document.getElementById("spinBtn");
const resultado = document.getElementById("resultado");
const saldoBox = document.getElementById("saldoBox");

let valorApostaInput = document.getElementById("valorAposta");

function atualizarSaldoHeader() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado && saldoBox) {
        saldoBox.textContent = `Saldo: R$${usuarioLogado.saldo.toFixed(2)}`;
    }
}

function girarSlots() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Faça login para apostar.");
        window.location.href = "login.html";
        return;
    }

    const valorAposta = parseFloat(valorApostaInput.value);
    if (isNaN(valorAposta) || valorAposta <= 0) {
        return alert("Insira um valor de aposta válido.");
    }
    if (valorAposta > usuarioLogado.saldo) {
        return alert("Saldo insuficiente.");
    }

    usuarioLogado.saldo -= valorAposta;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    atualizarSaldoHeader();

    spinBtn.disabled = true;
    resultado.textContent = "";
    let results = ["", "", ""];

    reels.forEach((reel, i) => {
        const interval = setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            results[i] = reel.textContent;
            if (i === 2) verificarResultado(results, valorAposta, usuarioLogado);
        }, 1000 + i * 400);
    });
}

function verificarResultado(r, valorAposta, usuarioLogado) {
    let premio = 0;
    if (r[0] === r[1] && r[1] === r[2]) {
        premio = valorAposta * 10;
        resultado.textContent = `🎉 JACKPOT! Você ganhou R$${premio.toFixed(2)}! (${r[0]} ${r[1]} ${r[2]})`;
        resultado.style.color = "#00ff88";
    } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
        premio = valorAposta * 2;
        resultado.textContent = `💰 Você ganhou R$${premio.toFixed(2)}! (${r[0]} ${r[1]} ${r[2]})`;
        resultado.style.color = "#ffd700";
    } else {
        resultado.textContent = `😢 Nenhuma combinação. Você perdeu R$${valorAposta.toFixed(2)}. (${r[0]} ${r[1]} ${r[2]})`;
        resultado.style.color = "#ff5555";
    }

    usuarioLogado.saldo += premio;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    atualizarSaldoHeader();
    spinBtn.disabled = false;
}

spinBtn.addEventListener("click", girarSlots);
window.addEventListener("load", atualizarSaldoHeader);
