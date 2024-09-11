
const board = document.getElementById('board')
const hscore = document.getElementById('hscore')
const cscore = document.getElementById('cscore')
const gameBtn = document.getElementById('gameBtn')

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let food = document.createElement('div')
food.id = "food"
board.appendChild(food)

gameBtn.innerText = "Start"

let foodPos = { x: 15, y: 15 }

let dir = { x: 0, y: 1 }

let snake = [
    { x: 5, y: 4 },
    { x: 5, y: 3 },
    { x: 5, y: 2 }
]

let score = 0
let highestScore = localStorage.getItem("highestScore") || 10
let isStop = true

const keys = {
    "ArrowUp": { x: -1, y: 0 },
    "ArrowRight": { x: 0, y: 1 },
    "ArrowDown": { x: 1, y: 0 },
    "ArrowLeft": { x: 0, y: -1 }
}

const handleKeyPress = (e) => {
    if (e.key in keys) {
        dir.x = keys[e.key].x
        dir.y = keys[e.key].y
        moveSound.currentTime = 0
        moveSound.play()
    } else if (e.key === " ") {
        handleGameBtn()
    }
}
const handleBtnKeyPress = (x, y) => {
    if (x == -1 && y == -1) {
        handleGameBtn()
        return
    }
    dir.x = x
    dir.y = y
    moveSound.currentTime = 0
    moveSound.play()
}

const isEnd = (x, y) => {
    if (0 < x && x < 31 && 0 < y && y < 31) {
        for (let i = 1; i < snake.length; i++) {
            if (x == snake[i].x && y == snake[i].y) {
                return true
            }
        }
        return false
    }
    return true
}

const isEat = (x, y) => {

    if (x == foodPos.x && y == foodPos.y) {
        foodSound.currentTime = 0
        foodSound.play()

        let body = document.createElement('div')
        body.classList.add("snake")
        board.appendChild(body)
        snake.push({ x: x, y: y, cell: body })

        foodPos.x = Math.floor((Math.random() * 30) + 1)
        foodPos.y = Math.floor((Math.random() * 30) + 1)

        while (foodPos in snake) {
            foodPos.x = Math.floor((Math.random() * 30) + 1)
            foodPos.y = Math.floor((Math.random() * 30) + 1)
        }

        food.style.gridRowStart = foodPos.x
        food.style.gridColumnStart = foodPos.y

        score += 1
        if (score > highestScore) {
            highestScore = score
            hscore.innerText = highestScore
        }
        cscore.innerText = score
    }

}

const displaySnake = () => {

    cscore.innerText = score
    hscore.innerText = highestScore

    food.style.gridRowStart = foodPos.x
    food.style.gridColumnStart = foodPos.y

    snake.forEach((e, i) => {
        let body = document.createElement('div')
        body.classList.add('snake')
        snake[i]["cell"] = body
        if (i === 0) {
            body.classList.add('head')
        }
        body.style.gridRowStart = e.x
        body.style.gridColumnStart = e.y
        board.appendChild(body)
    })
}

const gameReset = () => {
    foodPos = { x: 15, y: 15 }
    dir = { x: 0, y: 1 }
    snake = [
        { x: 5, y: 4 },
        { x: 5, y: 3 },
        { x: 5, y: 2 }
    ]
    localStorage.setItem('highestScore', highestScore)
    score = 0
    board.innerHTML = ""
    food = document.createElement('div')
    food.id = "food"
    board.appendChild(food)
    displaySnake()
    musicSound.currentTime = 0
}

displaySnake();


const gameEngine = () => {
    const head = { ...snake[0] }

    snake[0].x = snake[0].x + dir.x
    snake[0].y = snake[0].y + dir.y

    isEat(head.x, head.y)

    if (isEnd(snake[0].x, snake[0].y)) {
        console.log("end", intervalId)
        gameOverSound.play()
        handleGameBtn()
        gameReset()
        return
    }

    snake[0].cell.style.gridRowStart = snake[0].x
    snake[0].cell.style.gridColumnStart = snake[0].y

    snake[snake.length - 1].x = head.x
    snake[snake.length - 1].y = head.y
    snake[snake.length - 1].cell.style.gridRowStart = head.x
    snake[snake.length - 1].cell.style.gridColumnStart = head.y

    snake = [
        snake[0],
        snake[snake.length - 1],
        ...snake.slice(1, length - 1)
    ]


}

window.addEventListener('keydown', handleKeyPress)

let intervalId

const handleGameBtn = () => {
    if (isStop) {
        intervalId = setInterval(gameEngine, 200)
        musicSound.play()
    } else {
        clearInterval(intervalId)
        musicSound.pause()
    }
    isStop = !isStop
    gameBtn.innerText = isStop ? "Start" : "Stop"
}

gameBtn.addEventListener("click", handleGameBtn)

const up = document.getElementById("up")
up.addEventListener('click', () => { handleBtnKeyPress(-1, 0) })

const left = document.getElementById("left")
left.addEventListener('click', () => { handleBtnKeyPress(0, -1) })

const right = document.getElementById("right")
right.addEventListener("click", () => { handleBtnKeyPress(0, 1) })

const down = document.getElementById("down")
down.addEventListener('click', () => { handleBtnKeyPress(1, 0) })

const center = document.getElementById('center')
center.addEventListener('click', () => { handleBtnKeyPress(-1, -1) })