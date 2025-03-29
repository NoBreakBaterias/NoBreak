document.addEventListener('DOMContentLoaded', function() {
    const bateriaInfoDiv = document.getElementById('bateria-info');
    const urlParams = new URLSearchParams(window.location.search);
    const carro = urlParams.get('carro');
    let bateriasData = {};

    fetch('baterias.json')
        .then(response => response.json())
        .then(data => {
            bateriasData = data;
            exibirBateria(carro, bateriasData);
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    function exibirBateria(carro, data) {
        let bateriaEncontrada = null;

        for (const marca in data) {
            data[marca].forEach(bateria => {
                if (bateria.compatibilidade.includes(carro)) {
                    bateriaEncontrada = bateria;
                    return; // Encerra o loop interno quando encontrar
                }
            });
            if (bateriaEncontrada) break; // Encerra o loop externo quando encontrar
        }

        if (bateriaEncontrada) {
            let precoHTML = '';
            if (bateriaEncontrada.preco_promocao !== null && bateriaEncontrada.preco_promocao !== undefined) {
                precoHTML = `<p class="preco">
                                 <span class="preco-antigo">R$ ${bateriaEncontrada.preco.toFixed(2)}</span>
                                 <strong class="preco-promocao">R$ ${bateriaEncontrada.preco_promocao.toFixed(2)}</strong> (Promoção!)
                             </p>`;
            } else {
                precoHTML = `<p class="preco"><strong>Preço: R$ ${bateriaEncontrada.preco.toFixed(2)}</strong></p>`;
            }

            const div = document.createElement('div');
            div.classList.add('bateria-detalhes'); // Adiciona a classe para estilização
            div.innerHTML = `
                <h2>Bateria Recomendada para ${carro}</h2>
                <img src="${bateriaEncontrada.imagem}" alt="Imagem da Bateria" class="bateria-imagem">
                <p><strong>Marca:</strong> <span class="info-destacada">${Object.keys(data).find(key => data[key].includes(bateriaEncontrada))}</span></p>
                <p><strong>Modelo:</strong> <span class="info-destacada">${bateriaEncontrada.modelo}</span></p>
                <p><strong>Capacidade:</strong> <span class="info-destacada">${bateriaEncontrada.capacidade}</span></p>
                <p><strong>Tipo:</strong> <span class="info-destacada">${bateriaEncontrada.tipo}</span></p>
                ${precoHTML}
                <a href="https://wa.me/SEU_NUMERO_WHATSAPP?text=Olá, gostaria de comprar a bateria ${bateriaEncontrada.modelo} para o carro ${carro}" class="botao-contato" target="_blank">
                    <i class="fab fa-whatsapp"></i> Entrar em Contato
                </a>
            `;
            bateriaInfoDiv.appendChild(div);
        } else {
            bateriaInfoDiv.innerHTML = `<p>Nenhuma bateria encontrada para o carro ${carro}.</p>`;
        }
    }
});