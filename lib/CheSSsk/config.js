
const config = {};

config.PREG_ID = /(wW|bB)[kKqQrRbBnNpP][a-hA-H][1-8]/;
config.PREG_LOCATION = /[a-hA-H][1-8]/;

config.JSON_ERROR_MESSAGE = {

    INVALID_LOCATION: "The location you requested is either not proper format or out of bounds of our grid.",
    NULL_PIECE: "The location you requested does not contain a valid piece.",
    INVALID_TYPE: "The piece type if not valid.",
    NO_GAME_FOUND: "The game session you're looking for does not exist.",
    REQUEST_DENIED: "You got some problems.",
    INVALID_SYNTAX: "Send the right stuff."

};