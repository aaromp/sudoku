var should = require('should');

var Sudoku = require('../js/main');
var helpers = require('../js/helpers');

describe('Sudoku', function(){
  describe('board', function(){
  	var testDimensions = function(n) {
  		var sudoku = new Sudoku(n);

  		it('should have ' + n + ' rows', function(){
    	  sudoku.board.should.have.a.lengthOf(n);
    	});
	
    	it('should have ' + n + ' columns', function(){
    	  var hasNColumns = (sudoku.board.length > 0 && sudoku.board.every(function(row) {
    	  	return row.length === n;
    	  }));

    	  hasNColumns.should.be.true;
    	});
  	};

  	describe('of fixed size', testDimensions.bind(null, 9));
  	describe('of arbitrary size', testDimensions.bind(null, Math.ceil(Math.random() * 9)));

  	var sudoku = new Sudoku(9);

  	it('should initially be empty', function() {
  		var empty = (sudoku.board.length > 0 && sudoku.board.every(function(row) {
  			return row.every(function(entry) {
  				return entry === 0;
  			});
  		}));

  		empty.should.be.true;
  	});

  	it('should be settable', function() {
  		var row = Math.ceil(sudoku.board.length * Math.random());
  		var column = Math.ceil(sudoku.board.length * Math.random());
  		var value = Math.ceil(sudoku.board.length * Math.random());

  		sudoku.setCell(row, column, value);

  		sudoku.board[row-1][column-1].should.equal(value);
  	});

  	it('should be clearable', function() {
  		var row = Math.ceil(sudoku.board.length * Math.random());
  		var column = Math.ceil(sudoku.board.length * Math.random());
  		var value = Math.ceil(sudoku.board.length * Math.random());

  		sudoku.setCell(row, column, value);
  		sudoku.board[row-1][column-1].should.not.equal(0);

  		sudoku.clearCell(row, column);
  		sudoku.board[row-1][column-1].should.equal(0);
  	});

  });

  describe('validation', function(){
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

  	var sudoku = new Sudoku(9);
  	describe('background', function() {
  		it('should update sets', function() {
  			sudoku.board = end;
  			var row = 1;
  			var column = 1;
  			sudoku.setCell(row, column, sudoku.board[row-1][column-1]);
	
  			sudoku.current.rowCount.should.equal(9);
  			sudoku.current.columnCount.should.equal(9);
  			sudoku.current.sectionCount.should.equal(9);
	
  			Object.keys(sudoku.current.rowSet).length.should.equal(sudoku.current.rowCount);
  			Object.keys(sudoku.current.columnSet).length.should.equal(sudoku.current.columnCount);
  			Object.keys(sudoku.current.sectionSet).length.should.equal(sudoku.current.sectionCount);
  		});

  		it('should update sets', function() {
  			sudoku.board = start;
  			var row = 1;
  			var column = 1;
  			sudoku.setCell(row, column, sudoku.board[row-1][column-1]);
	
  			sudoku.current.rowCount.should.equal(3);
  			sudoku.current.columnCount.should.equal(5);
  			sudoku.current.sectionCount.should.equal(5);
	
  			Object.keys(sudoku.current.rowSet).length.should.equal(sudoku.current.rowCount);
  			Object.keys(sudoku.current.columnSet).length.should.equal(sudoku.current.columnCount);
  			Object.keys(sudoku.current.sectionSet).length.should.equal(sudoku.current.sectionCount);
  		});
  	});

	describe('for entire board', function() {
  		it('should recorgnize a valid board', function() {
  			sudoku.board = end;
  			sudoku.validateBoard().should.be.true;
  		});

  		it('should recognize an invalid board', function() {
  			sudoku.board = end;
  			var row = 1;
  			var column = 1;
  			sudoku.remaining = 0;
  			sudoku.setCell(row, column, sudoku.board[row-1][column-1] + 1);
	
  			sudoku.validateBoard().should.be.false;
  		});
  	});
  	
  	xit('should validate incomplete rows', function() {
  		var row = Math.ceil(sudoku.board.length * Math.random());
  		sudoku.validateRow(row).should.be.true;
  	});

  	xit('should validate incomplete columns', function() {
  		var column = Math.ceil(sudoku.board.length * Math.random());
  		sudoku.validateColumn(column).should.be.true;
  	});

  	xit('should validate incomplete sections', function() {
  		var row = Math.ceil(sudoku.board.length * Math.random());
  		var column = Math.ceil(sudoku.board.length * Math.random());
  		sudoku.validateSection(row, column).should.be.true;
  	});

  });
});
