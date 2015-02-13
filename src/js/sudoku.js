var helpers = require('./helpers');
var SudokuState = require('./state');

var Sudoku = function(input) {
	// check for valid input
	if (helpers.isValidNumericalInput.call(this, input)) {
		this.n = input;
	} else if (helpers.isValidMatrixInput.call(this, input)) {
		this.n = input.length;
	} else {
		throw new Error('invalid input! input must be an integer, n, or an ' +
					    'n x n matrix where n is a perfect square larger than 1');
	}

	this.remainingMoves = this.n * this.n;
	this.state = new SudokuState(this.n); // tracks the validity of the board
	this.board = helpers.initializeMatrix.call(this, this.n, function() {
		return 0;
	});

	// if input is a matrix, initialize the board with its values
	if (Array.isArray(input)) {
		input.forEach(function(row, rowIndex) {
			if (row.length !== this.n) throw new Error('the matrix must be n x n');

			row.forEach(function(value, columnIndex) {
				this.set(rowIndex, columnIndex, value);
			}.bind(this));
		}.bind(this));
	}
};

Sudoku.prototype.set = function(row, column, value) {
	if (this.board[row][column] !== 0 && value === 0) this.remainingMoves++;
	else if (this.board[row][column] === 0 && value !== 0) this.remainingMoves--;
	var previous = this.board[row][column];
	this.state.update(row, column, previous, value);
	this.board[row][column] = value;
};

function lookAhead(row, column, value) {
	var available = true;
	var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
	var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	helpers.setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
		var options = this.state.getOptions(row, column);
		if (options[value] && Object.keys(options).length === 1) available = false;
	});

	return available;
}

function getMostConstrained(callback) {
	var fewestOptions = this.n + 1;
	var targetRow, targetColumn, targetOptions;
	var options, numOptions;
	for (var row = 0; row < this.n; row++) {
		for (var column = 0; column < this.n; column++) {
			if (this.board[row][column] === 0 && lookAhead.call(row, column, this.board[row][column])) {
				options = this.state.getOptions(row, column);
				numOptions = Object.keys(options).length;
				if (numOptions === 1) {
					return callback.call(this, row, column, options);
				} else if (numOptions > 0 && numOptions < fewestOptions) {
					fewestOptions = numOptions;
					targetRow = row;
					targetColumn = column;
					targetOptions = options;
				}
			}
		}
	}


	return callback.call(this, targetRow, targetColumn, targetOptions);
}
var count = 0;
function recSolve() {
	count++;
	// base case: if there aren't any remaining moves, the puzzle is sovled
	if (this.remainingMoves === 0) return true;

	// find the most constrained cell (fewest options and isn't set)
	return getMostConstrained.call(this, function(row, column, options) {
		// base case: moves remain but there are not more options
		if (options === undefined) return false;

		// recursive case: 
		for (var option in options) {
			// set the current square to one of the available options
			this.set(row, column, parseInt(option));
			// if that placement leads to success, we're done
			if (recSolve.call(this)) return true;
			// otherwise we need to backtrack
			this.set(row, column, 0);
		}

		// base case: no outcome on this path was successful
		return false;

	}.bind(this));
}

Sudoku.prototype.solve = function() {
	// TODO: Remove invalid placements and optimize solver
	recSolve.call(this);
};

module.exports = Sudoku;