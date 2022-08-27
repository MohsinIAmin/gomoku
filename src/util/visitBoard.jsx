class VisitBoard {

    travers(board, visitor) {
        this.traversRow(board, visitor);
        this.traversCol(board, visitor);
        this.traversDiffDiagonal(board, visitor);
        this.traversSumDiagonal(board, visitor);
    }

    traversRow(board, visitor) {
        for (let rowIdx = 0; rowIdx < board.size; rowIdx++) {
            for (let colIdx = 0; colIdx < board.size; colIdx++) {
                if (visitor.visit(board, rowIdx, colIdx)) {
                    return;
                }
            }
            visitor.reset();
        }
    }

    traversCol(board, visitor) {
        for (let colIdx = 0; colIdx < board.size; colIdx++) {
            for (let rowIdx = 0; rowIdx < board.size; rowIdx++) {
                if (visitor.visit(board, rowIdx, colIdx)) {
                    return;
                }
            }
            visitor.reset();
        }
    }

    traversSumDiagonal(board, visitor) {
        for (let colIdx = 0; colIdx < board.size; colIdx++) {
            for (let rowIdx = 0; rowIdx < board.size; rowIdx++) {
                if (visitor.visit(board, rowIdx, colIdx)) {
                    return;
                }
            }
            visitor.reset();
        }
    }

    traversDiffDiagonal(board, visitor) {
        for (let diff = -(board.size - 1); diff <= board.size - 1; diff++) {
            let xMax = Math.min(board.size - 1, board.size + diff - 1);
            let xMin = Math.max(0, diff);
            for (let x = xMin; x <= xMax; x++) {
                let y = x - diff;
                if (visitor.visit(board, x, y)) {
                    return;
                }
            }
            visitor.reset();
        }
    }
}

export default VisitBoard;