const CheSSsk = require("../");

var game1 = new CheSSsk();

game1.setupNewGame();
console.log(game1._grid);

var string = game1.getGridInJSON();
//console.log(string);

var game2 = new CheSSsk();

game2.setGridFromJSON(string);
console.log(game2._grid);
