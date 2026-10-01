document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');

    btnSearch.addEventListener('click', searchRecommendations);
    btnClear.addEventListener('click', clearResults);

    function searchRecommendations() {
        const query = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = '';

        if (!query) return;

        fetch('travel_recommendation_api.json')
            .then(res => res.json())
            .then(data => {
                let matches = [];

                if (query.includes('beach')) {
                    matches = data.beaches;
                } else if (query.includes('temple')) {
                    matches = data.temples;
                } else if (query.includes('country') || query.includes('countries')) {
                    // Collect all cities/recommendations across all countries
                    data.countries.forEach(country => {
                        matches = matches.concat(country.cities);
                    });
                } else {
                    // Check specific country or city name
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(query)) {
                            matches = matches.concat(country.cities);
                        } else {
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(query)) {
                                    matches.push(city);
                                }
                            });
                        }
                    });
                }

                if (matches.length > 0) {
                    displayResults(matches);
                } else {
                    resultsContainer.innerHTML = '<p style="grid-column: 1/-1;">No results found. Try searching for "beaches", "temples", or "country".</p>';
                }
            })
            .catch(err => console.error('Error fetching data:', err));
    }

    function displayResults(items) {
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function clearResults() {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }
});