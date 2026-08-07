let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];




// ADICIONAR PRODUTO

function adicionarCarrinho(nome, preco){

    let produtoExistente = carrinho.find(
        item => item.nome === nome
    );


    if(produtoExistente){

        produtoExistente.quantidade++;

    }else{

        carrinho.push({

            nome:nome,

            preco:preco,

            quantidade:1

        });

    }


    atualizarCarrinho();
    salvarCarrinho();

}




// ATUALIZAR CARRINHO

function atualizarCarrinho(){

    let lista = document.getElementById("listaCarrinho");
    let totalHTML = document.getElementById("total");

    lista.innerHTML = "";

    let total = 0;


    carrinho.forEach((item,index)=>{

        let subtotal = item.preco * item.quantidade;

        total += subtotal;


        let li = document.createElement("li");


        li.innerHTML = `

        <div class="item-carrinho">

            <strong>${item.nome}</strong>

            <div class="controle">

                <button onclick="diminuirQuantidade(${index})">
                    −
                </button>


                <span>
                    ${item.quantidade}
                </span>


                <button onclick="aumentarQuantidade(${index})">
                    +
                </button>

            </div>


            <div class="preco-item">

                R$ ${subtotal.toFixed(2)}

            </div>


            <button class="remover" onclick="removerItem(${index})">

                🗑 Remover

            </button>


        </div>

        `;


        lista.appendChild(li);

    });


    let entrega = document.getElementById("tipoEntrega").value;

    let taxaEntrega = 0;


    if(entrega === "Entrega"){

        taxaEntrega = 2;

    }


    let totalFinal = total + taxaEntrega;


    totalHTML.innerHTML = `

    Subtotal: R$ ${total.toFixed(2)}

    <br>

    Entrega: R$ ${taxaEntrega.toFixed(2)}

    <br><br>

    <strong>
    Total: R$ ${totalFinal.toFixed(2)}
    </strong>

    `;


    salvarCarrinho();

}





// AUMENTAR QUANTIDADE

function aumentarQuantidade(index){

    carrinho[index].quantidade++;

    atualizarCarrinho();

}





// DIMINUIR QUANTIDADE

function diminuirQuantidade(index){


    if(carrinho[index].quantidade > 1){

        carrinho[index].quantidade--;

    }else{

        carrinho.splice(index,1);

    }


    atualizarCarrinho();

}




// REMOVER ITEM

function removerItem(index){

    carrinho.splice(index,1);

    atualizarCarrinho();

}





// FINALIZAR PEDIDO

function finalizarPedido(){



    if(carrinho.length === 0){

        alert("Seu carrinho está vazio!");

        return;

    }



    let nome = document.getElementById("nome").value;

    let telefone = document.getElementById("telefone").value;

    let endereco = document.getElementById("endereco").value;

    let entrega = document.getElementById("tipoEntrega").value;

    let pagamento = document.getElementById("pagamento").value;

    let observacao = document.getElementById("observacao").value;



    if(nome === "" || telefone === "" || endereco === ""){


        alert("Preencha seus dados antes de finalizar!");

        return;


    }





    let mensagem = 
    "🍫 *Pedido Doce Dupla*\n\n";


    mensagem += 
    "👤 Nome: " + nome + "\n";


    mensagem +=
    "📞 Telefone: " + telefone + "\n\n";



    mensagem +=
    "🛒 *Pedido:*\n";



    let total = 0;



    carrinho.forEach(item=>{


        let subtotal = item.preco * item.quantidade;


        total += subtotal;



        mensagem +=

        "• " + item.nome +

        " x" + item.quantidade +

        " - R$ " + subtotal.toFixed(2)

        + "\n";


    });




    let taxaEntrega = 0;

if(entrega === "Entrega"){
    taxaEntrega = 2;
}

let totalFinal = total + taxaEntrega;


mensagem += "\n🛒 Subtotal: R$ " + total.toFixed(2);

mensagem += "\n🚚 Entrega: R$ " + taxaEntrega.toFixed(2);

mensagem += "\n💰 Total: R$ " + totalFinal.toFixed(2);



    mensagem +=

    "\n🚚 Entrega: " + entrega;



    mensagem +=

    "\n💳 Pagamento: " + pagamento;



    mensagem +=

    "\n📝 Observação: " + observacao;




    let numero = "5588993561906";



    let link =

    "https://wa.me/" +

    numero +

    "?text=" +

    encodeURIComponent(mensagem);




    window.open(link,"_blank");

}
function salvarCarrinho(){

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}
window.onload = function(){

    atualizarCarrinho();

};
