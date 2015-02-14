# Sudoku
A grid based number game.

## Features
* Color feedback (incorrect moves and game completion)
* Numberpad input on iOS
* Responsive sizing for mobile and desktop
* Board solver—type game.solve() in the developer tools

## Instructions
Simply clone the repo, `npm install` `gulp` and head to localhost:8080.

## File Structure
	* src/
		* js/
		* styles/
		* templates/
		* tests/
	
	* builds/
		* dev/
			* js/
			* css/
			* index.html
		* prod/

## Technical Stack
* Gulp: Build System
* Browserify: Scripts
* Jade: HTML
* Stylus: CSS
* Mocha + Should: Testing

I chose Browserify to keep my scripts modular while maintaining the ability to easily concatenate and uglify them. On this project, Jade and Stylus were mostly used to do less typing. Mocha paired with Should was used in order to follow a test driven development process. Gulp was selected as task runner to automate the various tools listed above.

## Technical Choices
I built the view with JavaScript. This allowed me to create boards of arbitrary size (4x4, 5x5, etc.) but has the drawback of a potential flicker while processing. The messaging between the view layer and data layer follow a basic MVC pattern. User input triggers DOM events, which modify the models, which in turn trigger an event to update the view. Having this one way data flow ensures models are the single source of truth and therefore the functionality validated by testing will carry through to the view layer.

For tracking the state of the Sudoku game I use 3 arrays of length n to keep track of row, column and section conflicts. Additionally, I store a matrix of available options corresponding to each position on the board for quick validation. I built out a backtracking sudoku solver that selects the most constrained cells and looks ahead to prune the search space. Performance is very slow because the operations used to keep track of state are inefficient. Had I had more time I would have optimized them. Likewise I would have refactored some aspects of the scripts and spent more time adding polish to the design.

## Planned Features
* Modes
	* Easy mode: shows shows the cause of conflicts and avilable options
	* Normal mode: shows cell conflict
	* Hard mode: no assistance
* Board generator
* Improved design

## Known Bugs
Invalidly set cells prevent valid cells from displaying the correct color—when the invalidly placed cell is removed, the valid cell should update in color.

Highlighted boxes don't color correctly on even n grids.
