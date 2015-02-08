var resetCurrent = function() {
	this.current.rowCount = 0;
	this.current.columnCount = 0;
	this.current.sectionCount = 0;
	this.current.rowSet = {};
	this.current.columnSet = {};
	this.current.sectionSet = {};
};

var updateSets = function(row, column) {
	resetCurrent.call(this);

	var sqrt = Math.sqrt(this.n);
	var sectionRowOrigin = Math.floor(row / sqrt);
	var sectionColumnOrigin = Math.floor(column / sqrt);
	var sectionRow, sectionColumn;

	for (var index = 0; index < this.n; index++) {
		if (this.board[row][index] !== 0) {
			this.current.rowCount++;
			this.current.rowSet[this.board[row][index]] = true;
		}

		if (this.board[index][column] !== 0) {
			this.current.columnCount++;
			this.current.columnSet[this.board[index][column]] = true;
		}

		sectionRow = sectionRowOrigin + (index % sqrt);
		sectionColumn = sectionColumnOrigin + (Math.floor(index / sqrt));
		if (this.board[sectionRow][sectionColumn] !== 0) {
			this.current.sectionCount++;
			this.current.sectionSet[this.board[sectionRow][sectionColumn]] = true;
		}
	}
};

module.exports = {
	createBoard: function(n) {
		return Array.apply(null, Array(n)).map(function() {
			return Array.apply(null, Array(n)).map(function() {
				return 0;
			});
		});
	},
	setCell: function(row, column, value) {
		this.board[row-1][column-1] = value;
		updateSets.call(this, row-1, column-1);
	},
	clearCell: function(row, column) {
		this.board[row-1][column-1] = 0;
		updateSets.call(this, row-1, column-1);
	},
	validate: function() {
		
	}
};
