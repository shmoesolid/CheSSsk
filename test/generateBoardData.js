var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("W", "K", "e2", true);
game.debug_addPiece("W", "N", "f3", true);
game.debug_addPiece("B", "N", "d4", true);
game.debug_updateAttackers();
var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
console.log("valid moves for: f3", game.getValidMoves("f3"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
