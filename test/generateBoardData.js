var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("W", "K", "a1", true);
game.debug_addPiece("B", "K", "d7", true);

// game.debug_addPiece("B", "K", "h8", true);
// game.debug_addPiece("W", "B", "d4", true);
// game.debug_addPiece("B", "R", "f8", true);

// game.debug_addPiece("W", "N", "c6", true);
// game.debug_addPiece("W", "B", "c5", true);
// game.debug_addPiece("W", "R", "b3", true);
game.debug_addPiece("B", "P", "b7", false);
game.debug_addPiece("B", "N", "a3", true);
game.debug_addPiece("W", "P", "c6", true);
game.debug_updateAttackers();

console.log(game.move("b7", "c6"));

var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
//console.log("valid moves a3", game.getValidMoves("a3"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
