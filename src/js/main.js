var helpers = require('./helpers');
var SudokuSet = require('./set');

var Sudoku = function() {
	// if input is a number create a new board
	if (typeof arguments[0] === 'number' && arguments[0] > 1 && 
		helpers.isPerfectSquare.call(this, arguments[0])) {

		this.n = arguments[0];
		this.board = helpers.createBoard.call(this);
		this.current = {
			row: new SudokuSet(this.n),
			column: new SudokuSet(this.n),
			section: new SudokuSet(this.n)
		};
		this.options = helpers.initializeOptions.call(this);
	} 
	// if input in an array copy it as a board
	else if (Array.isArray(arguments[0]) && arguments[0].length > 1 && 
			 helpers.isPerfectSquare.call(this, arguments[0].length)) {

		this.n = arguments[0].length;
		this.board = helpers.createBoard.call(this);
		this.current = {
			row: new SudokuSet(this.n),
			column: new SudokuSet(this.n),
			section: new SudokuSet(this.n)
		};
		this.options = helpers.initializeOptions.call(this);
		arguments[0].forEach(function(row, rowIndex) {
			if (row.length !== this.n) throw new Error('the matrix must be n x n');

			row.forEach(function(value, columnIndex) {
				this.setCell.call(this, rowIndex, columnIndex, value);
			}.bind(this));
		}.bind(this));
	} 
	// otherwise throw an exception
	else {
		throw new Error('invalid input! input must be a n or an n x n matrix ' +
						'where n is a perfect square larger than 1');
	}
};


Sudoku.prototype.setCell = function(row, column, value) {
	if (this.board[row][column] !== 0 && value === 0) this.remainingMoves++;
	else if (this.board[row][column] === 0 && value !== 0) this.remainingMoves--;
	var previous = this.board[row][column];
	this.board[row][column] = value;
	helpers.validatePlacement.call(this, row, column);
	if (previous !== value) helpers.updateOptions.call(this, previous, row, column);
};

Sudoku.prototype.clearCell = function(row, column) {
	this.setCell(row, column, 0);
};

Sudoku.prototype.validateBoard = helpers.validateBoard;

var recSolve = function() {
	console.log('remainingMoves', this.remainingMoves);
	if (this.remainingMoves === 0) return true;
	// find the most constrained tile (fewest options and isn't set)
	var position = helpers.findMostConstrained.call(this);
	console.log('position', position);
	if (position === undefined) return false;
	var options = Object.keys(this.options[position[0]][position[1]]);
	console.log('options', options);

	// if the current position only has one thing avaiable place it
	if (options.length === 1) {
		this.setCell(position[0], position[1], parseInt(options[0]));
		console.log('set', options[0], 'at', position);
		console.log(this.board);
		this.solve.call(this);
	// for each option:
	} else {
		options.forEach(function(option) {
			// look ahead—if option has to be something else, skip it
			if (helpers.lookAhead.call(this, position[0], position[1], option)) {
				// otherwise place it and recurse
				this.setCell(position[0], position[1], parseInt(option));
				console.log('set', option, 'at', position);
				console.log(this.board);
				// if we succeed we're done
				if (recSolve.call(this)) return true;
				// otherwise we need to backtrack
				this.clearCell(position[0], position[1]);
			}		
		}.bind(this));
	}
};

Sudoku.prototype.solve = function() {
	helpers.removeInvalidPlacements.call(this);
	recSolve.call(this);
};

module.exports = Sudoku;