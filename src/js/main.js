var helpers = require('./helpers');

var Sudokuber = function(n) {
	this.n = n;
	this.board = helpers.createBoard(n);
	this.current = {};
};


Sudokuber.prototype.setCell = helpers.setCell;
Sudokuber.prototype.clearCell = helpers.clearCell;
Sudokuber.prototype.validate = helpers.validate;

module.exports = Sudokuber;