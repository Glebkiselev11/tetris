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

  // Проверяет вышла ли фигура за границы поля и стулкнулась ли она с другой фигурой
  hasCollision() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {

        if (
          blocks[y][x] !== 0  && // Проверяем наличие блока в фигуре
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
        if (blocks[y][x] !== 0) {
          this.playfield[pieceY + y][pieceX + x] = blocks[y][x]
        }
      }
    }
  }
  
}