var should = require('should');

var Sudokuber = require('../js/main');

describe('Sudokuber', function(){
  describe('board', function(){
  	var testDimensions = function(n) {
  		var sudokuber = new Sudokuber(n);

  		it('should have ' + n + ' rows', function(){
    	  sudokuber.board.should.have.a.lengthOf(n);
    	});
	
    	it('should have ' + n + ' columns', function(){
    	  var hasNColumns = (sudokuber.board.length > 0 && sudokuber.board.every(function(row) {
    	  	return row.length === n;
    	  }));

    	  hasNColumns.should.be.true;
    	});
  	};

  	describe('of fixed size', testDimensions.bind(null, 9));
  	describe('of arbitrary size', testDimensions.bind(null, Math.ceil(Math.random() * 9)));

  	var sudokuber = new Sudokuber(9);
  	
  	it('should initially be empty', function() {
  		var empty = (sudokuber.board.length > 0 && sudokuber.board.every(function(row) {
  			return row.every(function(entry) {
  				return entry === 0;
  			});
  		}));

  		empty.should.be.true;
  	});

  	it('should be settable', function() {
  		var row = Math.ceil(sudokuber.board.length * Math.random());
  		var column = Math.ceil(sudokuber.board.length * Math.random());
  		var value = Math.ceil(sudokuber.board.length * Math.random());

  		sudokuber.setCell(row, column, value);

  		sudokuber.board[row][column].should.equal(value);
  	});

  	it('should be clearable', function() {
  		var row = Math.ceil(sudokuber.board.length * Math.random());
  		var column = Math.ceil(sudokuber.board.length * Math.random());
  		var value = Math.ceil(sudokuber.board.length * Math.random());

  		sudokuber.setCell(row, column, value);
  		sudokuber.board[row][column].should.not.equal(0);

  		sudokuber.clearCell(row, column);
  		sudokuber.board[row][column].should.equal(0);
  	});

  });

  describe('validate', function(){

  });
});
