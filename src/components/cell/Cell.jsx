import React from 'react';
import "./cell.css"

function Cell(props) {
    const {number, isSnake, isLadder} = props;

    return (
        <div className="cell-container" id={`cell-id-${number}`}>
            <div className="cell-number">
                {number}
            </div>
        </div>
    );
}

export default Cell;