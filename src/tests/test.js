var should = require('should');

var Sudoku = require('../js/main');
var helpers = require('../js/helpers');

var start = [
	[5, 3, 0, 0, 7, 0, 0, 0, 0],
	[6, 0, 0, 1, 9, 5, 0, 0, 0],
	[0, 9, 8, 0, 0, 0, 0, 6, 0],
	[8, 0, 0, 0, 6, 0, 0, 0, 3],
	[4, 0, 0, 8, 0, 3, 0, 0, 1],
	[7, 0, 0, 0, 2, 0, 0, 0, 6],
	[0, 6, 0, 0, 0, 0, 2, 8, 0],
	[0, 0, 0, 4, 1, 9, 0, 0, 5],
	[0, 0, 0, 0, 8, 0, 0, 7, 9]
];

var end = [
	[5, 3, 4, 6, 7, 8, 9, 1, 2],
	[6, 7, 2, 1, 9, 5, 3, 4, 8],
	[1, 9, 8, 3, 4, 2, 5, 6, 7],
	[8, 5, 9, 7, 6, 1, 4, 2, 3],
	[4, 2, 6, 8, 5, 3, 7, 9, 1],
	[7, 1, 3, 9, 2, 4, 8, 5, 6],
	[9, 6, 1, 5, 3, 7, 2, 8, 4],
	[2, 8, 7, 4, 1, 9, 6, 3, 5],
	[3, 4, 5, 2, 8, 6, 1, 7, 9]
];

describe('Sudoku', function(){
	describe('board', function(){
		var testDimensions = function(n) {
			var sudoku;

			if (helpers.isPerfectSquare(n)) {
				sudoku = new Sudoku(n);

				it('should have ' + n + ' rows', function() {
	  		  sudoku.board.should.have.a.lengthOf(n);
	  		});

	  		it('should have ' + n + ' columns', function() {
	  		  var hasNColumns = (sudoku.board.length > 0 && sudoku.board.every(function(row) {
	  		  	return row.length === n;
	  		  }));
	
	  		  hasNColumns.should.be.true;
	  		});

	  		it('should have the correct options matrix', function() {
	  			sudoku.options.should.have.a.lengthOf(sudoku.n);

	  			var hasNColumns = (sudoku.options.length > 0 && sudoku.options.every(function(row) {
	  		  		return row.length === sudoku.n;
	  		  	}));
		
	  		  	hasNColumns.should.be.true;

	  		  	var hasCorrectOptions = sudoku.options.every(function(row, rowIndex) {
	  		  		return row.every(function(options, columnIndex) {
	  		  			return Object.keys(options).length === sudoku.n;
	  		  		});
	  		  	});

	  		  	hasCorrectOptions.should.be.true;
	  		});
			} else {
				it('should throw an error', function() {
	  		  (function() { new Sudoku(n) }).should.throw();
	  		});
			}
		};

		describe('of fixed size', testDimensions.bind(null, 9));
		describe('of inappropriate size', testDimensions.bind(null, 3));
		var random = Math.floor(Math.random() * 7) + 2;
		describe('of arbitrary size', testDimensions.bind(null, random * random));

		describe('from matrix input', function() {
			it('should copy correctly', function() {
				var sudoku = new Sudoku(start);
				var matches = (sudoku.board.length > 0 && sudoku.board.every(function(row, rowIndex) {
					return row.every(function(value, columnIndex) {
						return value === start[rowIndex][columnIndex];
					});
				}));

				matches.should.be.true;

				var placedCount = sudoku.board.reduce(function(count, row) {
					row.forEach(function(entry) {
						if (entry !== 0) count++;
					});

					return count;
				}, 0);

				sudoku.remainingMoves.should.equal((sudoku.n * sudoku.n) - placedCount);
			});

			it('should throw an error if input is invalid', function() {
				(function() { new Sudoku([5, 3, 0, 0, 7, 0, 0, 0, 0]) }).should.throw();
			});
		});

		var sudoku = new Sudoku(9);

		it('should initially be empty', function() {
			var empty = (sudoku.board.length > 0 && sudoku.board.every(function(row) {
				return row.every(function(entry) {
					return entry === 0;
				});
			}));

			empty.should.be.true;

			sudoku.remainingMoves.should.equal(sudoku.n*sudoku.n);
		});

		it('should be settable', function() {
			var row = Math.floor(sudoku.board.length * Math.random());
			var column = Math.floor(sudoku.board.length * Math.random());
			var value = Math.floor(sudoku.board.length * Math.random());

			sudoku.setCell(row, column, value);

			sudoku.board[row][column].should.equal(value);
		});

		it('should be clearable', function() {
			var row = Math.floor(sudoku.board.length * Math.random());
			var column = Math.floor(sudoku.board.length * Math.random());
			var value = 1 + Math.floor((sudoku.board.length-1) * Math.random());

			sudoku.setCell(row, column, value);
			sudoku.board[row][column].should.not.equal(0);

			sudoku.clearCell(row, column);
			sudoku.board[row][column].should.equal(0);
		});

	});

	describe('validation', function(){

		describe('background', function() {
			it('should validate placement (complete)', function() {
				var sudoku = new Sudoku(end);
				var row = 1;
				var column = 1;
				sudoku.setCell(row, column, sudoku.board[row][column]);
	
				sudoku.current.row.count.should.equal(9);
				sudoku.current.column.count.should.equal(9);
				sudoku.current.section.count.should.equal(9);
	
				sudoku.current.row.isValid().should.be.true;
				sudoku.current.column.isValid().should.be.true;
				sudoku.current.section.isValid().should.be.true;
			});

			it('should validate placement (incomplete)', function() {
				var sudoku = new Sudoku(start);
				var row = 0;
				var column = 0;
				var value = sudoku.board[row][column];
				sudoku.clearCell(row, column);
				sudoku.setCell(row, column, value);
	
				sudoku.current.row.count.should.equal(3);
				sudoku.current.column.count.should.equal(5);
				sudoku.current.section.count.should.equal(5);
	
				sudoku.current.row.isValid().should.be.true;
				sudoku.current.column.isValid().should.be.true;
				sudoku.current.section.isValid().should.be.true;
			});

		});

		describe('for entire board', function() {

			it('should recorgnize a valid board', function() {
				var sudoku = new Sudoku(start);
				sudoku.validateBoard().should.be.true;
			});

			it('should recognize an invalid board', function() {
				var sudoku = new Sudoku(end);
				var row = 1;
				var column = 1;
				sudoku.remainingMoves = 0;
				sudoku.setCell(row, column, sudoku.board[row][column] + 1);
				sudoku.validateBoard().should.be.false;
			});

		});

	});

	describe('tracking', function() {
		var optionsAreEmpty = function(sudoku) {
			return sudoku.options.every(function(row) {
				return row.every(function(options) {
					return (Object.keys(options).length === sudoku.n);
				});
			});
		};

		var missingOption = function(sudoku, row, column, value) {
			var result = true;
			var changedOption = sudoku.options[row][column];
			for (var i = 0; i <= sudoku.length; i++) {
				if (i === 0 || i === value) {
					if (changedOption[i]) result = false;
				} else {
					if (!changedOption[i]) result = false;
				}
			}

			return result;
		};

		it('should show correct number of available moves', function() {
			var sudoku = new Sudoku(9);
			var initialized = optionsAreEmpty(sudoku);

			initialized.should.be.true;

			var row = 0;
			var column = 0;
			var changedOption = sudoku.options[row][column];
			var value;

			// adding
			sudoku.setCell(row, column, value);
			value = 8;
			var added = missingOption(sudoku, row, column, value);
			added.should.be.true;

			// overwriting
			var past = value;
			value = 4;
			sudoku.setCell(row, column, value);
			var overwritten = missingOption(sudoku, row, column, value);
			overwritten.should.be.true;

			// no change
			sudoku.setCell(row, column, value);
			var unchanged = missingOption(sudoku, row, column, value);
			unchanged.should.be.true;

			// earasing
			sudoku.setCell(row, column, 0);
			var erased = optionsAreEmpty(sudoku);
			erased.should.be.true;
		});

	});
	
});
