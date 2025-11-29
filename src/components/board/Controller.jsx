import React, {useState} from 'react';
import Board from "./board/Board";

function Controller(props) {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);


    return (
        <div>
            <div className="config-container">
                <div className="config-item">
                    <label>ROWS:</label>
                    <input type="number" min="1" value={rows} onChange={(e) => setRows(parseInt(e.target.value))}/>
                </div>
                <div className="config-item">
                    <label>COLS:</label>
                    <input type="number" min="1" value={cols} onChange={(e) => setCols(parseInt(e.target.value))}/>
                </div>
            </div>
            <Board rows={rows} cols={cols}></Board>
        </div>
    );
}

export default Controller;