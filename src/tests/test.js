var should = require('should');

var Sudoku = require('../js/main');
var SudokuSet = require('../js/set');
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


// from http://www.telegraph.co.uk/news/science/science-news/9359579/Worlds-hardest-sudoku-can-you-crack-it.html
var hard = [
	[8, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 3, 6, 0, 0, 0, 0, 0],
	[0, 7, 0, 0, 9, 0, 2, 0, 0],
	[0, 5, 0, 0, 0, 7, 0, 0, 0],
	[0, 0, 0, 0, 4, 5, 7, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 3, 0],
	[0, 0, 1, 0, 0, 0, 0, 6, 8],
	[0, 0, 8, 5, 0, 0, 0, 1, 0],
	[0, 9, 0, 0, 0, 0, 4, 0, 0]
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
	
	  			it('should correctly initialize state', function() {
	  				sudoku.should.have.property('state');
	  				sudoku.state.rows.should.have.a.lengthOf(sudoku.n);
	  				sudoku.state.columns.should.have.a.lengthOf(sudoku.n);
	  				sudoku.state.sections.should.have.a.lengthOf(sudoku.n);

	  				sudoku.state.rows.forEach(function(element) {
	  					(element instanceof SudokuSet).should.be.true;
	  				});

	  				sudoku.state.columns.forEach(function(element) {
	  					(element instanceof SudokuSet).should.be.true;
	  				});

	  				sudoku.state.sections.forEach(function(element) {
	  					(element instanceof SudokuSet).should.be.true;
	  				});
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

			sudoku.set(row, column, value);

			sudoku.board[row][column].should.equal(value);
		});

		it('should be clearable', function() {
			var row = Math.floor(sudoku.board.length * Math.random());
			var column = Math.floor(sudoku.board.length * Math.random());
			var value = 1 + Math.floor((sudoku.board.length-1) * Math.random());

			sudoku.set(row, column, value);
			sudoku.board[row][column].should.not.equal(0);

			sudoku.set(row, column, 0);
			sudoku.board[row][column].should.equal(0);
		});

	});

	describe('validation', function(){

		describe('background', function() {
			it('should validate placement (complete)', function() {
				var sudoku = new Sudoku(end);
				sudoku.state.hasConflict().should.be.false;
			});

			it('should validate placement (incomplete)', function() {
				var sudoku = new Sudoku(start);
				var row = 0;
				var column = 0;

				sudoku.state.hasConflictAt(row, column).should.be.false;
			});

		});

		describe('for entire board', function() {

			it('should recorgnize a valid board', function() {
				var sudoku = new Sudoku(start);
				sudoku.state.hasConflict().should.be.false;
			});

			it('should recognize an invalid board', function() {
				var sudoku = new Sudoku(end);
				var row = 1;
				var column = 1;
				var value = sudoku.board[row][column] + 1;
				sudoku.set(row, column, value);
				sudoku.state.hasConflict().should.be.true;
			});

		});

	});

	describe('tracking', function() {
		var missingOption = function(sudoku, row, column, value, options) {
			var result = true;
			var sqrt = Math.sqrt(sudoku.n);
			var section = (Math.floor(row / sqrt) * sqrt) + (Math.floor(column / sqrt) % sqrt);

			for (var i = 1; i <= sudoku.n; i++) {
				if (options[i]) {
					if (sudoku.state.rows[row].set[i] !== 1) result = false;
					if (sudoku.state.columns[column].set[i] !== 1) result = false;
					if (sudoku.state.sections[section].set[i] !== 1) result = false;
				} else {
					if (sudoku.state.rows[row].set[i] !== 0) result = false;
					if (sudoku.state.columns[column].set[i] !== 0) result = false;
					if (sudoku.state.sections[section].set[i] !== 0) result = false;
				}
			}

			return result;
		};

		it('should show correct number of available moves', function() {
			var sudoku = new Sudoku(9);

			var row = Math.floor(Math.random() * 9);
			var column = Math.floor(Math.random() * 9);
			var value;

			// adding
			value = 8;
			sudoku.set(row, column, value);
			var added = missingOption(sudoku, row, column, value, {8: true});
			added.should.be.true;

			// overwriting
			value = 4;
			sudoku.set(row, column, value);
			var overwritten = missingOption(sudoku, row, column, value, {4: true});
			overwritten.should.be.true;

			// no change
			sudoku.set(row, column, value);
			var unchanged = missingOption(sudoku, row, column, value, {4: true});
			unchanged.should.be.true;

			// // erasing
			value = 0;
			sudoku.set(row, column, value);
			var erased = missingOption(sudoku, row, column, value, {});
			erased.should.be.true;
		});

		var options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		it('should show up correctly on start board', function() {
			
			var sudoku = new Sudoku(start);
			
			options.every(function(option) {
				if (option === 2 || option === 6) {
					return sudoku.state.available(0, 3, option);
				} else {
					return !sudoku.state.available(0, 3, option);
				}
			}).should.be.true;

			sudoku.set(0, 8, 2);

			options.every(function(option) {
				return (option === 6) ? sudoku.state.available(0, 3, option) : 
										!sudoku.state.available(0, 3, option);
			}).should.be.true;

			options.every(function(option) {
				return (option === 3 || option === 4) ? sudoku.state.available(1, 7, option) : 
														!sudoku.state.available(1, 7, option);
			}).should.be.true;

			options.every(function(option) {
				return (option === 3) ? sudoku.state.available(7, 7, option) : 
										!sudoku.state.available(7, 7, option);
			}).should.be.true;
		});

		it('should show up as empty on completed board', function() {
			var sudoku = new Sudoku(end);
			options.every(function(row) {
				return options.every(function(column) {
					return options.every(function(option) {
						return !sudoku.state.available(row-1, column-1, option);
					});
				});
			}).should.be.true;
		});
	});
	
	describe('solver', function() {
		it('should handle the wikipedia example', function() {
			var sudoku = new Sudoku(start);
			sudoku.solve();

			var solved = (sudoku.board.length > 0 && sudoku.board.every(function(row, rowIndex) {
				return row.every(function(entry, columnIndex) {
					return sudoku.board[rowIndex][columnIndex] === end[rowIndex][columnIndex];
				});
			}));
			solved.should.be.true;
		});

		it('should handle the worlds hardest sudoku board', function() {
			this.timeout(50000);
			var sudoku = new Sudoku(hard);
			sudoku.solve();

			var unchanged = true;
			hard.forEach(function(row, rowIndex) {
				row.forEach(function(value, columnIndex) {
					if (value !== 0 && sudoku.board[rowIndex][columnIndex] !== value) unchanged = false;
				});
			});

			unchanged.should.be.true;

			var filled = sudoku.board.every(function(row) {
				return row.every(function(entry) {
					return entry !== 0;
				});
			});

			filled.should.be.true;
			sudoku.state.hasConflict().should.be.false;
		});
	});
});
