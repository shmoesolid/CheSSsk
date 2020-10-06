var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("W", "K", "h8", true);
game.debug_addPiece("B", "K", "a8", true);

// game.debug_addPiece("B", "K", "h8", true);
// game.debug_addPiece("W", "B", "d4", true);
// game.debug_addPiece("B", "R", "f8", true);

game.debug_addPiece("W", "N", "c6", true);
game.debug_addPiece("W", "B", "c5", true);
game.debug_addPiece("W", "R", "b3", true);
game.debug_addPiece("W", "P", "b6", true);
game.debug_addPiece("W", "P", "f7", true);
game.debug_updateAttackers();

console.log(game.move("f7", "f8"));

var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
//console.log("valid moves a8", game.getValidMoves("f8"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
