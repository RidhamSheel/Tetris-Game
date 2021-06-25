document.addEventListener('DOMContentLoaded' , () =>{

    const start = document.getElementById('start-btn');
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    
    let count = 0;
    const width = 10;

    // Defining tetrominoes
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const oTetromino = [
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2]
    ];

    const zTetromino = [
        [1, width+1, width+2, width*2+2],
        [width+1, width+2, width*2, width*2+1],
        [1, width+1, width+2, width*2+2],
        [width+1, width+2, width*2, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [width, 1, width+1, width*2+1]
    ];

    const lTetromino = [
        [1, width+1, width*2+1, width*2+2],
        [width*2, width, width+1, width+2],
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, 2]
    ]

    const allTetrominoes = [iTetromino, oTetromino, zTetromino, tTetromino, lTetromino];

    let currentRotation = 0; //first rotation of each tetromino
    let currPos = 3;  //helps to draw tetromino specified squares away from edge

    let random = Math.floor(Math.random() * allTetrominoes.length);
    let nextRandom = Math.floor(Math.random() * allTetrominoes.length);
    let currentTetromino = allTetrominoes[random][currentRotation];

    let colors = ['red', 'green', 'blue', 'pink', 'orange'];

    // Displaying the tetrominoes
    function draw(){
        currentTetromino.forEach(index => {
            squares[currPos + index].classList.add('tetromino');
        })
    }
    // Removing the tetrominoes from previous position
    function undraw(){
        currentTetromino.forEach(index => {
            squares[currPos + index].classList.remove('tetromino');
            squares[currPos + index].style.backgroundColor = '';
        })
    }

    document.addEventListener('keydown', function(e){
        if(["ArrowUp", "ArrowDown"].indexOf(e.code) > -1){
            e.preventDefault();
        }
    }, false);

    // Controls for moving the tetrominoes
    function controls(e) {
        if(count === 0){
            if(e.keyCode === 37){
                moveLeft();
            }else if(e.keyCode === 39){
                moveRight();
            }else if(e.keyCode === 40){
                moveDown();
            }else if(e.keyCode === 38){
                rotateTetromino();
            }
        }else{
            return;
        }
      
    }
    document.addEventListener("keyup", controls);

    // For moving the tetrominoes downwards
    function moveDown(){
        undraw();
        currPos += width;
        draw();
        stopTetromino();
    }

    //  For moving the tetrominoes towards left
    function moveLeft(){
        undraw();
        const atLeft = currentTetromino.some(index => (currPos + index) % width === 0);

        if(!atLeft){
            currPos -= 1;
        }

        if(currentTetromino.some(index => squares[currPos + index].classList.contains('stop'))){
            currPos += 1;
        }
        draw();
    }

    //  For moving the tetrominoes towards right
    function moveRight(){
        undraw();
        const atRight = currentTetromino.some(index => (currPos + index) % width === 9);

        if(!atRight){
            currPos += 1;
        }

        if(currentTetromino.some(index => squares[currPos + index].classList.contains('stop'))){
            currPos -= 1;
        }
        draw();
    }

    // Rotates the tetromino
    function rotateTetromino(){
        undraw();
        currentRotation++;

        if(currentRotation > 3){
            currentRotation = 0;
        }
       
        const atLeft = currentTetromino.some(index => (currPos + index) % width === 0); // Prevents tetromino from breaking while rotating at left edge
        if(atLeft){
            currPos+=1;
        }

        const atRight = currentTetromino.some(index => (currPos + index) % width === 9); // Prevents tetromino from breaking while rotating at right edge
        if(atRight){
            currPos-=1;
        }
        
        currentTetromino = allTetrominoes[random][currentRotation];
        draw();

    }

    // Stops the tetromino if it reaches the bottom and generates the next tetromino
    function stopTetromino(){
        if(currentTetromino.some(index => squares[currPos + index + width].classList.contains('stop'))){

            currentTetromino.forEach(index => squares[currPos + index].classList.add('stop'));
        
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * allTetrominoes.length);
            currentTetromino = allTetrominoes[random][currentRotation];
            currPos = 3;
            draw();
            displayNext();
            displayScore();
            gameOver();
        }
    }

    // To display the next random tetromino beforehand
    let nextSquares = Array.from(document.querySelectorAll('.next-grid div'));

    const nextWidth = 4;
    let nextIndex = 0;

    const nextTetromino = [
        [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1], // iTetromino
        [1, 2, nextWidth+1, nextWidth+2], // oTetromino
        [1, nextWidth+1, nextWidth+2, nextWidth*2+2], // zTetromino
        [1, nextWidth, nextWidth+1, nextWidth+2], // tTetromino
        [1, nextWidth+1, nextWidth*2+1, nextWidth*2+2], // lTetromino
    ];

    function displayNext(){
        nextSquares.forEach(index => {
            index.classList.remove('tetromino');
        })

        nextTetromino[nextRandom].forEach(index =>{
            nextSquares[nextIndex + index].classList.add('tetromino');
            
        })
    }

    // Starts and Pauses the game when clicked
    let timer = 0;
    start.addEventListener('click', ()=>{
        count = 0;
        if(timer != 0){
            clearInterval(timer);
            timer = 0;
        }else{
            timer = setInterval(moveDown,1000);
            console.log(timer);
        }
        
    })
    displayNext();

    // Scoring and removing completely filled rows
    let Score = document.getElementById('score');
    let score = 0;

    function displayScore(){
        for(let i=0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('stop'))){
                score+=10;
                Score.innerHTML = score;

                row.forEach(index => {
                    squares[index].classList.remove('stop');
                    squares[index].classList.remove('tetromino');
                })
                
                const removed = squares.splice(i, width);
                squares = removed.concat(squares);
                squares.forEach(index => grid.appendChild(index))
            }
        }
    }
    
    // Game Over
    let container = document.querySelector('.container');
    let nextGridContainer = document.querySelector('.next-grid-container')
    function gameOver(){
        if(currentTetromino.some(index => squares[currPos + index].classList.contains('stop'))){
            var div = document.createElement('div');
            div.className = 'game-over';
            nextGridContainer.appendChild(div).innerHTML = "GAME OVER";
            clearInterval(timer);
            count++;
        }
    }

})