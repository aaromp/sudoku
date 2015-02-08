var helpers = require('./helpers');

var Sudokuber = function(n) {
	this.n = n;
	this.sqrt = Math.sqrt(this.n);
	this.board = helpers.createBoard(n);
	this.current = {};
};


Sudokuber.prototype.setCell = helpers.setCell;
Sudokuber.prototype.clearCell = helpers.clearCell;
Sudokuber.prototype.validateBoard = helpers.validateBoard;

module.exports = Sudokuber;