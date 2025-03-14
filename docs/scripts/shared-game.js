// Consolidated common game page functions.
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

async function loadInstructions() {
  try {
    const response = await fetch('../../games.json');
    const data = await response.json();
    const gameName = document.location.pathname.split('/').slice(-2)[0];
    const game = data.games.find(g => g.name === gameName);
    
    if (game && game.instructions) {
      const instructionsHtml = game.instructions
        .map(instruction => `<p>${instruction}</p>`)
        .join('');
      document.getElementById('gameInstructions').innerHTML = instructionsHtml;
    }
  } catch (error) {
    console.error('Error loading instructions:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadInstructions);
