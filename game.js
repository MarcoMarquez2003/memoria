let pokemonImages = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let allImagesLoaded = false; 
function preload() {
    let promises = [];
    for (let i = 1; i <= 10; i++) {
        let id = Math.floor(Math.random() * 150) + 1;
        promises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(response => response.json())
                .then(data => {
                    let img = loadImage(data.sprites.front_default);
                    pokemonImages.push(img);
                })
        );
    }
    Promise.all(promises).then(() => {
        allImagesLoaded = true;
        setupGame();
    });
}

function setup() {
    createCanvas(600, 600);
}

function setupGame() {
    if (!allImagesLoaded) return;
    let tempImages = [...pokemonImages, ...pokemonImages];
    tempImages = shuffle(tempImages);
    for (let i = 0; i < 20; i++) {
        cards.push({
            img: tempImages[i],
            isFlipped: false,
            matched: false
        });
    }
}

function draw() {
    background(220);
    if (!allImagesLoaded) {
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Cargando...", width / 2, height / 2);
        return;
    }
    for (let i = 0; i < 20; i++) {
        let x = (i % 5) * 120;
        let y = Math.floor(i / 5) * 120;
        if (cards[i].isFlipped || cards[i].matched) {
            image(cards[i].img, x + 10, y + 10, 100, 100);
        } else {
            fill(0);
            rect(x + 10, y + 10, 100, 100, 10);
        }
    }
}

function mousePressed() {
    if (!canFlip || !allImagesLoaded) return;
    let col = Math.floor(mouseX / 120);
    let row = Math.floor(mouseY / 120);
    let index = row * 5 + col;
    if (index >= 20 || cards[index].isFlipped || cards[index].matched) return;
    
    cards[index].isFlipped = true;
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    let [first, second] = flippedCards;
    if (cards[first].img === cards[second].img) {
        cards[first].matched = true;
        cards[second].matched = true;
        matchedPairs++;
    } else {
        cards[first].isFlipped = false;
        cards[second].isFlipped = false;
    }
    flippedCards = [];
    canFlip = true;
    if (matchedPairs === 10) {
        alert("¡Ganaste!.");
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
