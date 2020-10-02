var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("K", "W", "b1", true);
game.debug_addPiece("P", "W", "c2", false);
game.debug_addPiece("B", "B", "g6", true);
//game.debug_addPiece("Q", "B", "d7", true);
game.debug_updateAttackers();
var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
console.log("valid moves for: PWc2", game.getValidMoves("c2"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
