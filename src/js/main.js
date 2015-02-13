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
		var exp = /[0-9]*/;
		input.setAttribute('pattern', exp);
		input.setAttribute('maxLength', 1);

		tr.appendChild(td).appendChild(input);
	}
	table.appendChild(tr);
}

var previous;

table.addEventListener('focusin', function(e) {
	previous = e.target.value;
	if (e.target.attributes.readonly === '') e.target.value = '';
});

table.addEventListener('focusout', function(e) {
	if (e.target.value === '' && previous !== '') {
		e.target.value = previous;
	}
});

table.addEventListener('input', function(e) {
	var row = e.target.dataset.row;
	var column = e.target.dataset.column;
	var value = e.target.value;
	e.target.setAttribute('readonly', '');
});

document.body.appendChild(table);
console.log(table);
