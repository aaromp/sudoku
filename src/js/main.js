var helpers = require('./helpers');

var Sudoku = function(n) {
	this.n = n;
	this.sqrt = Math.sqrt(this.n); // avoid redundant Math.sqrt calls
	this.board = helpers.createBoard(n);
	this.current = {};
};


Sudoku.prototype.setCell = helpers.setCell;
Sudoku.prototype.clearCell = function(row, column) {
	this.setCell(row, column, 0);
};
Sudoku.prototype.validateBoard = helpers.validateBoard;

module.exports = Sudoku;