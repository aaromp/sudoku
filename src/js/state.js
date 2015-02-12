var SudokuSet = require('./set');
var helpers = require('./helpers');

var SudokuState = function(n) {
	this.n = n;
	this.sqrt = Math.sqrt(this.n);
	this.rows = initializeSets(n);
	this.columns = initializeSets(n);
	this.sections = initializeSets(n);
	this.options = helpers.initializeOptions.call(this);
};

SudokuState.prototype.update = function(row, column, previous, value) {
	var rowOrigin = Math.floor(row / this.sqrt) * this.sqrt;
	var columnOrigin = Math.floor(column / this.sqrt) * this.sqrt;
	// adding
	if (previous === 0 && value !== 0) {
		this.insert(row, column, value);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			delete this.options[row][column][value];
		});
	} 
	// if erasing
	else if (previous !== 0 && value === 0) {
		this.delete(row, column, previous);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
			if (this.available(row, column, previous)) this.options[row][column][previous] = true;
		});
	} 
	// updating
	else if (previous !== value) {
		this.delete(row, column, previous);
		this.insert(row, column, value);
		setsForEach.call(this, row, column, rowOrigin, columnOrigin, function(row, column) {
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

function initializeSets(n) {
	return Array.apply(null, Array(n)).map(function() {
		return new SudokuSet(n);
	});
}

function getSection(row, column) {
	return (Math.floor(row / this.sqrt) * this.sqrt) + (Math.floor(column / this.sqrt) % this.sqrt);
}

function setsForEach(row, column, rowOrigin, columnOrigin, callback) {
	var sectionRow, sectionColumn;

	for (var index = 0; index < this.n; index++) {
		// apply callback on row
		callback.call(this, row, index);

		// apply callback on column 
		callback.call(this, index, column);

		// apply callback on section
		sectionRow = rowOrigin + (index % this.sqrt);
		sectionColumn = columnOrigin + (Math.floor(index / this.sqrt));
		callback.call(this, sectionRow, sectionColumn);
	}
}

// abstract into helper
function matrixForEach(matrix, callback) {
	matrix.forEach(function(row, rowIndex) {
		row.forEach(function(value, columnIndex) {
			callback.call(this, value, rowIndex, columnIndex, matrix);
		}.bind(this));
	}.bind(this));
}

module.exports = SudokuState;
