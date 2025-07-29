// --- CONFIGURATION and other functions remain the same...
const TMDB_API_KEY = "ea58d4f378b3b85b49e0142819e378d9";
const COUNTRIES = [{ code: 'ALL', name: 'All Countries', lang: null },{ code: 'US', name: 'United States', lang: 'en' },{ code: 'IN', name: 'India', lang: 'hi' },{ code: 'GB', name: 'United Kingdom', lang: 'en' },{ code: 'JP', name: 'Japan', lang: 'ja' },{ code: 'KR', name: 'South Korea', lang: 'ko' },{ code: 'CA', name: 'Canada', lang: 'en' },{ code: 'FR', name: 'France', lang: 'fr' }];
const GENRES = [{ id: 'all', name: 'All Genres' },{ id: 28, name: 'Action' },{ id: 12, name: 'Adventure' },{ id: 16, name: 'Animation' },{ id: 35, name: 'Comedy' },{ id: 80, name: 'Crime' },{ id: 18, name: 'Drama' },{ id: 10751, name: 'Family' },{ id: 14, name: 'Fantasy' },{ id: 36, name: 'History' },{ id: 27, name: 'Horror' },{ id: 9648, name: 'Mystery' },{ id: 10749, name: 'Romance' },{ id: 878, name: 'Science Fiction' },{ id: 53, name: 'Thriller' },{ id: 10752, name: 'War' }];
const GENRE_MAP = new Map(GENRES.filter(g => g.id !== 'all').map(g => [g.id, g.name]));
const grid = document.getElementById('releaseGrid'); const loadingMessage = document.getElementById('loadingMessage'); const typeFilter = document.getElementById('typeFilter'); const countryFilter = document.getElementById('countryFilter'); const genreFilter = document.getElementById('genreFilter'); const startDateInput = document.getElementById('startDate'); const endDateInput = document.getElementById('endDate'); const refreshBtn = document.getElementById('refreshBtn'); const watchModal = document.getElementById('watchModal'); const modalTitle = document.getElementById('modalTitle'); const providersList = document.getElementById('providersList'); const closeModalBtn = document.getElementById('closeModalBtn');
const formatDateForAPI = (date) => date.toISOString().split('T')[0]; function populateDropdown(selectElement, items) { items.forEach(item => { const option = document.createElement('option'); option.value = item.code || item.id; option.textContent = item.name; selectElement.appendChild(option); }); } function setDefaultDates() { const today = new Date(); const futureDate = new Date(); futureDate.setDate(today.getDate() + 30); startDateInput.value = formatDateForAPI(today); endDateInput.value = formatDateForAPI(futureDate); }

async function fetchAndRenderReleases() {
    grid.innerHTML = ''; loadingMessage.style.display = 'block'; loadingMessage.textContent = 'Fetching releases...';
    try {
        const releaseType = typeFilter.value; const countryCode = countryFilter.value; const genreId = genreFilter.value; const startDate = startDateInput.value; const endDate = endDateInput.value;
        const selectedCountry = COUNTRIES.find(c => c.code === countryCode); const regionFilter = countryCode !== 'ALL' ? `®ion=${countryCode}` : ''; const languageFilter = (selectedCountry && selectedCountry.lang) ? `&with_original_language=${selectedCountry.lang}` : ''; const genreFilterString = genreId !== 'all' ? `&with_genres=${genreId}` : '';
        const fetchPromises = [];
        if (releaseType === 'all' || releaseType === 'movie') { const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&include_adult=false&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}${regionFilter}${languageFilter}${genreFilterString}`; fetchPromises.push(fetch(moviesUrl).then(res => res.json())); }
        if (releaseType === 'all' || releaseType === 'tv') { const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&include_adult=false&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}${regionFilter.replace('region', 'with_origin_country')}${genreFilterString}`; fetchPromises.push(fetch(tvUrl).then(res => res.json())); }
        const results = await Promise.all(fetchPromises);
        const allReleases = results.flatMap(data => data.results?.map(item => { const isMovie = item.hasOwnProperty('title'); return { id: item.id, title: isMovie ? item.title : item.name, type: isMovie ? "Movie" : "Web Series", releaseDate: isMovie ? item.release_date : item.first_air_date, posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`, backdropUrl: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`, rating: item.vote_average, vote_count: item.vote_count, overview: item.overview, genreIds: item.genre_ids }; }) || []).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        if (allReleases.length === 0) { loadingMessage.textContent = 'No releases found for the selected criteria.'; } else { grid.innerHTML = allReleases.map(item => createReleaseCardHTML(item)).join(''); loadingMessage.style.display = 'none'; }
    } catch (error) { console.error("Error fetching releases:", error); loadingMessage.textContent = 'Failed to load releases. Please check the console.'; }
}

function createReleaseCardHTML(item) {
    const posterSrc = item.posterUrl.endsWith('null') ? 'https://placehold.co/500x750/e2e8f0/4a5568?text=No+Image' : item.posterUrl;
    const backdropSrc = !item.backdropUrl.endsWith('null') ? item.backdropUrl : posterSrc;
    const frontStyle = `style="background-image: url('${posterSrc}')"`;
    const backStyle = `style="background-image: url('${backdropSrc}')"`;
    let dateBadge = '';
    if (item.releaseDate) { const release = new Date(item.releaseDate); const month = release.toLocaleString('default', { month: 'short' }); const year = release.getFullYear().toString().slice(-2); dateBadge = `<div class="card-badge date-badge">${month} '${year}</div>`; }
    let ratingBadge = '';
    if (item.rating && item.rating > 0) { ratingBadge = `<div class="card-badge rating-badge-front flex items-center gap-1"><svg class="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span>${item.rating.toFixed(1)}</span></div>`; }
    const genreTags = item.genreIds?.map(id => GENRE_MAP.has(id) ? `<span class="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">${GENRE_MAP.get(id)}</span>` : '').join(' ') || '';
    const overview = item.overview ? (item.overview.length > 150 ? item.overview.substring(0, 150) + '…' : item.overview) : 'No overview available.';
    const backStatsHtml = item.rating && item.rating > 0 ? `<div class="flex items-center gap-4 text-sm"><div class="flex items-center gap-1"><svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="font-bold">${item.rating.toFixed(1)}</span><span class="text-gray-300">(${item.vote_count.toLocaleString()} votes)</span></div></div>` : '';
    const fullReleaseDate = item.releaseDate ? new Date(item.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Release Date TBD';
    
    // UPDATED: Pass the release date to the fetchAndShowProviders function
    const whereToWatchCall = `fetchAndShowProviders(${item.id}, '${item.type}', '${item.title}', '${item.releaseDate}')`;

    return `
        <div class="release-card">
            <div class="release-card-inner">
                <div class="release-card-front" ${frontStyle}>${dateBadge}${ratingBadge}</div>
                <div class="release-card-back" ${backStyle}>
                    <div class="card-overlay"></div>
                    <div class="card-content space-y-3">
                        <h3 class="text-xl font-bold">${item.title}</h3>
                        <div class="flex flex-wrap gap-2">${genreTags}</div>
                        <div class="text-sm text-gray-200">Released: ${fullReleaseDate}</div>
                        ${backStatsHtml}
                        <p class="text-sm pt-1">${overview}</p>
                        <div class="flex gap-2 pt-2">
                            <button class="w-full bg-white/90 hover:bg-white text-black text-sm font-semibold py-2 rounded-md transition-colors" onclick="${whereToWatchCall}">Where to Watch</button>
                            <button class="w-full bg-red-600/90 hover:bg-red-500 text-white text-sm font-semibold py-2 rounded-md transition-colors text-center" onclick="getTrailerAndOpen(this, ${item.id}, '${item.type}')">Watch Trailer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getTrailerAndOpen(buttonElement, itemId, itemType) { const originalText = buttonElement.innerHTML; buttonElement.innerHTML = 'Searching...'; buttonElement.disabled = true; const type = itemType === 'Movie' ? 'movie' : 'tv'; const url = `https://api.themoviedb.org/3/${type}/${itemId}/videos?api_key=${TMDB_API_KEY}&language=en-US`; try { const response = await fetch(url); const data = await response.json(); const officialTrailer = data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer' && vid.official); const anyTrailer = data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer'); const trailer = officialTrailer || anyTrailer; if (trailer) { window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank', 'noopener,noreferrer'); buttonElement.innerHTML = originalText; buttonElement.disabled = false; } else { buttonElement.innerHTML = 'Not Found'; setTimeout(() => { buttonElement.innerHTML = originalText; buttonElement.disabled = false; }, 2000); } } catch (error) { console.error('Error fetching trailer:', error); buttonElement.innerHTML = 'Error'; setTimeout(() => { buttonElement.innerHTML = originalText; buttonElement.disabled = false; }, 2000); } }

/**
 * UPDATED: This function now accepts the release date to show a more intelligent message.
 */
async function fetchAndShowProviders(itemId, itemType, itemTitle, releaseDate) {
    modalTitle.textContent = itemTitle;
    providersList.innerHTML = '<p class="text-gray-500">Loading...</p>';
    watchModal.classList.remove('hidden');

    const countryCode = countryFilter.value === 'ALL' ? 'US' : countryFilter.value;
    const type = itemType === 'Movie' ? 'movie' : 'tv';
    const url = `https://api.themoviedb.org/3/${type}/${itemId}/watch/providers?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Could not fetch providers.');
        const data = await response.json();
        const results = data.results[countryCode];
        let providersHtml = '';

        if (results && results.link) {
            providersHtml += createProviderSectionHTML('Stream', results.flatrate, results.link);
            providersHtml += createProviderSectionHTML('Rent', results.rent, results.link);
            providersHtml += createProviderSectionHTML('Buy', results.buy, results.link);
        }

        // --- NEW LOGIC FOR SMARTER MESSAGING ---
        if (providersHtml === '') {
            const release = new Date(releaseDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date to compare just the day

            let message = '';
            if (releaseDate && release > today) {
                // If the release date is in the future
                message = `This title is scheduled for a future release. Provider information is typically available after its theatrical run.`;
            } else {
                // If the movie is already released or has no date
                const selectedCountryName = countryFilter.options[countryFilter.selectedIndex].text;
                message = `Provider information not yet available in <span class="font-semibold">${selectedCountryName}</span>.`;
            }
            providersList.innerHTML = `<p class="text-gray-600">${message}</p>`;
        } else {
            providersList.innerHTML = providersHtml;
        }
    } catch (error) {
        console.error('Error fetching providers:', error);
        providersList.innerHTML = '<p class="text-red-500">Could not find provider information.</p>';
    }
}

function createProviderSectionHTML(title, providers, link) { if (!providers || providers.length === 0) return ''; const providerItems = providers.map(provider => ` <a href="${link}" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1 text-center w-20 transform transition-transform hover:scale-105"> <img src="https://image.tmdb.org/t/p/w200${provider.logo_path}" alt="${provider.provider_name}" class="provider-logo shadow-md" title="${provider.provider_name}"> <span class="text-xs text-gray-700 font-medium">${provider.provider_name}</span> </a> `).join(''); return `<p class="font-semibold text-lg mb-2">${title}:</p><div class="flex flex-wrap gap-4">${providerItems}</div>`; }
window.fetchAndShowProviders = fetchAndShowProviders;
window.getTrailerAndOpen = getTrailerAndOpen;
refreshBtn.addEventListener('click', fetchAndRenderReleases); closeModalBtn.addEventListener('click', () => watchModal.classList.add('hidden')); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !watchModal.classList.contains('hidden')) watchModal.classList.add('hidden'); }); watchModal.addEventListener('click', (event) => { if (event.target === watchModal) watchModal.classList.add('hidden'); });
document.addEventListener('DOMContentLoaded', () => { populateDropdown(typeFilter, [{id: 'all', name: 'All Releases'}, {id: 'movie', name: 'Movies Only'}, {id: 'tv', name: 'TV & Series Only'}]); populateDropdown(countryFilter, COUNTRIES); populateDropdown(genreFilter, GENRES); setDefaultDates(); fetchAndRenderReleases(); });