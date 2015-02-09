var resetCurrent = function() {
	Object.keys(this.current).forEach(function(set) {
		this.current[set].empty();
	}.bind(this));
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

var updateSet = function(row, column, set) {
	var value = this.board[row][column];
	set.insert(value);
};

var setsForEach = function(row, column, rowOrigin, columnOrigin, callback) {
	var sectionRow, sectionColumn;

	// console.log(rowOrigin, columnOrigin);
	for (var index = 0; index < this.n; index++) {
		callback.call(this, row, index, this.current.row);
		callback.call(this, index, column, this.current.column);

		sectionRow = rowOrigin + (index % this.sqrt);
		sectionColumn = columnOrigin + (Math.floor(index / this.sqrt));
		// console.log(rowOrigin, sectionRow, columnOrigin, sectionColumn);
		callback.call(this, sectionRow, sectionColumn, this.current.section);
	}
};

var validate = function(rowOrigin, columnOrigin, row, column) {
	resetCurrent.call(this);
	setsForEach.call(this, row, column, rowOrigin, columnOrigin, updateSet);

	return Object.keys(this.current).every(function(set) {
		return this.current[set].isValid();
	}.bind(this));
};

// var validate = function(sectionRowOrigin, sectionColumnOrigin, row, column) {
// 	resetCurrent.call(this);

// 	var sectionRow, sectionColumn;
// 	for (var index = 0; index < this.n; index++) {
// 		if (this.board[row][index] !== 0) {
// 			this.current.rowCount++;
// 			this.current.rowSet[this.board[row][index]] = true;
// 		}

// 		if (this.board[index][column] !== 0) {
// 			this.current.columnCount++;
// 			this.current.columnSet[this.board[index][column]] = true;
// 		}

// 		sectionRow = sectionRowOrigin + (index % this.sqrt);
// 		sectionColumn = sectionColumnOrigin + (Math.floor(index / this.sqrt));
// 		if (this.board[sectionRow][sectionColumn] !== 0) {
// 			this.current.sectionCount++;
// 			this.current.sectionSet[this.board[sectionRow][sectionColumn]] = true;
// 		}
// 	}

// 	return (Object.keys(this.current.rowSet).length === this.current.rowCount &&
// 			Object.keys(this.current.columnSet).length === this.current.columnCount &&
// 			Object.keys(this.current.sectionSet).length === this.current.sectionCount);
// };

// var validatePlacement = function(row, column) {
// 	var sectionRowOrigin = Math.floor(row / this.sqrt);
// 	var sectionColumnOrigin = Math.floor(column / this.sqrt);

// 	return validate.call(this, sectionRowOrigin, sectionColumnOrigin, row, column);
// };

var validateIndex = function(section) {
	var sectionRowOrigin = Math.floor(section / this.sqrt) * this.sqrt;
	var sectionColumnOrigin = (section % this.sqrt) * this.sqrt;
	return validate.call(this, sectionRowOrigin, sectionColumnOrigin, section, section);
};

var initializeMatrix = function(n, callback) {
	return Array.apply(null, Array(n)).map(function(row, rowIndex) {
		return Array.apply(null, Array(n)).map(function(column, columnIndex) {
			return callback.call(this, rowIndex, columnIndex);
		}.bind(this));
	}.bind(this));
};

var matrixForEach = function(matrix, callback) {
	matrix.forEach(function(row, rowIndex) {
		row.forEach(function(value, columnIndex) {
			callback.call(this, value, rowIndex, columnIndex, matrix);
		}.bind(this));
	}.bind(this));
};

// var getIntersection = function() {
// 	// if there are no elements the intersection is the empty set
// 	if (arguments[0] === undefined) return {};

// 	// initialize the intersection to be the first set
// 	var intersection = JSON.parse(JSON.stringify(arguments[0]));

// 	// iterate through each set and remove items that aren't shared
// 	for (var index = 1; index < arguments.length; index++) {
// 		for (var key in arguments[i]) {
// 			if (intersection[key] && arguments[i][key] !== intersection[key]) {
// 				delete intersection[key];
// 			}
// 		}
// 	}

// 	return intersection;
// };

var removeOption = function(value, row, column) {
	delete this.options[row][column][value];
};

var addOption = function(value, row, column) {
	this.options[row][column][value] = true;
};

var updateOption = function(value, row, column) {
	var previous = this.board[row][column];

	// no change so we're done
	if (previous === value) return;

	// TODO: refactor so there's only one call to setsForEach
	// not erasing; remove value from options
	var rowOrigin = Math.floor(row / this.sqrt);
	var columnOrigin = Math.floor(column / this.sqrt);
	if (previous === 0 || value !== 0) {
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, removeOption.bind(this, value));
	}

	// not adding; add previous to options
	if (previous !== 0 || value === 0) {
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, addOption.bind(this, value));
	}

	// update board
	this.setCell(rowIndex, column, value);
};

module.exports = {
	isPerfectSquare: function(n) {
		this.sqrt = Math.sqrt(n);
		var roundedSqrt = Math.floor(this.sqrt);

		return (this.sqrt * this.sqrt) === (roundedSqrt * roundedSqrt);
	},
	createBoard: function() {
		this.remainingMoves = this.n * this.n;
		return initializeMatrix.call(this, this.n, function() {
			return 0;
		}.bind(this));
	},
	initializeOptions: function() {
		return initializeMatrix.call(this, this.n, function() {
			var options = {};
			for (var i = 1; i <= this.n; i++) {
				options[i] = true;
			}
			return options;
		}.bind(this));
	},
	// createBoard: function(n) {
	// 	return Array.apply(null, Array(n)).map(function() {
	// 		return Array.apply(null, Array(n)).map(function() {
	// 			return 0;
	// 		});
	// 	});
	// },
	setCell: function(row, column, value) {
		this.board[row][column] = value;
		// validatePlacement.call(this, row, column);
	},
	validatePlacement: function(row, column) {
		var sectionRowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var sectionColumnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	
		// console.log(sectionRowOrigin, sectionColumnOrigin);
		return validate.call(this, sectionRowOrigin, sectionColumnOrigin, row, column);
	},

	updateOptions: function() {
		matrixForEach(this.board, function(value, rowIndex, columnIndex) {
			
		}.bind(this));
	},
	validateBoard: function() {
		return this.board.every(function(row, index) {
			return validateIndex.call(this, index);
		}.bind(this));
	}
};
