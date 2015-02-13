var isPerfectSquare = function(n) {
	this.sqrt = Math.sqrt(n); // store sqrt on object to avoid recalculating
	var roundedSqrt = Math.floor(this.sqrt);

	return (this.sqrt * this.sqrt) === (roundedSqrt * roundedSqrt);
};

function initializeArray(n, callback) {
	return Array.apply(null, Array(n)).map(function(value, index) {
		return callback.call(this, value, index);
	}.bind(this));
}

function initializeSet(n, callback) {
	var options = {};
	for (var index = 1; index <= n; index++) {
		options[index] = callback(index);
	}

	return options;
}

module.exports = {
	isValidNumericalInput: function(input) {
		// if input isn't a number or is less than one input isn't valid
		if (typeof input !== 'number' || input <= 1) return false;

		return isPerfectSquare.call(this, input);
	},
	isValidMatrixInput: function(input) {
		if (!Array.isArray(input) || input.length <= 1) return false; 

		// matrix must be an n x n matrix
		if (input.some(function(row) {
			return !Array.isArray(row) || row.length !== input.length;
		})) return false;
		
		return isPerfectSquare.call(this, input.length);
	},
	initializeArray: function(n, callback) {
		return initializeArray.call(this, n, callback);
	},
	initializeMatrix: function(n, callback) {
		return initializeArray.call(this, n, function(row, rowIndex) {
			return initializeArray.call(this, n, function(column, columnIndex) {
				return callback.call(this, rowIndex, columnIndex);
			});
		});
	},
	initializeOptions: function(n) {
		return initializeSet(n, function() {
			return true;
		});
	},
	initializeCounts: function(n) {
		return initializeSet(n, function() {
			return 0;
		});
	},
	setsForEach: function(row, column, sectionRowOrigin, sectioncolumnOrigin, callback) {
		var sectionRow, sectionColumn;
	
		for (var index = 0; index < this.n; index++) {
			// apply callback on row
			callback.call(this, row, index);
	
			// apply callback on column 
			callback.call(this, index, column);
	
			// apply callback on section
			sectionRow = sectionRowOrigin + (index % this.sqrt);
			sectionColumn = sectioncolumnOrigin + (Math.floor(index / this.sqrt));
			callback.call(this, sectionRow, sectionColumn);
		}
	},
	matrixForEach: function(matrix, callback) {
		matrix.forEach(function(row, rowIndex) {
			row.forEach(function(value, columnIndex) {
				callback.call(this, rowIndex, columnIndex, value);
			}.bind(this));
		}.bind(this));
	}
};
