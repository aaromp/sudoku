var resetCurrent = function() {
	this.current.rowCount = 0;
	this.current.columnCount = 0;
	this.current.sectionCount = 0;
	this.current.rowSet = {};
	this.current.columnSet = {};
	this.current.sectionSet = {};
};

// 0, 0 => 0
// 0, 1 => 1
// 0, 2 => 2
// 1, 0 => 3
// 1, 1 => 4
// 1, 2 => 5
// 2, 0 => 6
// 2, 1 => 7
// 2, 2 => 8

// row = (index / sqrt) * sqrt
// col = (index % sqrt) * sqrt
// var section = row + (col / sqrt); // get the index of the section

var validate = function(sectionRowOrigin, sectionColumnOrigin, row, column) {
	resetCurrent.call(this);

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

		sectionRow = sectionRowOrigin + (index % this.sqrt);
		sectionColumn = sectionColumnOrigin + (Math.floor(index / this.sqrt));
		if (this.board[sectionRow][sectionColumn] !== 0) {
			this.current.sectionCount++;
			this.current.sectionSet[this.board[sectionRow][sectionColumn]] = true;
		}
	}

	return (Object.keys(this.current.rowSet).length === this.current.rowCount &&
			Object.keys(this.current.columnSet).length === this.current.columnCount &&
			Object.keys(this.current.sectionSet).length === this.current.sectionCount);
};

var validatePlacement = function(row, column) {
	var sectionRowOrigin = Math.floor(row / this.sqrt);
	var sectionColumnOrigin = Math.floor(column / this.sqrt);

	return validate.call(this, sectionRowOrigin, sectionColumnOrigin, row, column);
};

var validateIndex = function(section) {
	var sectionRowOrigin = Math.floor(section / this.sqrt) * this.sqrt;
	var sectionColumnOrigin = (section % this.sqrt) * this.sqrt;
	return validate.call(this, sectionRowOrigin, sectionColumnOrigin, section, section);
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
		validatePlacement.call(this, row-1, column-1);
	},
	validateBoard: function() {
		return this.board.every(function(row, index) {
			return validateIndex.call(this, index);
		}.bind(this));
	}
};
