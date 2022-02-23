const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let words = []
let wordle

const getWordle = () => {
    fetch('word.json')
        .then(response => response.json())
        .then(json => {
            words = json.words

            const randomNumber = Math.floor(Math.random() * 1300) - 41;
            wordle = words[randomNumber]
            console.log(wordle)
        })

}
getWordle()


const keys = [
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'Ğ',
    'Ü',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Ş',
    'İ',
    'ENTER',
    'Z',
    'C',
    'V',
    'B',
    'N',
    'M',
    'Ö',
    'Ç',
    '«',
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]


let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })

    tileDisplay.append(rowElement)
})




keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (letter) => {
    if (!isGameOver) {
        //console.log("Tıklandı", letter)
        if (letter === '«') {
            deleteLetter()
            // console.log('gues', guessRows)
            return
        }

        if (letter === 'ENTER') {
            checkRow()
            //console.log('gues', guessRows)
            return
        }
        addLetter(letter)
    }

}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
        tile.classList.add('PopIn')
    }


}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')

    }

}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')

    if (currentTile > 4) {

        fetch('word.json')
            .then(response => response.json())
            .then(json => {
                if (!json.words.includes(guess)) {
                    showMassage('Kelime listesinde yok')
                    shakeTile()
                    return
                } else {

                    flipTile()
                    if (wordle == guess) {
                        showMassage('Harika!')
                        bounceTile()
                        isGameOver = true
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            showMassage(wordle)
                            return
                        }

                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            })


    }

}

const showMassage = (message) => {

    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.style.margin = '20px 0'
    messageDisplay.append(messageElement)

    setTimeout(() => {
        messageDisplay.removeChild(messageElement);
        messageDisplay.style.margin = '0'

    }, 3000)
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)

}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []
    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })

    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })


    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

const shakeTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    rowTiles.forEach((tile, index) => {
        tile.classList.add('shake')
    })
}
const bounceTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('win')
        }, 2000)
    })

}
