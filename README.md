# CheSSsk Library

## Description

*Still a WIP*

A library for chess move validation based on location and board data.

* Set up new game
* Load game from database JSON string
* Export board data to JSON string for saving
* Get valid moves for pieces based on location
* Make only valid moves for pieces
* En passant
* King check and checkmate status updates
* Pawn exchange

## Example Usage

- Creating a new game and getting valid moves for a location

    ```javascript
    const chesssk = require("chesssk");
    const game = new chesssk();

    game.setupNewGame();

    let validMoves = game.getValidMoves("b1");
    console.log(validMoves);
    ```

- Load a game from database, make a move, and get new grid data in json string

    ```javascript
    const chesssk = require("chesssk");
    const game = new chesssk();

    game.setGridFromJSON( db.jsonGameData );

    let moveResult = game.move("b2", "b4", db.enPassantString);
    let dbJsonStringToSave = game.getGridInJSON();

    // do database and client updates with moveResult object and new grid data
    console.log(moveResult, dbJsonStringToSave);
    ```
