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
    	  (sudokuber.board.length > 0 && sudokuber.board.every(function(row) {
    	  	return row.length === n;
    	  })).should.be.true;
    	});
  	};

  	describe('of fixed size', testDimensions.bind(null, 9));
  	describe('of arbitrary size', testDimensions.bind(null, Math.ceil(Math.random() * 9)));
  });  
});
