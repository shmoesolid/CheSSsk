var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("B", "K", "h8", true);
game.debug_addPiece("W", "B", "d4", true);
game.debug_addPiece("B", "R", "f8", true);
game.debug_addPiece("B", "P", "e7", false);
game.debug_updateAttackers();
var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
console.log("valid moves f8", game.getValidMoves("f8"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
