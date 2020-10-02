var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("K", "W", "d3", true);
game.debug_addPiece("Q", "W", "e5", true);
game.debug_addPiece("N", "B", "c5", true);
game.debug_addPiece("Q", "B", "d7", true);
game.debug_updateAttackers();
var string = game.getGridInJSON();

console.log("valid moves for: QWe5", game.getValidMoves("e5"));
console.log("valid moves for: KWd3", game.getValidMoves("d3"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
