export default class Game {
  score = 0
  lines = 0
  level = 0

  // Игровое поле
  playfield = this.createPlayField()

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
      playfield
    }
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
  
}