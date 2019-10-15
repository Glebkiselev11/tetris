import Game from './src/game.js' // Полный путь, включая .js так как иначе браузер не сможет подключить данный файл

const game = new Game()

// Добавляем константу game в глобальный объект window
window.game = game;

console.log(game)
