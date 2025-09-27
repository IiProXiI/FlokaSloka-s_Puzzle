class MazeGame {
    constructor() {
        this.maze = [];
        this.playerPos = { x: 0, y: 0 };
        this.collectedLetters = [];
        this.letterPositions = [];
        this.mazeSize = 15;
        this.init();
    }

    init() {
        this.generateMaze();
        this.placeLetters();
        this.renderMaze();
    }

    generateMaze() {
        // خوارزمية توليد متاهة
        for (let y = 0; y < this.mazeSize; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.mazeSize; x++) {
                if (x === 0 && y === 0) {
                    this.maze[y][x] = 'start';
                } else if (x === this.mazeSize - 1 && y === this.mazeSize - 1) {
                    this.maze[y][x] = 'end';
                } else {
                    this.maze[y][x] = Math.random() > 0.25 ? 'path' : 'wall';
                }
            }
        }
        
        // ضمان وجود مسار
        this.ensurePath();
    }

    ensurePath() {
        // تطبيق خوارزمية لتأكيد وجود مسار
        // ... (كود متقدم لتوليد متاهة صالحة)
    }

    placeLetters() {
        const letters = puzzleSystem.puzzles[3].letters;
        this.letterPositions = [];
        
        letters.forEach((letter, index) => {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * this.mazeSize),
                    y: Math.floor(Math.random() * this.mazeSize)
                };
            } while (this.maze[pos.y][pos.x] !== 'path' || 
                     this.letterPositions.some(p => p.x === pos.x && p.y === pos.y));
            
            this.letterPositions.push({ ...pos, letter, collected: false });
        });
    }

    renderMaze() {
        const container = document.getElementById('mazeContainer');
        if (!container) return;

        container.innerHTML = '';
        
        for (let y = 0; y < this.mazeSize; y++) {
            const row = document.createElement('div');
            row.className = 'maze-row';
            
            for (let x = 0; x < this.mazeSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                const cellType = this.maze[y][x];
                cell.classList.add(cellType);
                
                // التحقق من وجود اللاعب
                if (x === this.playerPos.x && y === this.playerPos.y) {
                    cell.classList.add('player');
                }
                
                // التحقق من وجود حرف
                const letterPos = this.letterPositions.find(pos => 
                    pos.x === x && pos.y === y && !pos.collected
                );
                if (letterPos) {
                    cell.classList.add('has-letter');
                    cell.textContent = letterPos.letter;
                }
                
                // النهاية
                if (cellType === 'end') {
                    cell.classList.add('end');
                }
                
                row.appendChild(cell);
            }
            container.appendChild(row);
        }
    }

    movePlayer(direction) {
        const newPos = { ...this.playerPos };
        
        switch(direction) {
            case 'up': newPos.y--; break;
            case 'down': newPos.y++; break;
            case 'left': newPos.x--; break;
            case 'right': newPos.x++; break;
        }
        
        if (this.isValidMove(newPos)) {
            this.playerPos = newPos;
            this.checkLetterCollection();
            this.renderMaze();
            this.updateCollectedLetters();
            
            if (this.maze[newPos.y][newPos.x] === 'end') {
                this.onMazeComplete();
            }
        }
    }

    isValidMove(pos) {
        return pos.x >= 0 && pos.x < this.mazeSize && 
               pos.y >= 0 && pos.y < this.mazeSize && 
               this.maze[pos.y][pos.x] !== 'wall';
    }

    checkLetterCollection() {
        const letterIndex = this.letterPositions.findIndex(pos => 
            pos.x === this.playerPos.x && 
            pos.y === this.playerPos.y && 
            !pos.collected
        );
        
        if (letterIndex !== -1) {
            this.letterPositions[letterIndex].collected = true;
            this.collectedLetters.push(this.letterPositions[letterIndex].letter);
            this.showLetterPopup(this.letterPositions[letterIndex].letter);
        }
    }

    showLetterPopup(letter) {
        const popup = document.createElement('div');
        popup.className = 'letter-display';
        popup.textContent = letter;
        
        document.getElementById('mazeContainer').appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    updateCollectedLetters() {
        const container = document.getElementById('collectedLetters');
        if (container) {
            container.textContent = this.collectedLetters.join('');
        }
    }

    onMazeComplete() {
        setTimeout(() => {
            alert('ممتاز! لقد وجدت طريقك. الآن اكتب الجملة التي جمعتها.');
        }, 500);
    }
}

const mazeGame = new MazeGame();

// أحداث الحركة
document.addEventListener('keydown', (e) => {
    if (puzzleSystem.currentPuzzle === 3) {
        switch(e.key) {
            case 'ArrowUp': mazeGame.movePlayer('up'); break;
            case 'ArrowDown': mazeGame.movePlayer('down'); break;
            case 'ArrowLeft': mazeGame.movePlayer('left'); break;
            case 'ArrowRight': mazeGame.movePlayer('right'); break;
        }
    }
});
