var sudoku = require('./test');

sudoku();

module.exports = {
	createBoard: function(n) {
		return Array.apply(null, Array(n)).map(function() {
			return Array.apply(null, Array(n)).map(function() {
				return 0;
			});
		});
	}
};