var helpers = require('./helpers');
var SudokuState = require('./state');

var Sudoku = function() {
	if (helpers.isValidNumericalInput.call(this, arguments[0])) {
		this.n = arguments[0];
	} else if (helpers.isValidMatrixInput.call(this, arguments[0])) {
		this.n = arguments[0].length;
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
	if (Array.isArray(arguments[0])) {
		arguments[0].forEach(function(row, rowIndex) {
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

function recSolve() {
	if (this.remainingMoves === 0) return true;
	// find the most constrained tile (fewest options and isn't set)

	return getMostConstrained.call(this, function(row, column, options) {
		if (options === undefined) {
			return false;
		}

		for (var option in options) {
			// otherwise place it and recurse
			this.set(row, column, parseInt(option));
			// if we succeed we're done
			if (recSolve.call(this)) return true;
			// otherwise we need to backtrack
			this.set(row, column, 0);
		}

		return false;

	}.bind(this));
}

Sudoku.prototype.solve = function() {
	// helpers.removeInvalidPlacements.call(this);
	recSolve.call(this);
};

module.exports = Sudoku;