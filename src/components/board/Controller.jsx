import React, {useState} from 'react';
import Board from "./Board";

function Controller(props) {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);
    const [snakeFactor, setSnakeFactor] = useState(5);
    const [ladderFactor, setLadderFactor] = useState(5);
    const [animationEnabled, setAnimationEnabled] = useState(false);

    return (
        <div className="container">
            <Board
                rows={rows} cols={cols}
                snakeFactor={snakeFactor}
                ladderFactor={ladderFactor}
                animation={animationEnabled}>
            </Board>
            <div className="config-container">
                <div className="config-item">
                    <label>ROWS:</label>
                    <input type="number" min="1" value={rows} onChange={(e) => setRows(parseInt(e.target.value))}/>
                </div>
                <div className="config-item">
                    <label>COLS:</label>
                    <input type="number" min="1" value={cols} onChange={(e) => setCols(parseInt(e.target.value))}/>
                </div>
                <div className="config-item">
                    <label>Snake Factor:</label>
                    <input type="number" min="1" value={snakeFactor}
                           onChange={(e) => setSnakeFactor(parseInt(e.target.value))}/>
                </div>
                <div className="config-item">
                    <label>Ladder Factor:</label>
                    <input type="number" min="1" value={ladderFactor}
                           onChange={(e) => setLadderFactor(parseInt(e.target.value))}/>
                </div>

                <div className="config-item">
                    <label>ANIMATION:</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="animation"
                                value="on"
                                checked={animationEnabled}
                                onChange={() => setAnimationEnabled(true)}
                            />
                            ON
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="animation"
                                value="off"
                                checked={!animationEnabled}
                                onChange={() => setAnimationEnabled(false)}
                            />
                            OFF
                        </label>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Controller;