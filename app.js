class Game {
    gameBoard = "93Board";
    currentPlayer = 1;
    nnodes = 93;
    adjList = int[93];

    constructor(gameBoard, nnodes, adjList) {
        this.gameBoard = gameBoard;
        this.nnodes = nnodes;
        this.adjList = adjList;
    }


}

export {Game};