var initializeMatrix = function(n, callback) {
	return Array.apply(null, Array(n)).map(function(row, rowIndex) {
		return Array.apply(null, Array(n)).map(function(column, columnIndex) {
			return callback.call(this, rowIndex, columnIndex);
		}.bind(this));
	}.bind(this));
};

var isPerfectSquare = function(n) {
	this.sqrt = Math.sqrt(n); // store sqrt on object to avoid recalculating
	var roundedSqrt = Math.floor(this.sqrt);

	return (this.sqrt * this.sqrt) === (roundedSqrt * roundedSqrt);
};

function initializeArray(n, callback) {
	return Array.apply(null, Array(n)).map(function(value, index) {
		return callback.call(this, n, callback, value, index);
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
		
		return isPerfectSquare.call(this, input.length);
	},
	initializeMatrix: function(n, callback) {
		return Array.apply(null, Array(n)).map(function(row, rowIndex) {
			return Array.apply(null, Array(n)).map(function(column, columnIndex) {
				return callback.call(this, rowIndex, columnIndex);
			}.bind(this));
		}.bind(this));
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
	}
};
