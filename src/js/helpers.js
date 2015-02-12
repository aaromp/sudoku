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
	}
};
