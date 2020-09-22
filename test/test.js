const CheSSsk = require("../");

var game = new CheSSsk();

game.setupNewGame();
console.log(game._grid);

var string = game.getGridInJSON();
game.setGridFromJSON(string);
console.log(game._grid);
