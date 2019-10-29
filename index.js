import Game from './src/game.js' // Полный путь, включая .js так как иначе браузер не сможет подключить данный файл
import View from './src/view.js'
import Controller from './src/controller.js' 

const root = document.querySelector('#root')

const game = new Game()
const view = new View(root, 480, 640, 20, 10)
const controller = new Controller(game, view)

// Добавляем константы в глобальный объект window, чтобы можно было посмотреть на них в консоли браузера
window.game = game
window.view = view
window.controller = controller