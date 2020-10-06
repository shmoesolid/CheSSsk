
/** config for CheSSsk class
 * 
 * Author: Shane Koehler
 */
const config = {};

config.PREG_ID = /(w|W|b|B)(k|K|q|Q|r|R|b|B|n|N|p|P)[a-hA-H][1-8]/;
config.PREG_LOCATION = /[a-hA-H][1-8]/;

config.MESSAGE = {

    INVALID_LOCATION: "The location you requested is either not proper format or out of bounds of our grid.",
    INVALID_DESTINATION: "The location you want to move to is not a valid location to move to.",
    INVALID_ENPASSANT: "The enPassant string passed is not a valid en passant move.",
    INVALID_PAWN_EXCHANGE: "Circumstances do not exist for a valid pawn exchange. (ie location, color, removing piece type, or exchange piece type)",
    NULL_PIECE: "The location you requested does not contain a valid piece.",
    INVALID_TYPE: "The piece type if not valid.",
    NO_GAME_FOUND: "The game session you're looking for does not exist.",
    REQUEST_DENIED: "You got some problems.",
    INVALID_SYNTAX: "Send the right stuff."

};

module.exports = config;