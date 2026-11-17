
/* =================================
   DOCE DUPLA - SISTEMA DE CARRINHO
================================= */

// RECUPERAR CARRINHO SALVO

let carrinho = [];

try {
    const salvo = JSON.parse(localStorage.getItem("carrinho"));
    carrinho = Array.isArray(salvo) ? salvo : [];
} catch (erro) {
    carrinho = [];
}


// SALVAR CARRINHO

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


// ADICIONAR PRODUTO

function adicionarCarrinho(nome, preco) {
    preco = Number(preco);

    if (!nome || !Number.isFinite(preco)) {
        alert("Produto ou preço inválido!");
        return;
    }

    const produto = carrinho.find(item => item.nome === nome);

    if (produto) {
        produto.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();

    mostrarMensagem("🍫 " + nome + " adicionado!");

    document.getElementById("carrinho").scrollIntoView({
        behavior: "smooth"
    });
}


// AUMENTAR QUANTIDADE

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    atualizarCarrinho();
}


// DIMINUIR QUANTIDADE

function diminuirQuantidade(index) {
    carrinho[index].quantidade--;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
    atualizarCarrinho();
}


// REMOVER PRODUTO

function removerProduto(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}


// ATUALIZAR CARRINHO

function atualizarCarrinho() {
    const lista = document.getElementById("listaCarrinho");
    const totalElemento = document.getElementById("total");

    if (!lista || !totalElemento) return;

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        lista.innerHTML += `
            <li>
                <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>

                <div>
                    <button type="button" onclick="diminuirQuantidade(${index})">➖</button>
                    <span>${item.quantidade}</span>
                    <button type="button" onclick="aumentarQuantidade(${index})">➕</button>
                    <button type="button" onclick="removerProduto(${index})">🗑️</button>
                </div>

                <strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong>
            </li>
        `;
    });

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>🛒 Seu carrinho está vazio.</p>";
    }

    const tipoEntrega = document.getElementById("tipoEntrega")?.value;

    if (tipoEntrega === "Entrega" && carrinho.length > 0) {
        total += 2;
    }

    totalElemento.innerHTML = `
        <strong>💰 Total: R$ ${total.toFixed(2)}</strong>
    `;
}


// MENSAGEM DE CONFIRMAÇÃO

function mostrarMensagem(texto) {
    const mensagem = document.createElement("div");

    mensagem.textContent = texto;

    mensagem.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #287a45;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
    `;

    document.body.appendChild(mensagem);

    setTimeout(() => {
        mensagem.remove();
    }, 2500);
}


// FINALIZAR PEDIDO

function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("🛒 Seu carrinho está vazio!");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const entrega = document.getElementById("tipoEntrega").value;
    const pagamento = document.getElementById("pagamento").value;
    const observacao = document.getElementById("observacao").value.trim();

    if (!nome || !entrega || !pagamento) {
        alert("⚠️ Preencha todos os campos obrigatórios!");
        return;
    }

    if (entrega === "Entrega" && !endereco) {
        alert("📍 Informe o endereço para entrega!");
        return;
    }

    let total = 0;

    let mensagem = "🍫 *PEDIDO DOCE DUPLA*\n\n";

    mensagem += "👤 Nome: " + nome + "\n";

    if (entrega === "Entrega") {
        mensagem += "📍 Endereço: " + endereco + "\n";
    }

    mensagem += "\n🛒 *SEU PEDIDO:*\n";

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        mensagem +=
            item.quantidade + "x " +
            item.nome +
            " - R$ " + subtotal.toFixed(2) + "\n";
    });

    if (entrega === "Entrega") {
        total += 2;
        mensagem += "\n🚚 Taxa de entrega: R$ 2,00";
    } else {
        mensagem += "\n🏠 Retirada no local: Grátis";
    }

    mensagem += "\n\n💰 *TOTAL: R$ " + total.toFixed(2) + "*";
    mensagem += "\n📦 Recebimento: " + entrega;
    mensagem += "\n💳 Pagamento: " + pagamento;
    mensagem += "\n📝 Observação: " + (observacao || "Nenhuma");

    const numeroWhatsApp = "5588993561906";

    const link = "https://api.whatsapp.com/send?phone=" + numeroWhatsApp +
        "&text=" + encodeURIComponent(mensagem);

    const novaAba = window.open(link, "_blank");

    if (novaAba) {
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinho();

        document.getElementById("nome").value = "";
        document.getElementById("endereco").value = "";
        document.getElementById("tipoEntrega").value = "";
        document.getElementById("pagamento").value = "";
        document.getElementById("observacao").value = "";

        mostrarMensagem("🎉 Pedido preparado com sucesso!");
    } else {
        alert("Permita a abertura de janelas para continuar com o pedido.");
    }
}


// PROMOÇÕES DA DOCE DUPLA

const promocoes = [];

function atualizarPromocoes() {
    const lista = document.getElementById("listaPromocoes");
    const mensagem = document.getElementById("semPromocoes");

    if (!lista || !mensagem) return;

    lista.innerHTML = "";

    if (promocoes.length === 0) {
        mensagem.style.display = "block";
        return;
    }

    mensagem.style.display = "none";

    promocoes.forEach(item => {
        lista.innerHTML += `
            <div class="produto" data-status="${item.status || "disponivel"}">
                <img src="${item.imagem}" alt="${item.nome}">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <strong>R$ ${Number(item.preco).toFixed(2).replace(".", ",")}</strong>
                <button onclick="adicionarCarrinho('${item.nome}', ${Number(item.preco)})">
                    Adicionar ao carrinho 🛒
                </button>
            </div>
        `;
    });
}


// CONTROLE DE DISPONIBILIDADE

function atualizarDisponibilidade() {

    const produtos = document.querySelectorAll(
        ".produto, .produto-festa"
    );

    produtos.forEach(produto => {

        const botao = produto.querySelector("button, a");

        // Ignora elementos que não são produtos compráveis
        if (!botao) return;

        let status = produto.dataset.status || "disponivel";

        const statusValidos = [
            "disponivel",
            "esgotado",
            "encomenda"
        ];

        if (!statusValidos.includes(status)) {
            status = "disponivel";
        }

        const titulo = produto.querySelector("h2, h3, h4");
        const nome = titulo ? titulo.textContent.trim() : "Produto";

        // Remove etiqueta anterior
        const etiquetaAntiga = produto.querySelector(".etiqueta-status");

        if (etiquetaAntiga) {
            etiquetaAntiga.remove();
        }

        produto.classList.remove(
            "esgotado",
            "sob-encomenda"
        );

        // CRIAR ETIQUETA

        const etiqueta = document.createElement("span");

        etiqueta.className = "etiqueta-status status-" + status;

        // DISPONÍVEL

        if (status === "disponivel") {

            etiqueta.textContent = "Disponível";

            if (botao.tagName === "BUTTON") {
                botao.disabled = false;
            }

        }

        // ESGOTADO

        else if (status === "esgotado") {

            produto.classList.add("esgotado");

            etiqueta.textContent = "Esgotado";

            botao.textContent = "Produto esgotado";

            if (botao.tagName === "BUTTON") {
                botao.disabled = true;
                botao.removeAttribute("onclick");
            } else {
                botao.removeAttribute("href");
                botao.style.pointerEvents = "none";
                botao.setAttribute("aria-disabled", "true");
            }

        }

        // SOB ENCOMENDA

        else if (status === "encomenda") {

            produto.classList.add("sob-encomenda");

            etiqueta.textContent = "Sob encomenda";

            botao.textContent = "Solicitar encomenda";

            const mensagem =
                "Olá! Gostaria de encomendar: " + nome + ".";

            const link =
                "https://api.whatsapp.com/send?phone=5588993561906&text=" +
                encodeURIComponent(mensagem);

            if (botao.tagName === "A") {

                botao.href = link;
                botao.target = "_blank";
                botao.style.pointerEvents = "auto";
                botao.removeAttribute("aria-disabled");

            } else {

                botao.disabled = false;
                botao.removeAttribute("onclick");

                botao.onclick = function () {
                    window.open(link, "_blank");
                };

            }

        }

        // ADICIONAR ETIQUETA AO PRODUTO

        produto.appendChild(etiqueta);

    });

}


// INICIAR SISTEMA

document.addEventListener("DOMContentLoaded", function () {

    atualizarCarrinho();

    const tipoEntrega = document.getElementById("tipoEntrega");

    if (tipoEntrega) {
        tipoEntrega.addEventListener("change", atualizarCarrinho);
    }

    atualizarPromocoes();

    atualizarDisponibilidade();

});
