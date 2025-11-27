const plane = document.getElementById('plane');
const multiplierDisplay = document.getElementById('multiplier');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resultado = document.getElementById('resultado');
const valorApostaInput = document.getElementById('valorAposta');
const saldoBox = document.getElementById('saldoBox');

let animation;
let currentMultiplier = 1;
let crashPoint = 0;
let posX = 0;
let posY = 0;
let stoppedEarly = false;

function atualizarSaldoHeader() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuarioLogado && saldoBox) {
        saldoBox.textContent = `Saldo: R$${usuarioLogado.saldo.toFixed(2)}`;
    }
}

function gerarCrashPoint() {
    const r = Math.random();
    const point = 1 + (-Math.log(1 - r) * 1);
    return parseFloat(Math.min(point, 20).toFixed(2));
}

function iniciarVoo() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert('Faça login para apostar.');
        window.location.href = 'login.html';
        return;
    }

    const valorAposta = parseFloat(valorApostaInput.value);
    if (isNaN(valorAposta) || valorAposta <= 0) {
        return alert('Insira um valor de aposta válido.');
    }
    if (valorAposta > usuarioLogado.saldo) {
        return alert('Saldo insuficiente.');
    }

    usuarioLogado.saldo -= valorAposta;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    atualizarSaldoHeader();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resultado.textContent = "";
    stoppedEarly = false;

    posX = 0;
    posY = 0;
    plane.style.left = "0%";
    plane.style.bottom = "0%";
    plane.style.transform = "rotate(20deg)";
    currentMultiplier = 1;
    multiplierDisplay.textContent = "1.00x";

    crashPoint = gerarCrashPoint();

    animation = setInterval(() => {
        currentMultiplier += 0.01;
        posX += 0.2;
        posY += 0.12;

        plane.style.left = posX + "%";
        plane.style.bottom = posY + "%";
        multiplierDisplay.textContent = currentMultiplier.toFixed(2) + "x";

        if (currentMultiplier >= crashPoint && !stoppedEarly) {
            clearInterval(animation);
            crash(valorAposta);
        }

        if (posX > 95 || posY > 85) {
            clearInterval(animation);
            crash(valorAposta);
        }
    }, 60);
}

function pararAposta() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) return;

    stoppedEarly = true;
    clearInterval(animation);

    const valorAposta = parseFloat(valorApostaInput.value);
    const premio = valorAposta * currentMultiplier;
    usuarioLogado.saldo += premio;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    atualizarSaldoHeader();

    resultado.textContent = `✅ Você retirou em ${currentMultiplier.toFixed(2)}x e ganhou R$${premio.toFixed(2)}`;
    plane.style.transform = "rotate(0deg)";
    stopBtn.disabled = true;
    startBtn.disabled = false;
}

function crash(valorAposta) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) return;

    resultado.textContent = `💥 Crash em ${crashPoint.toFixed(2)}x! Você perdeu R$${valorAposta.toFixed(2)}.`;
    plane.src = "https://cdn-icons-png.flaticon.com/512/2279/2279022.png";
    multiplierDisplay.textContent = "CRASH!";
    stopBtn.disabled = true;
    startBtn.disabled = false;

    setTimeout(() => {
        plane.src = "https://cdn-icons-png.flaticon.com/512/870/870194.png";
        plane.style.left = "0%";
        plane.style.bottom = "0%";
    }, 1500);
}

startBtn.addEventListener('click', iniciarVoo);
stopBtn.addEventListener('click', pararAposta);
window.addEventListener('load', atualizarSaldoHeader);
