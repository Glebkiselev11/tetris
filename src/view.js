export default class View {
  static colors = {
    '1' : 'cyan',
    '2' : 'blue',
    '3' : 'orange',
    '4' : 'yellow',
    '5' : 'green',
    '6' : 'purple',
    '7' : 'red'
  }
   
  /**
   * 
   * @param element DOM элемент, куда будет помещено представление
   * @param width Ширина
   * @param height Высота
   * @param rows Кол-во рядов
   * @param columns Кол-во колонок
   */
  constructor(element, width, height, rows, columns) {
    this.element = element
    this.width = width
    this.height = height

    // Объявляем холст на котором будем рисовать и задаем ему параметры
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context = this.canvas.getContext('2d')


    // Ширина границы
    this.playfieldBorderWidth = 4

    // Координаты где поле начинается
    this.playfieldX = this.playfieldBorderWidth
    this.playfieldY = this.playfieldBorderWidth

    // Ширина игрового поля (2 третих от общей ширины)
    this.playfieldWidth = this.width * 2 / 3
    this.playfieldHeight = this.height

    // Внутренная ширина игрового поля
    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2
    this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2

    // Размер блоков зависит от размеров игрового поля
    this.blockWidth = this.playfieldInnerWidth / columns
    this.blockHeight = this.playfieldInnerHeight / rows


    // Определяем свойства для панели
    this.panelX = this.playfieldWidth + 10
    this.panelY = 0
    this.panelWidth = this.width / 3
    this.panelHeigth = this.height

    // Присваиваем DOM элементу сгенерированный холст
    this.element.appendChild(this.canvas)
  }

  // Главный метод который будет рисовать игровое поле
  renderMainScreen(state) {
    this.clearScreen()
    this.renderPlayfield(state)
    this.renderPanel(state)
  }

  

  // Начальный экран
  renderStartScreen() {
    this.context.fillStyle = 'white'
    this.context.font = '18px "Press Start 2P"'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    this.context.fillText('Press ENTER to start', this.width / 2, this.height / 2)
  }

  // Пауза игры
  renderPauseScreen() {
    // Сначала немного затемняем игновое поле
    this.context.fillStyle = 'rgba(0,0,0,0.75)'
    this.context.fillRect(0, 0, this.width, this.height)

    // А после уже генерируем текст о паузе
    this.context.fillStyle = 'white'
    this.context.font = '18px "Press Start 2P"'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2)
  }


  // Экран проигрыша
  renderEndScreen({ score }) {
    // Очищаем поле от фигур
    this.clearScreen()

    // А после уже генерируем текст о проигрыше
    this.context.fillStyle = 'white'
    this.context.font = '18px "Press Start 2P"'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48)
    this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2)
  }

  clearScreen() {
    // Очищаем поле при движении фигуры
    this.context.clearRect(0, 0, this.width, this.height)
  }


  renderPlayfield({ playfield }) {
    for (let y = 0; y < playfield.length; y++) {
      const line = playfield[y]

      for (let x = 0; x < line.length; x++) {
        const block = line[x]

        if(block) {
          this.renderBlock(
            this.playfieldX + (x * this.blockWidth), 
            this.playfieldY + (y * this.blockHeight), 
            this.blockWidth, 
            this.blockHeight, 
            View.colors[block]
          )
        }
        
      }
    }
    this.context.strokeStyle = 'white'
    this.context.lineWidth = this.playfieldBorderWidth
    this.context.strokeRect(0, 0, this.playfieldWidth, this.panelHeigth)

  }

  // Генерирует боковую панель с информацией
  renderPanel({ level, score, lines, nextPiece}) {
    this.context.textAlign = 'start' // Чтобы текст был отформатирован по левому краю
    this.context.textBaseline = 'top' // Чтобы текст был отформатирован по верхней линии
    this.context.fillStyle = 'white' // Цвет текста
    this.context.font = '14px "Press Start 2P"' // Размер шрифта и его название (этот шрифт мы подключаем в index.html)
    
    // Рисует текст по указанным координатам
    this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0)
    this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24)
    this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48)
    
    
    // Показываем следующую фигуру
    this.context.fillText('Next:', this.panelX, this.panelY + 96)
    for (let y = 0; y < nextPiece.blocks.length; y++) {
      for (let x = 0; x < nextPiece.blocks[y].length; x++) {
        const block = nextPiece.blocks[y][x]

        if (block) {
          this.renderBlock(
            this.panelX + (x * this.blockWidth * 0.5),
            this.panelY + 100 + (y * this.blockHeight * 0.5),
            this.blockWidth * 0.5,
            this.blockHeight * 0.5,
            View.colors[block]
          )
        }
      }
      
    }
  }

  /**
   * Генерирует новую фигуру вверху поля
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   * @param {*} color 
   */
  renderBlock(x, y, width, height, color) {
    // Закрашиваем фигуру
    this.context.fillStyle = color
    // Цвет обводки
    this.context.strokeStyle = 'black'
    // Ширина обводки в пикселях
    this.context.lineWidth = 2

    // Рисуем прямоугольник по координатам
    this.context.fillRect(x, y, width, height)
    this.context.strokeRect(x, y, width, height)
  }
}