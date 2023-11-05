let cachedSongs = null; // This will store the songs after the first fetch
let currentPage = 0; // Keeps track of the current page index
const songsPerPage = 6; // Number of songs per page
let totalPageCount = 0; // Total number of pages

// Fetch songs from the JSON file
async function fetchSongs() {
  if (cachedSongs) { // If songs are cached, return them
    return cachedSongs;
  }

  try {
    const response = await fetch('songs.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const songs = await response.json();
      cachedSongs = songs; // Cache the songs for future calls
      totalPageCount = Math.ceil(songs.length / songsPerPage); // Set total page count
      updatePagination(); // Update the pagination controls
      return songs; // Return the songs
    }
  } catch (e) {
    console.log(e);
  }
}

function searchSong() {
  const input = document.getElementById('searchBar').value.toLowerCase();
  fetchSongs().then(songs => {
    if (songs) { // Ensure songs is not undefined
      const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(input));
      currentPage = 0; // Reset to the first page
      totalPageCount = Math.ceil(filteredSongs.length / songsPerPage); // Set total page count based on filtered results
      displaySongsPaginated(filteredSongs);
    }
  }).catch(e => console.log(e)); // Catch any errors here
}

function displaySongsPaginated(songsArray) {
  const startIndex = currentPage * songsPerPage;
  const selectedSongs = songsArray.slice(startIndex, startIndex + songsPerPage);
  displaySongs(selectedSongs);
  updatePagination();
}

function displaySongs(songsArray) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  songsArray.forEach(song => {
    const card = document.createElement('div');
    card.className = 'card';
    const favoriteStar = song.favorite ? '⭐' : '';
    card.innerHTML = `
        <h3 class="card-title">${favoriteStar} ${song.title}</h3>
        <p class="card-content">Genre: ${song.genre}</p>
        <p class="card-content">Voices: ${song.voices}</p>
        <p class="card-content">Composer: ${song.composer}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

function updatePagination() {
  const pageIndicator = document.getElementById('pageIndicator');
  pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPageCount}`;

  // Enable/disable navigation buttons
  document.getElementById('lastPageButton').disabled = currentPage <= 0;
  document.getElementById('nextPageButton').disabled = currentPage >= totalPageCount - 1;
}

function nextPage() {
  if (currentPage < totalPageCount - 1) {
    currentPage++;
    fetchSongs().then(songs => displaySongsPaginated(songs)).catch(e => console.log(e));
  }
}

function lastPage() {
  if (currentPage > 0) {
    currentPage--;
    fetchSongs().then(songs => displaySongsPaginated(songs)).catch(e => console.log(e));
  }
}

// Add event listeners to pagination buttons
document.getElementById('nextPageButton').addEventListener('click', nextPage);
document.getElementById('lastPageButton').addEventListener('click', lastPage);

// Trigger search when typing
document.getElementById('searchBar').addEventListener('keyup', searchSong);

// Initial fetch and display of songs
fetchSongs().then(songs => {
  if (songs) { // Ensure songs is not undefined
    displaySongsPaginated(songs);
  }
}).catch(e => console.log(e)); // Catch any errors here
