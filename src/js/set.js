var helpers = require('./helpers');

var SudokuSet = function(n) {
	this.set = helpers.initializeCounts(n);
};

SudokuSet.prototype.contains = function(value) {
	return this.set[value] > 0;
};

SudokuSet.prototype.insert = function(value) {
	if (value > 0) this.set[value]++;
};

SudokuSet.prototype.delete = function(value) {
	if (value > 0) this.set[value]--;
};

SudokuSet.prototype.hasConflict = function() {
	return Object.keys(this.set).some(function(value) {
		return this.set[value] > 1;
	}.bind(this));
};

module.exports = SudokuSet;
