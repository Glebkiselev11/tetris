// Этот класс настраивает взаимодействие между игрой и представлением
export default class Controller {
  constructor(game, view) {
    this.game = game
    this.view = view
    this.intervalId = null
    this.isPlaying = false // Отвечает за постановку игры на паузу

    

    // .bind(this) нужно чтобы привизать к объекту контроллера
    document.addEventListener('keydown', this.handleKeyDown.bind(this))

    document.addEventListener('keyup', this.handleKeyUp.bind(this))

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

  // Перезапуск игры (при пройгрыше)
  reset() {
    this.game.reset()
    this.play()

  }


  updateView() {
    const state = this.game.getState()

    // Если проиграли, то показываем экран Гейм овера
    if (state.isGameOver) {
      this.view.renderEndScreen(state)
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen()
    } else {
      this.view.renderMainScreen(state)
    }
    
  }


  // Запускаем таймер движения
  startTimer() {
    // Определяем скорость, с каждым лвл мы уменьшаем интервал (фигуры начинают быстрее опускаться вниз)
    const speed = 1000 - this.game.getState().level * 100

    // Каждую секунду двигаем фигуру вниз
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.update()
      }, speed > 0 ? speed : 100) // Скорость не может быть нулевой
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
    const state = this.game.getState()
    switch (event.keyCode) {
      case 13: // Enter
        if (state.isGameOver) {
          this.reset()
        } else if (this.isPlaying) {
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
        this.stopTimer()
        this.game.movePieceDown()
        this.updateView()
        break
    }
  }

  handleKeyUp(event) {
    switch (event.keyCode) {
      case 40: // Вниз
        this.startTimer()
        break
    }
  }
}