const apostaTipo = document.getElementById('apostaTipo');
const apostaEscolhaContainer = document.getElementById('apostaEscolhaContainer');
const roletaDiv = document.getElementById('roleta');
const resultadoDiv = document.getElementById('resultado');

apostaTipo.addEventListener('change', () => {
    const tipo = apostaTipo.value;
    let html = '';
    if (tipo === 'cor') {
        html = `
            <select id="apostaEscolha">
                <option value="vermelha">Vermelha</option>
                <option value="preta">Preta</option>
                <option value="branca">Branca (0)</option>
            </select>
        `;
    } else if (tipo === 'parImpar') {
        html = `
            <select id="apostaEscolha">
                <option value="par">Par</option>
                <option value="impar">Ímpar</option>
                <option value="zero">Zero</option>
            </select>
        `;
    } else if (tipo === 'numero') {
        html = `<input type="number" id="apostaEscolha" min="0" max="36" value="0">`;
    }
    apostaEscolhaContainer.innerHTML = html;
});

function apostar() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert('Por favor, faça login para apostar.');
        window.location.href = 'login.html';
        return;
    }

    const inputValorAposta = document.getElementById('valorAposta');
    const valorAposta = parseFloat(inputValorAposta.value);

    if (isNaN(valorAposta) || valorAposta <= 0) {return alert('Por favor, insira um valor de aposta válido.');}
    if (valorAposta > usuarioLogado.saldo) {return alert('Saldo insuficiente para essa aposta.');}

    usuarioLogado.saldo -= valorAposta;
    
    const tipo = apostaTipo.value;
    let escolha;
    if (tipo === 'numero') {
        escolha = parseInt(document.getElementById('apostaEscolha').value);
    } else {
        escolha = document.getElementById('apostaEscolha').value;
    }

    resultadoDiv.innerText = '';
    roletaDiv.innerText = 'Girando... 🎲';

    let contador = 0;
    const intervalo = setInterval(() => {
        const tempNum = Math.floor(Math.random() * 37);
        roletaDiv.innerText = tempNum;
        contador++;
        if (contador > 20) clearInterval(intervalo);
    }, 80);

    setTimeout(() => {
        const numeroRoleta = Math.floor(Math.random() * 37);
        let cor;
        if (numeroRoleta === 0) cor = 'branca';
        else if (numeroRoleta % 2 === 0) cor = 'preta';
        else cor = 'vermelha';

        roletaDiv.innerText = `${numeroRoleta} (${cor})`;

        let ganhou = false;
        let multiplicador = 0;
        if (tipo === 'cor') {
            if (escolha === cor) {ganhou = true; multiplicador= 2;}
        } else if (tipo === 'parImpar') {
            if (numeroRoleta === 0 && escolha === 'zero') {ganhou = true; multiplicador= 2;}
            else if (numeroRoleta % 2 === 0 && escolha === 'par') {ganhou = true; multiplicador= 2;}
            else if (numeroRoleta % 2 !== 0 && escolha === 'impar') {ganhou = true; multiplicador= 2;}
        } else if (tipo === 'numero') {
            if (escolha === numeroRoleta) {ganhou = true;
            multiplicador= 35;}
        }

        if (ganhou) {
            const premio = valorAposta * multiplicador;
            usuarioLogado.saldo += premio;
            resultadoDiv.innerText = `🎉 Você GANHOU! R$${premio.toFixed(2)}!`;
        } else {
            resultadoDiv.innerText = `❌ Você PERDEU! R$${valorAposta.toFixed(2)}.`;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        const saldoBox = document.getElementById("saldoBox");
        if (saldoBox) saldoBox.textContent = `Saldo: R$${usuarioLogado.saldo.toFixed(2)}`;
}, 1800);
}
