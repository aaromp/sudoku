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
		callback.call(this, row, index, this.current.row, 'row');

		// apply callback on column 
		callback.call(this, index, column, this.current.column, 'column');

		// apply callback on section
		sectionRow = rowOrigin + (index % this.sqrt);
		sectionColumn = columnOrigin + (Math.floor(index / this.sqrt));
		callback.call(this, sectionRow, sectionColumn, this.current.section, 'section');
	}
};

var validate = function(rowOrigin, columnOrigin, row, column) {
	resetCurrent.call(this);
	setsForEach.call(this, row, column, rowOrigin, columnOrigin, updateSet);

	return Object.keys(this.current).every(function(set) {
		return this.current[set].isValid();
	}.bind(this));
};

var validateIndex = function(index) {
	var sectionRowOrigin = Math.floor(index / this.sqrt) * this.sqrt;
	var sectionColumnOrigin = (index % this.sqrt) * this.sqrt;
	return validate.call(this, sectionRowOrigin, sectionColumnOrigin, index, index);
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


// var lookAhead = function(row, column, value) {
// 	var available = true;
// 	setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
// 		var options = this.options[row][column];
// 		if (options[value] && Object.keys(options).length === 1) available = false;
// 	});

// 	return available;
// };

var removeOption = function(value, row, column) {
	delete this.options[row][column][value];
};

var addOption = function(previous, row, column) {
	this.options[row][column][previous] = true;
};

module.exports = {
	isPerfectSquare: function(n) {
		this.sqrt = Math.sqrt(n);
		var roundedSqrt = Math.floor(this.sqrt);

		return (this.sqrt * this.sqrt) === (roundedSqrt * roundedSqrt);
	},
	createBoard: function(n) {
		return initializeMatrix.call(this, n, function() {
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
	validatePlacement: function(row, column) {
		var sectionRowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var sectionColumnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	
		return validate.call(this, sectionRowOrigin, sectionColumnOrigin, row, column);
	},
	updateOptions: function(previous, row, column) {
		var value = this.board[row][column];
	
		// not erasing; remove value from options
		var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;

		// if adding
		if (previous === 0 && value !== 0) {
			setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
				delete this.options[row][column][value];
			}.bind(this));
		} 
		// if erasing
		else if (previous !== 0 && value === 0) {
			var options = {};
			for (var i = 1; i <= this.n; i++) {
				options[i] = true;
			}
			setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
				delete options[this.board[row][column]];
			}.bind(this));
			// this.options[row][column] = options;
			console.log(options)
		} 
		// updating
		else if (previous !== value) {
			setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
				delete this.options[row][column][value];
				this.options[row][column][previous] = true;
			}.bind(this));
		}
	},
	removeInvalidPlacements: function() {
		matrixForEach.call(this, this.board, function(value, row, column, matrix) {
			if (this.options[row][column][value]) this.clearCell(row, column);
		}.bind(this));
	},

	findMostConstrained: function(seen) {
		var fewestOptions = this.n + 1;
		var mostConstrained;
	
		var numOptions;
		// matrixForEach.call(this, this.options, function(options, row, column, matrix) {
		// 	numOptions = Object.keys(options).length;
		// 	// must be available and have options but fewer than least found so far
		// 	if (this.board[row][column] === 0 && numOptions > 0 && numOptions < fewestOptions && !seen[[row, column]]) {
		// 		// fewestOptions = numOptions;
		// 		mostConstrained = [row, column];
		// 	}
		// }.bind(this));

		for (var i = 0; i < this.board.length; i++) {
			for (var j = 0; j < this.board[i].length; j++) {
				numOptions = Object.keys(this.options[i][j]).length;
				if (this.board[i][j] === 0 && numOptions > 0 && numOptions < fewestOptions && !seen[[i, j]]) {
					fewestOptions = numOptions;
					mostConstrained = [i, j];
					seen[mostConstrained] = true;
					// return mostConstrained;
				}
			}
		}
		return mostConstrained;
	},

	lookAhead: function(row, column, value) {
		var available = true;
		var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
		var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			var options = this.options[row][column];
			if (options[value] && Object.keys(options).length === 1) available = false;
		});
	
		return available;
	},

	validateBoard: function() {
		return this.board.every(function(row, index) {
			return validateIndex.call(this, index);
		}.bind(this));
	}
};
