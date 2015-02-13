var sudoku = require('./sudoku');

var table = document.createElement('table');
var tr, td, input;
for (var row = 1; row <= 9; row++) {
	tr = document.createElement('tr');
	for (var column = 1; column <= 9; column++) {
		td = document.createElement('td');
		input = document.createElement('input');
		input.dataset.row = row;
		input.dataset.column = column;
		input.type = 'text';
		input.setAttribute('pattern', '[0-9]*');
		input.setAttribute('maxLength', 1);

		tr.appendChild(td).appendChild(input);
	}
	table.appendChild(tr);
}

document.body.appendChild(table);
console.log(table);
