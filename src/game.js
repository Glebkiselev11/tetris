export default class Game {
  score = 0
  lines = 0
  level = 0

  // Игровое поле
  playfield = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]

  // Активное поле
  activePiece = {
    x: 0,
    y: 0,
    get blocks() {
      return this.rotations[this.rotationIndex]
    },
    blocks: [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ]
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
    this.activePiece.y += 1

    if (this.hasCollision()) {
      this.activePiece.y -= 1
      this.lockPiece()
    }
  }

  // Нужен, чтобы поворачивать фигуру
  rotatePiece() {
    const blocks = this.activePiece.blocks
    const length = blocks.length
    
    // Создаем пустой массив с нулями
    const temp = []
    for (let i = 0; i < length; i++) {
      temp[i] = new Array(length).fill(0);
    }

    // Вставляем значения ротации фигуры
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        temp[x][y] = blocks[length - 1 - y][x]
      }
    }

    // Присваиваем результат
    this.activePiece.blocks = temp

    // Если есть столкновение, то присваиваем обратно значение
    if (this.hasCollision()) {
      this.activePiece.blocks = blocks
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
  
}