var SudokuSet = require('./set');
var helpers = require('./helpers');

var SudokuState = function(n) {
	this.n = n;
	this.sqrt = Math.sqrt(this.n);
	this.rows = helpers.initializeArray.call(this, n, function() {
		return new SudokuSet(n);
	});
	this.columns = helpers.initializeArray.call(this, n, function() {
		return new SudokuSet(n);
	});
	this.sections = helpers.initializeArray.call(this, n, function() {
		return new SudokuSet(n);
	});
	this.options = helpers.initializeMatrix.call(this, this.n, function() {
		return helpers.initializeOptions(this.n);
	});
};

SudokuState.prototype.update = function(row, column, previous, value) {
	var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
	var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	// adding
	if (previous === 0 && value !== 0) {
		this.insert(row, column, value);
		helpers.setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			delete this.options[row][column][value];
		});
	} 
	// if erasing
	else if (previous !== 0 && value === 0) {
		this.delete(row, column, previous);
		helpers.setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			if (this.available(row, column, previous)) this.options[row][column][previous] = true;
		});
	} 
	// updating
	else if (previous !== value) {
		this.delete(row, column, previous);
		this.insert(row, column, value);
		helpers.setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			if (this.available(row, column, previous)) this.options[row][column][previous] = true;
			delete this.options[row][column][value];
		});
	}
};

SudokuState.prototype.getOptions = function(row, column) {
	return this.options[row][column];
};

SudokuState.prototype.insert = function(row, column, value) {
	var section = getSection.call(this, row, column);

	this.rows[row].insert(value);
	this.columns[column].insert(value);
	this.sections[section].insert(value);
};

SudokuState.prototype.delete = function(row, column, value) {
	var section = getSection.call(this, row, column);

	this.rows[row].delete(value);
	this.columns[column].delete(value);
	this.sections[section].delete(value);
};

SudokuState.prototype.available = function(row, column, value) {
	var section = getSection.call(this, row, column);

	return !this.rows[row].contains(value) &&
		   !this.columns[column].contains(value) &&
		   !this.sections[section].contains(value);
};

function hasConflictAt(row, column, section) {
	return this.rows[row].hasConflict() ||
		   this.columns[column].hasConflict() ||
		   this.sections[section].hasConflict();
}

SudokuState.prototype.hasConflictAt = function(row, column) {
	var section = getSection.call(this, row, column);
	return hasConflictAt.call(this, row, column, section);
};

SudokuState.prototype.hasConflict = function() {
	for (var index = 0; index < this.n; index++) {
		if (hasConflictAt.call(this, index, index, index)) return true;
	}

	return false;
};

function getSection(row, column) {
	return (Math.floor(row / this.sqrt) * this.sqrt) + (Math.floor(column / this.sqrt) % this.sqrt);
}

module.exports = SudokuState;
