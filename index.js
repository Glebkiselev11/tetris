import Game from './src/game.js' // Полный путь, включая .js так как иначе браузер не сможет подключить данный файл
import View from './src/view.js'

const root = document.querySelector('#root')

const game = new Game()
const view = new View(root, 480, 640, 20, 10)

// Добавляем константы в глобальный объект window
window.game = game
window.view = view

// Взаимодействие с помощью клавиатуры
document.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case 37: // Влево
      game.movePieceLeft()
      view.render(game.getState())
      break
    case 38: // Вверх
      game.rotatePiece()
      view.render(game.getState())
      break
    case 39: // Вправо 
      game.movePieceRight()
      view.render(game.getState())
      break
    case 40: // Вниз
      game.movePieceDown()
      view.render(game.getState())
      break

  }
})



