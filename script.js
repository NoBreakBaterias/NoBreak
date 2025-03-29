document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchButton = document.getElementById('search-button');
    const searchBarContainer = document.querySelector('.search-bar-container'); // Seleciona o container
    let carModels = [];

    fetch('carros.json')
        .then(response => response.json())
        .then(data => {
            carModels = data;
            console.log("Modelos de carros carregados:", carModels.length);
        })
        .catch(error => console.error('Erro ao carregar o JSON de carros:', error));

    function redirectToWhatsApp(carModel) {
        if (!carModel || carModel.trim() === '') {
            alert("Por favor, digite ou selecione um modelo de carro.");
            return;
        }
        const numeroWhatsApp = "+55428402-3985"; // **IMPORTANTE: Substitua**
        const mensagem = `Olá! Gostaria de saber qual a bateria ideal para o meu ${carModel}.`;
        const encodedMensagem = encodeURIComponent(mensagem);
        const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodedMensagem}`;
        console.log("Redirecionando para:", whatsappURL);
        window.open(whatsappURL, '_blank');
    }

    // Função para mostrar/esconder resultados e ajustar classe
    function updateResultsVisibility(show) {
        if (show && searchResults.children.length > 0) {
            searchResults.style.display = 'block';
            searchResults.classList.add('visible'); // Adiciona classe para CSS
            searchBarContainer.classList.add('results-visible'); // Adiciona classe no container
        } else {
            searchResults.style.display = 'none';
            searchResults.classList.remove('visible'); // Remove classe
            searchBarContainer.classList.remove('results-visible'); // Remove classe no container
        }
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (searchTerm.length < 2) {
            updateResultsVisibility(false); // Esconde
            return;
        }

        const filteredModels = carModels.filter(model =>
            model.toLowerCase().includes(searchTerm)
        );

        filteredModels.slice(0, 7).forEach(model => {
            const li = document.createElement('li');
            li.textContent = model;
            li.addEventListener('click', function() {
                searchInput.value = model;
                searchResults.innerHTML = '';
                updateResultsVisibility(false); // Esconde após clicar
                 // Opcional: Redirecionar direto
                 // redirectToWhatsApp(model);
            });
            searchResults.appendChild(li);
        });

        updateResultsVisibility(true); // Mostra se houver resultados
    });

    document.addEventListener('click', function(event) {
        // Fecha se clicar fora do container da barra E da lista
        if (!searchBarContainer.contains(event.target)) {
             updateResultsVisibility(false);
        }
    });

    searchButton.addEventListener('click', function() {
        updateResultsVisibility(false); // Esconde a lista antes de redirecionar
        redirectToWhatsApp(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const firstSuggestion = searchResults.querySelector('li');
            if (searchResults.style.display === 'block' && firstSuggestion) {
                 searchInput.value = firstSuggestion.textContent;
                 searchResults.innerHTML = '';
                 updateResultsVisibility(false); // Esconde a lista
            } else {
                 updateResultsVisibility(false); // Garante que esconde se não houver sugestão
            }
            redirectToWhatsApp(searchInput.value);
        }
    });

    // O EVENTO DE SCROLL FOI REMOVIDO DAQUI

}); // Fim do DOMContentLoaded