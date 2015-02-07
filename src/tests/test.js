var should = require('should');

var sudoku = require('../js/main');

describe('Sudokuber', function(){
  describe('board', function(){
  	var testSize = function(n) {
  		var board = sudoku.createBoard(n);

  		it('should have ' + n + ' rows', function(){
    	  board.should.have.a.lengthOf(n);
    	});
	
    	it('should have ' + n + ' columns', function(){
    	  (board.length > 0 && board.every(function(row) {
    	  	console.log(n, row.length);
    	  	return row.length === n;
    	  })).should.be.true;
    	});
  	};

  	var n = 9;
  	describe('of fixed size', testSize.bind(this, n));

  	n = Math.ceil(Math.random() * 9);
  	describe('of arbitrary size', testSize.bind(this, n));

  });  
});
