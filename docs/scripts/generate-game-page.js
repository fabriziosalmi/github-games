const fs = require('fs');
const path = require('path');

function generateGamePage(gameConfig) {
    const template = fs.readFileSync(
        path.join(__dirname, '../templates/game-template.html'), 
        'utf8'
    );

    let html = template
        .replace(/{{GAME_TITLE}}/g, gameConfig.title)
        .replace('{{GAME_SCRIPT}}', gameConfig.script)
        .replace('{{ADDITIONAL_HEAD}}', gameConfig.additionalHead || '')
        .replace('{{ADDITIONAL_GAME_CONTENT}}', gameConfig.additionalContent || '')
        .replace('{{ADDITIONAL_SCRIPTS}}', gameConfig.additionalScripts || '');

    const outputPath = path.join(__dirname, `../games/${gameConfig.folder}/index.html`);
    fs.writeFileSync(outputPath, html);
}

// Example usage:
const games = [
    {
        title: 'Snake Game',
        folder: 'snake',
        script: 'snake.js'
    },
    {
        title: 'Chess Game',
        folder: 'chess',
        script: 'chess.js',
        additionalContent: '<div id="gameStatus" class="game-status">White\'s turn</div>'
    },
    {
        title: 'Bouncing Ball Game',
        folder: 'bouncingball',
        script: 'bouncingball.js'
    },
    {
        title: 'Space Invaders',
        folder: 'spaceinvaders',
        script: 'spaceinvaders.js',
        additionalHead: '<style>canvas { background: var(--game-bg); }</style>'
    }
];

games.forEach(generateGamePage);