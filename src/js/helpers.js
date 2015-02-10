var resetCurrent = function() {
	Object.keys(this.current).forEach(function(set) {
		this.current[set].empty();
	}.bind(this));
};

var updateSet = function(row, column, set) {
	var value = this.board[row][column];
	set.insert(value);
};

var setsForEach = function(row, column, rowOrigin, columnOrigin, callback) {
	var sectionRow, sectionColumn;

	for (var index = 0; index < this.n; index++) {
		// apply callback on row
		callback.call(this, row, index, this.current.row);

		// apply callback on column 
		callback.call(this, index, column, this.current.column);

		// apply callback on section
		sectionRow = rowOrigin + (index % this.sqrt);
		sectionColumn = columnOrigin + (Math.floor(index / this.sqrt));
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

var addOption = function(previous, row, column) {
	this.options[row][column][previous] = true;
};

var updateOption = function(previous, row, column) {
	var value = this.board[row][column];
	
	// TODO: refactor so there's only one call to setsForEach
	// not erasing; remove value from options
	var rowOrigin = Math.floor(row / this.sqrt);
	var columnOrigin = Math.floor(column / this.sqrt);
	if (previous === 0 || value !== 0) {
		console.log(value === 0);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, removeOption.bind(this, value));
	}
	
	// not adding; add previous to options
	if (previous !== 0 || value === 0) {
		console.log(previous === 0);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, addOption.bind(this, previous));
	}
};

// var removeInvalidPlacements = function() {
// 	matrixForEach.call(this.board, function(value, row, column, matrix) {
// 		if (this.options[row][column][value]) this.clearCell(row, column);
// 	}.bind(this));
// };

// var findMostConstrained = function() {
// 	var leastOptions = this.n;
// 	var mostConstrained = [0, 0];

// 	var numOptions;
// 	matrixForEach.call(this.board, function(value, row, column, matrix) {
// 		numOptions = Object.keys(this.options[row][column]).length;
// 		if (value !== 0 && numOptions < leastOptions) {
// 			leastOptions = numOptions;
// 			mostConstrained[0] = row;
// 			mostConstrained[1] = column;
// 		}
// 	}.bind(this));

// 	return mostConstrained;
// };

// var lookAhead = function(row, column) {

// };

// var lookAhead = function(row, column, value) {
// 	var available = true;
// 	setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
// 		var options = this.options[row][column];
// 		if (options[value] && Object.keys(options).length === 1) available = false;
// 	});

// 	return available;
// };

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
	// setCell: function(row, column, value) {
	// 	this.board[row][column] = value;
	// 	// validatePlacement.call(this, row, column);
	// },
	validatePlacement: function(row, column) {
		var sectionRowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var sectionColumnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	
		return validate.call(this, sectionRowOrigin, sectionColumnOrigin, row, column);
	},
	updateOptions: function(previous, row, column) {
		var value = this.board[row][column];
	
		// TODO: refactor so there's only one call to setsForEach
		// not erasing; remove value from options
		var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
		console.log(previous, row, column, rowOrigin, columnOrigin);
		if (previous === 0 || value !== 0) {
			setsForEach.call(this, row, column, rowOrigin, columnOrigin, removeOption.bind(this, value));
		}
		
		// not adding; add previous to options
		if (previous !== 0 || value === 0) {
			setsForEach.call(this, row, column, rowOrigin, columnOrigin, addOption.bind(this, previous));
		}
	},
	removeInvalidPlacements: function() {
		matrixForEach.call(this, this.board, function(value, row, column, matrix) {
			if (this.options[row][column][value]) this.clearCell(row, column);
		}.bind(this));
	},

	findMostConstrained: function() {
		var leastOptions = this.n + 1;
		var mostConstrained;
	
		var numOptions;
		matrixForEach.call(this, this.options, function(options, row, column, matrix) {
			numOptions = Object.keys(options).length;
			// must be available and have options but fewer than least found so far
			if (this.board[row][column] === 0 && numOptions > 0 && numOptions < leastOptions) {
				leastOptions = numOptions;
				mostConstrained = [row, column];
				console.log('most constrained', options);
			}
		}.bind(this));
	
		return mostConstrained;
	},

	lookAhead: function(row, column, value) {
		var available = true;
		var rowOrigin = Math.floor(row / this.sqrt);
		var columnOrigin = Math.floor(column / this.sqrt);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			var options = this.options[row][column];
			if (options[value] && Object.keys(options).length === 1) available = false;
		});
	
		console.log('look ahead available?', available);
		return available;
	},

	validateBoard: function() {
		return this.board.every(function(row, index) {
			return validateIndex.call(this, index);
		}.bind(this));
	}
};
