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

    // Размер блоков зависит от размеров игрового поля
    this.blockWidth = this.width / columns
    this.blockHeight = this.height / rows

    // Присваиваем DOM элементу сгенерированный холст
    this.element.appendChild(this.canvas)
  }

  // Главный метод который будет рисовать игровое поле
  /**
   * @param {Array} playfield на основое этого массива из game.js строится игровое поле
   * 
   */
  render({playfield}) {
    this.clearScreen()
    this.renderPlayfield(playfield)
  }

  clearScreen() {
    // Очищаем поле при движении фигуры
    this.context.clearRect(0, 0, this.width, this.height)
  }


  renderPlayfield(playfield) {
    for (let y = 0; y < playfield.length; y++) {
      const line = playfield[y]

      for (let x = 0; x < line.length; x++) {
        const block = line[x]

        if(block) {
          this.renderBlock(x * this.blockWidth, y * this.blockHeight, this.blockWidth, this.blockHeight, View.colors[block])
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