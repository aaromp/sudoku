var helpers = require('./helpers');

var Sudoku = function() {
	// if input is a number create a new board
	if (typeof arguments[0] === 'number' && arguments[0] > 1 && 
		helpers.isPerfectSquare.call(this, arguments[0])) {
		this.n = arguments[0];
		this.board = helpers.createBoard(this.n);
	} 
	// if input in an array copy it as a board
	else if (Array.isArray(arguments[0]) && arguments[0].length > 1 && 
			 helpers.isPerfectSquare.call(this, arguments[0].length)) {
		this.n = arguments[0].length;
		this.board = arguments[0].reduce(function(board, row) {
			if (row.length !== this.n) throw new Error('the matrix must be n x n');
			board.push(row.slice());
			return board;
		}.bind(this), []);
	} 
	// otherwise throw an exception
	else {
		throw new Error('invalid input! input must be a n or an n x n matrix where n is a perfect square larger than 1');
	}

	this.current = {};
};


Sudoku.prototype.setCell = helpers.setCell;
Sudoku.prototype.clearCell = function(row, column) {
	this.setCell(row, column, 0);
};
Sudoku.prototype.validateBoard = helpers.validateBoard;

module.exports = Sudoku;