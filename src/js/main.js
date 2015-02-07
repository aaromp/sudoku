var helpers = require('./helpers');

var Sudokuber = function(n) {
	this.n = n;
	this.board = helpers.createBoard(n);
};

Sudokuber.prototype.validateCell = helpers.validateCell;

module.exports = Sudokuber;