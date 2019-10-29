export default class Game {

  static points = {
    '1': 40,
    '2': 100,
    '3': 300,
    '4': 1200
  }

  // Устанавливаем изначальные значения
  constructor() {
    this.reset()
  }

  get level() {
    // Вычисляем уровень, как только собрали 10 линий, то переходим на след уровень
    return Math.floor(this.lines * 0.1)
  }

  // Метод для получения состояния, поле, счет
  getState() {
    const playfield = this.createPlayField()
    const { y: pieceY, x: pieceX, blocks } = this.activePiece

    for (let y = 0; y < this.playfield.length; y++) {
      playfield[y] = []

      for (let x = 0; x < this.playfield[y].length; x++) {
        playfield[y][x] = this.playfield[y][x]
        
      }
      
    }

    // Копируем значение из активной фигуры в массив playfiled
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playfield[pieceY + y][pieceX + x] = blocks[y][x]
        }

      }
      
    }

    return {
      playfield,
      nextPiece: this.nextPiece,
      score: this.score,
      level: this.level,
      lines: this.lines,
      isGameOver: this.topOut

    }
  }

  // Устанавливаем изначальные значения
  reset() {
    this.score = 0
    this.lines = 0
    this.topOut = false
    this.playfield = this.createPlayField()
    this.activePiece = this.createPiece()
    this.nextPiece = this.createPiece()
  }

  // Генерирует поле
  createPlayField() {
    const playfield = []

    for (let y = 0; y < 20; y++) {
      playfield[y] = []

      for (let x = 0; x < 10; x++) {
        playfield[y][x] = 0
        
      }
      
    }

    return playfield
  }

  // Создает новую фигуру
  createPiece() {
    // Получаем индекс, чтобы рандомно сгенерировать одну из 7 фигур
    const index = Math.floor(Math.random() * 7)
    const type = 'IJLOSTZ'[index]
    const piece = {}

    // фигуры состоят из чисел, для того, чтобы на основе этих чисел в классе view добавить цвет фигурам
    switch(type) {
      case 'I':
        piece.blocks = [
          [0,0,0,0],
          [1,1,1,1],
          [0,0,0,0],
          [0,0,0,0],
        ]
        break
      case 'J':
        piece.blocks = [
          [0,0,0],
          [2,2,2],
          [0,0,2]
        ]
        break
      case 'L':
        piece.blocks = [
          [0,0,0],
          [3,3,3],
          [3,0,0]
        ]
        break
      case 'O':
        piece.blocks = [
          [0,0,0,0],
          [0,4,4,0],
          [0,4,4,0],
          [0,0,0,0],
        ]
        break
      case 'S':
        piece.blocks = [
          [0,0,0],
          [0,5,5],
          [5,5,0]
        ]
        break
      case 'T':
        piece.blocks = [
          [0,0,0],
          [6,6,6],
          [0,6,0]
        ]
        break
      case 'Z':
        piece.blocks = [
          [0,0,0],
          [7,7,0],
          [0,7,7]
        ]
        break
      default:
        throw new Error('Неизвестый тип фигуры')
    }

    // Задаем генерацию фигуры по центру
    piece.x = Math.floor((10 - piece.blocks[0].length) / 2)
    piece.y = -1

    return piece
  }


  // Двигает фигуру влево
  movePieceLeft() {
    this.activePiece.x -= 1

    if (this.hasCollision()) {
      this.activePiece.x += 1
    }
  }

  // Двигает фигуру вправо
  movePieceRight() {
    this.activePiece.x += 1

    if (this.hasCollision()) {
      this.activePiece.x -= 1
    }
  }

  // Двигает фигуру вниз
  movePieceDown() {

    if (this.topOut) {
      return // Дополнительная проверка на то что достигли ли мы потолка
    }

    this.activePiece.y += 1

    if (this.hasCollision()) {
      this.activePiece.y -= 1
      this.lockPiece()
      
      // Проверяем на заполненность нижнего ряда, чтобы удалить его
      const clearedLines = this.clearLines()
      
      // Обновляем очки, когда удаляем линию
      this.updateScore(clearedLines)
      this.updatePieces()
    }

    // Проверяем достигли ли потолка
    if (this.hasCollision()) {
      this.topOut = true
    }

  }

  rotatePiece() {
    // Крутим фигуру по часовой стрелке
    this.rotateBlocks()


    // Если есть столкновение, то крутим обратно
    if (this.hasCollision()) {
      this.rotateBlocks(false)
    }

  }

  // Логика для поворота фигуры
  rotateBlocks(clockwise = true) {
    const blocks = this.activePiece.blocks
    const length = blocks.length
    
    // Находим половину длины массива
    const x = Math.floor(length / 2)

    const y = length - 1

    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++){
        const temp = blocks[i][j]
        
        if (clockwise) {
          // Тут если clockwise true то вертит по часовой
          blocks[i][j] = blocks[y -j][i]
          blocks[y - j][i] = blocks[y - i][y - j]
          blocks[y - i][y - j] = blocks[j][y - i]
          blocks[j][y - i] = temp
        } else {
          // Иначе против часовой
          blocks[i][j] = blocks[j][y - i]
          blocks[j][y - i] = blocks[y - i][y - j]
          blocks[y - i][y - j] = blocks[y - j][i]
          blocks[y - j][i] = temp
        }

        
      }
    }
  }


  // Проверяет вышла ли фигура за границы поля и стулкнулась ли она с другой фигурой
  hasCollision() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {

        if (
          blocks[y][x] && // Проверяем наличие блока в фигуре
          ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) || // Проверяем находится ли блок в пределах игрового поля
          this.playfield[pieceY + y][pieceX + x]) // Проверяем свободно ли место в игровом поле
        ) {
          return true
        } 
      }
    }

    return false
  }

  
  lockPiece() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece

    // Перебираем блоки активного поля
    for (let y = 0; y < blocks.length; y++) {

      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x]
        }
      }
    }
  }

  // Метод для удаления линии, когда она заполнена
  clearLines() {
    const rows = 20
    const columns = 10
    let lines = []

    for (let y = rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0

      for (let x = 0; x < columns; x++) {
        if(this.playfield[y][x] !== 0) {
          numberOfBlocks += 1
        }
      }

      if (numberOfBlocks === 0) {
        // Если на нижней линии ноль блоков, ты смысла продолжать дальше нет
        break
      } else if (numberOfBlocks < columns) {
        continue
      } else if (numberOfBlocks === columns) {
        lines.unshift(y)
      }

    }

    for (let index of lines) {
      // Обрезаем строку
      this.playfield.splice(index, 1)

      // Добавляем сверху новую пустую строку
      this.playfield.unshift(new Array(columns).fill(0))
    }

    return lines.length
  }

  // Повышаем счет при удалении заполненной линии
  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1)
      this.lines += clearedLines
    }
  }

  updatePieces() {
    this.activePiece = this.nextPiece
    this.nextPiece = this.createPiece()
  }
  
}