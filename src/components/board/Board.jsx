import React, {useEffect, useRef, useState} from 'react';
import Cell from "../cell/Cell";
import "./board.css"

function Board(props) {
    const {rows, cols, animation, snakeFactor, ladderFactor} = props;
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
        debugger
        const newSnakes = [];
        const newLadders = [];
        const snakeCount = Math.floor(totalCells * (snakeFactor/100))
        const ladderCount = Math.floor(totalCells * (ladderFactor/100))

        for (let i = 0; i < snakeCount; i++) {
            let start, end;
            do {
                start = Math.floor(Math.random() * totalCells * 0.7 + Math.random() * (totalCells * 0.7)) + 1;
                end = Math.floor(Math.random() * (totalCells)) + 1;
            } while (start <= end || start > totalCells || newSnakes[start] || newLadders[start] || newSnakes[end] || newLadders[end])
            newSnakes[start] = end;
        }

        for (let i = 0; i < ladderCount; i++) {
            let start, end;
            do {
                start = Math.floor(Math.random() * (totalCells * 0.6)) + 1;
                end = Math.floor(Math.random() * (totalCells)) + 1;
            } while (start >= end || newSnakes[start] || newLadders[start] || newSnakes[end] || newLadders[end])
            newLadders[start] = end;
        }
        setSnakes(newSnakes);
        setLadders(newLadders);
    }

    useEffect(() => {
        generateSnakesAndLadders();
        generateCells();
    }, [rows, cols, snakeFactor, ladderFactor]);


    useEffect(() => {
        const handleResize = () => updateCellsPositions();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function renderLadders() {
        if (!cellPositions || cellPositions.length === 0) return;
        return Object.entries(ladders).map(([start, end]) => {
            const startPos = cellPositions[start];
            const endPos = cellPositions[end];

            if (!startPos || !endPos) return;

            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const angle = Math.atan2(dy, dx);

            const arrowSize = 12;
            const arrowX1 = endPos.x - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowY1 = endPos.y - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrowX2 = endPos.x - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowY2 = endPos.y - arrowSize * Math.sin(angle + Math.PI / 6);

            const pathId = `ladder-path-${start}-${end}`;

            return (
                <g key={`ladder-${start}-${end}`}>
                    <defs>
                        <path
                            id={pathId}
                            d={`M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`}
                            fill="none"
                        />
                    </defs>
                    <line
                        x1={startPos.x}
                        y1={startPos.y}
                        x2={endPos.x}
                        y2={endPos.y}
                        stroke="#e82986"
                        strokeWidth="2px"
                        strokeLinecap="round"
                    />
                    <path
                        d={`M ${endPos.x} ${endPos.y} L ${arrowX1} ${arrowY1} L ${arrowX2} ${arrowY2} Z`}
                        fill="#e82986"
                        className={animation && "blinking-arrow"}
                    />
                </g>
            )
        })
    }


    function renderSnakeCircle(pathId, endPos) {
        if (animation) {
            return <circle
                r="2"
                fill="#FFFFFF"
                className="blinking-dot"
            >
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    calcMode="linear"
                >
                    <mpath href={`#${pathId}`}/>
                </animateMotion>
                <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="1s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        } else {
            return <circle
                cx={endPos.x}
                cy={endPos.y}
                r="2"
                fill="#FFFFFF"
                className="blinking-dot"
            />
        }

    }

    function renderSnakes() {
        if (!cellPositions || Object.keys(cellPositions).length === 0) return null;

        return Object.entries(snakes).map(([start, end]) => {
            const startPos = cellPositions[start];
            const endPos = cellPositions[end];

            if (!startPos || !endPos) return null;

            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const segments = 20;
            const amplitude = 20;
            const pathData = [];

            pathData.push(`M ${startPos.x} ${startPos.y}`);


            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const x = startPos.x + dx * t;
                const y = startPos.y + dy * t;

                const wave = Math.sin(t * Math.PI * 2) * amplitude;
                const offsetX = (dy / distance) * wave;
                const offsetY = (-dx / distance) * wave;

                pathData.push(`L ${x + offsetX} ${y + offsetY}`);
            }

            pathData.push(`L ${endPos.x} ${endPos.y}`);
            const pathId = `snake-path-${start}-${end}`;

            return (
                <g key={`snake-${start}-${end}`}>
                    <defs>
                        <path
                            id={pathId}
                            d={pathData.join(' ')}
                            fill="none"
                        />
                    </defs>

                    <path
                        d={pathData.join(' ')}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />
                    {renderSnakeCircle(pathId, endPos)}

                </g>
            );
        });
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