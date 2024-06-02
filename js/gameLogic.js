import { displayCards } from "./uiControl.js";
import { addPoints, startCountdown, intervalID } from "./timerAndPoints.js";
import { endGameSounds } from "./sound.js";

let cardsToCompare = [];
let cardsToCompareId = [];
let cardsMatched = [];


const time = 60 * 2;
let isClickable = true;



function initializeGame(level, levelData) {
    const currentLevel = levelData[level];
    const shuffledCards = shuffle(currentLevel.data);
    displayCards(shuffledCards, level);
    startCountdown(time);
}

function shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
}

function flipCard(levels, level, target) {
        if (!isClickable) return;
        let cardId = target.getAttribute('data-id');
        const currentLevel = levels[level];
        const card = currentLevel.data[cardId];

        const cardImg = target.querySelector('img');
        cardImg.classList.add('rotate')
        setTimeout(function() {
            cardImg.setAttribute('src', card.url);
        }, 200);
        setTimeout(function() {
            cardImg.classList.remove('rotate');
    }, 400);

        cardsToCompare.push(card.url);
        cardsToCompareId.push(cardId);


        if (cardsToCompare.length === 2) {
            isClickable = false;
            document.querySelector('.deck').classList.add('not-clickable');
            setTimeout(() => checkForMatch(currentLevel), 500);
        }
}


function checkForMatch(currentLevel) {
    const cards = document.querySelectorAll('.card img');
    const firstCard = cards[cardsToCompareId[0]];
    const secondCard = cards[cardsToCompareId[1]];

    if (cardsToCompare[0] === cardsToCompare[1]) {
        firstCard.parentElement.removeEventListener('click', flipCard);
        secondCard.parentElement.removeEventListener('click', flipCard);
        checkIfAllCardsMAtched(currentLevel, firstCard);
        checkIfAllCardsMAtched(currentLevel, secondCard);
        addPoints();
    } else {
        firstCard.classList.add('rotate')
        secondCard.classList.add('rotate')
        setTimeout(function() {
        firstCard.setAttribute('src', '../assets/images/card_back.png');
        secondCard.setAttribute('src', '../assets/images/card_back.png');
        }, 100);
        setTimeout(function() {
            firstCard.classList.remove('rotate');
            secondCard.classList.remove('rotate');
    }, 500);
 };

    cardsToCompare.length = 0;
    cardsToCompareId.length = 0;
    document.querySelector('.deck').classList.remove('not-clickable');
    isClickable = true;
}



function endGame(outcome) {
    const dialog = document.querySelector('dialog');
    if (outcome === 'win') {
        clearInterval(intervalID);
        dialog.innerHTML = `
            <h2> Cogratulations!<br/>You're the winner!</h2>
            <img src = "./assets/images/winner2.png" alt = "winner_image">
            <div class="button-wrapper">
                <div class="button">
                    <a class="button-content" href=>Restart</a>
                </div>
                <div class="button">
                    <a class="button-content" href="./index.html">Exit</a>
                </div>
            </div>
            `
        
        dialog.classList.remove('looser')
        dialog.classList.add('winner');
        endGameSounds('win');

    } else {
        dialog.innerHTML = `
        <h2> You lost!<br/>Try again!</h2>
        <img src = "./assets/images/looser.png" alt = "looser_image">
        <div class="button-wrapper">
            <div class="button">
                <a class="button-content" href=>Restart</a>
            </div>
            <div class="button">
                <a class="button-content" href="./index.html">Exit</a>
            </div>
        </div>
        `
        dialog.classList.remove('winner');
        dialog.classList.add('looser');
        endGameSounds('loose');
        }
    dialog.showModal()

}


function checkIfAllCardsMAtched(currentLevel, card) {
    cardsMatched.push(card)
    if (cardsMatched.length >= currentLevel.cards) {
        endGame('win')
    }
}



export { initializeGame, flipCard, endGame }