function SudokuView() {
	var table = document.createElement('table');
	var tr, td, input;
	for (var row = 0; row < this.n; row++) {
		tr = document.createElement('tr');
		for (var column = 0; column < this.n; column++) {
			td = document.createElement('td');
			input = document.createElement('input');
			input.dataset.row = row;
			input.dataset.column = column;
			input.type = 'text';
			var exp = '[0-9]*';
			input.setAttribute('pattern', exp);
			input.setAttribute('maxLength', 1);
	
			tr.appendChild(td).appendChild(input);
		}
		table.appendChild(tr);
	}	
	
	table.addEventListener('update', function(e) {
		var input = getInput(table, e.detail.row, e.detail.column);
		input.value = e.detail.value || '';

		// handle placement coloring
		if (e.detail.readonly) input.setAttribute('readonly', '');
		if (e.detail.conflict) input.classList.add('conflict');
		else input.classList.remove('conflict');

		// handle game completion coloring
		table.classList.remove('failure');
		table.classList.remove('success');
		if (e.detail.completed.value) {
			if (e.detail.completed.conflict) table.classList.add('failure');
			else table.classList.add('success');
		}
	});
	
	table.addEventListener('keydown', function(e) {
		e.preventDefault();
		if (isValidKeyCode(e.keyCode)) {
			e.target.value = '';
			var value = e.keyCode === 8 ? 0 : e.keyCode - 48;
			this.set(e.target.dataset.row, e.target.dataset.column, value);
		}
	}.bind(this));
	
	document.body.appendChild(table);

	return table;
}

function isValidKeyCode(keyCode) {
	return (keyCode >= 49 && keyCode <= 57) || keyCode === 8;
}

function getInput(table, row, column) {
	return table.children[row].children[column].children[0];
}

module.exports = SudokuView;