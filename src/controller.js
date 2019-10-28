// Этот класс настраивает взаимодействие между игрой и представлением
export default class Controller {
  constructor(game, view) {
    this.game = game
    this.view = view
    this.intervalId = null
    this.isPlaying = false // Отвечает за постановку игры на паузу

    

    // .bind(this) нужно чтобы привизать к объекту контроллера
    document.addEventListener('keydown', this.handleKeyDown.bind(this))

    // Показываем начальный экран
    this.view.renderStartScreen()
  }


  update() {
    this.game.movePieceDown() // Двигаем
    this.updateView() // Отрисовываем
  }

  // Запускает игру
  play() {
    this.isPlaying = true
    this.startTimer()
    this.updateView()
  }

  // Ставит на паузу
  pause() {
    this.isPlaying = false
    this.stopTimer()
    this.updateView()
  }

  updateView() {
    if (!this.isPlaying) {
      this.view.renderPauseScreen()
    } else {
      this.view.renderMainScreen(this.game.getState())
    }
    
  }


  // Запускаем таймер движения
  startTimer() {
    // Каждую секунду двигаем фигуру вниз
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.update()
      }, 1000)
    }
    
  }

  // Останавливаем таймер движения
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
  }

  // Взаимодействие с помощью клавиатуры
  handleKeyDown(event) {
    switch (event.keyCode) {
      case 13: // Enter
        if (this.isPlaying) {
          this.pause()
        } else {
          this.play()
        }
        break
      case 37: // Влево
        this.game.movePieceLeft()
        this.updateView()
        break
      case 38: // Вверх
        this.game.rotatePiece()
        this.updateView()
        break
      case 39: // Вправо 
        this.game.movePieceRight()
        this.updateView()
        break
      case 40: // Вниз
        this.game.movePieceDown()
        this.updateView()
        break
    }
  }
}