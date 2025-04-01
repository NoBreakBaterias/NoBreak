document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchButton = document.getElementById('search-button');
    const searchBarContainer = document.querySelector('.search-bar-container');
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
        const numeroWhatsApp = "554284023985";
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
            searchResults.classList.add('visible');
            searchBarContainer.classList.add('results-visible');
        } else {
            searchResults.style.display = 'none';
            searchResults.classList.remove('visible');
            searchBarContainer.classList.remove('results-visible');
        }
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (searchTerm.length < 2) {
            updateResultsVisibility(false);
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
                updateResultsVisibility(false);
            });
            searchResults.appendChild(li);
        });

        updateResultsVisibility(true);
    });

    document.addEventListener('click', function(event) {
        if (!searchBarContainer.contains(event.target)) {
            updateResultsVisibility(false);
        }
    });

    // Atualizado para o novo botão "Encontre sua bateria"
    searchButton.addEventListener('click', function() {
        updateResultsVisibility(false);
        redirectToWhatsApp(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const firstSuggestion = searchResults.querySelector('li');
            if (searchResults.style.display === 'block' && firstSuggestion) {
                searchInput.value = firstSuggestion.textContent;
                searchResults.innerHTML = '';
                updateResultsVisibility(false);
            } else {
                updateResultsVisibility(false);
            }
            redirectToWhatsApp(searchInput.value);
        }
    });
});