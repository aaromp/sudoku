module.exports = {
	createBoard: function(n) {
		return Array.apply(null, Array(n)).map(function() {
			return Array.apply(null, Array(n)).map(function() {
				return 0;
			});
		});
	},
	setCell: function() {

	},
	clearCell: function() {

	},
	validateCell: function(row, column) {
		// var rowSet = {};
		// var columnSet = {};
		// var sectorSet = {};

		// for (var index = 1; index <= this.n; index++) {
		// 	if (this.board[])
		// }
		// var counts = row.reduce(function(counts, value) {
		// 	counts[value] = true;
		// 	return counts;
		// }, {});

		// return Object.keys(counts).length === this.n;
	}
};
