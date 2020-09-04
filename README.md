# CheSSsk Library

## Description

A library for chess move validation based on location and board data

## Example Usage

    const chesssk = require("chesssk");
    const game = new chesssk();
    game.setupNewGame();
    let validMoves = game.getValidMoves("b1");
    console.log(validMoves);
