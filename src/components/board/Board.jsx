import React, {useEffect, useRef, useState} from 'react';
import Cell from "./Cell";
import "./board.css"

function Board(props) {
    const {rows, cols} = props;
    const totalCells = rows * cols;
    const [cells, setCells] = useState([]);
    const [snakes, setSnakes] = useState({});
    const [ladders, setLadders] = useState({});
    const [cellPositions, setCellPositions] = useState([]);
    const boardRef = useRef(null);

    function generateCells() {
        const newCells = [];
        for (let i = rows - 1; i >= 0; i--) {
            const isReverse = i % 2 === 1;
            for (let j = 0; j < cols; j++) {
                const realCol = isReverse ? cols - j - 1 : j;
                const number = i * cols + realCol + 1;
                newCells.push({
                    number: number,
                    row: i,
                    col: j
                    //...
                })
            }
        }
        setCells(newCells);
    }

    function generateSnakesAndLadders() {
        const newSnakes = [];
        const newLadders = [];
        const snakeCount = Math.floor(totalCells * 0.1)
        const ladderCount = Math.floor(totalCells * 0.1)

        for (let i = 0; i < snakeCount; i++) {
            let start, end;
            do {
                start = Math.floor(Math.random() * totalCells * 0.7+ Math.random() * (totalCells * 0.5)) + 1;
                end = Math.floor(Math.random() * (totalCells)) + 1;
            } while (start > end && start < totalCells)
            newSnakes[start] = end;
        }

        for (let i = 0; i < ladderCount; i++) {
            let start, end;
            do {
                start = Math.floor(Math.random() * totalCells) + 1;
                end = Math.floor(Math.random() * (totalCells * 0.6)) + 1;
            } while (start < end)
            newLadders[start] = end;
        }
        setSnakes(newSnakes);
        setLadders(newLadders);
    }

    useEffect(() => {
        generateSnakesAndLadders();
        generateCells();
    }, [rows, cols]);


    function renderLadders() {
        if (!cellPositions || cellPositions.length === 0) return;
        return Object.entries(ladders).map(([start, end]) => {
            const startPos = cellPositions[start];
            const endPos = cellPositions[end];

            if (!startPos || !endPos) return;

            return (
                <line
                    key={`ladder-${start}-${end}`}
                    x1={startPos.x}
                    y1={startPos.y}
                    x2={endPos.x}
                    y2={endPos.y}
                    stroke="#e82986"
                    strokeWidth="2px"
                    strokeLinecap="round"
                ></line>
            )
        })
    }

    function renderSnakes() {
        if (!cellPositions || cellPositions.length === 0) return;
        return Object.entries(snakes).map(([start, end]) => {
            const startPos = cellPositions[start];
            const endPos = cellPositions[end];

            if (!startPos || !endPos) return;

            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const segments = 10;
            const amplitude = 5; // 非常小的幅度
            const pathData = [];

            pathData.push(`M ${startPos.x} ${startPos.y}`);

            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = startPos.x + dx * t;
                const y = startPos.y + dy * t;

                const wave = Math.sin(t * Math.PI * 8) * amplitude;

                const offsetX = (dy / distance) * wave;
                const offsetY = (-dx / distance) * wave;

                if (i === segments) {
                    pathData.push(`L ${endPos.x} ${endPos.y}`);
                } else {
                    pathData.push(`L ${x + offsetX} ${y + offsetY}`);
                }
            }

            return (
                <path
                    key={`snake-${start}-${end}`}
                    d={pathData.join(' ')}
                    stroke="#12ff27"
                    strokeWidth="2px"
                    strokeLinecap="round"
                    fill="none"
                ></path>
            )
        })
    }

    function updateCellsPositions() {
        if (!boardRef.current) return;

        const positions = [];
        const boardRect = boardRef.current.getBoundingClientRect();

        cells.map(cell => {
            const cellElement = document.getElementById(`cell-id-${cell.number}`)
            if (cellElement) {
                const cellRect = cellElement.getBoundingClientRect();
                positions[cell.number] = {
                    x: cellRect.left + cellRect.width / 2 - boardRect.left,
                    y: cellRect.top + cellRect.height / 2 - boardRect.top,
                }
            }
        })
        setCellPositions(positions);
    }

    useEffect(() => {
        updateCellsPositions();
    }, [cells]);

    return (
        <div className="board-container">
            <div ref={boardRef}
                 className="board"
                 style={{
                     gridTemplateColumns: `repeat(${cols}, 60px)`,
                     gridTemplateRows: `repeat(${rows}, 60px)`,
                     height: `${rows * 60}px`,
                     width: `${cols * 60}px`,
                 }}>
                <svg className="svg-container">
                    {renderLadders()}
                    {renderSnakes()}
                </svg>
                {cells && cells.map(cell => (
                    <Cell
                        key={cell.number}
                        number={cell.number}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;