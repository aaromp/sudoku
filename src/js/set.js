var SudokuSet = function(max) {
	this.max = max;
	this.empty();
};

SudokuSet.prototype.empty = function() {
	this.count = 0;
	this.set = {};
};

SudokuSet.prototype.insert = function(value) {
	if (this.count >= this.max) throw new Error('exceeded max size');
	if (value > 0 && value <= this.max) {
		this.count++;
		this.set[value] = true;
	}
};

SudokuSet.prototype.isValid = function() {
	return Object.keys(this.set).length === this.count;
};

module.exports = SudokuSet;
