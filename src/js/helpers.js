module.exports = {
	createBoard: function(n) {
		return Array.apply(null, Array(n)).map(function() {
			return Array.apply(null, Array(n)).map(function() {
				return 0;
			});
		});
	},
	validateCell: function(row) {
		var counts = row.reduce(function(counts, value) {
			counts[value] = true;
			return counts;
		}, {});

		return Object.keys(counts).length === this.n;
	}
};
