import * as app from './app.js';

let gameStarted = false;
let gameFinished = false;
let game;
let currentPlayer = 1;
let selectedMode = "none";
let p1name = "";
let p2name = "";
let humanPlayer = 0;

let canvasSize = 500;
let nodes = [];
let nnodes = 93;
let adjacencyList = [];

function setup() {
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('gameCanvas');
    colorMode("RGB", 255);
    noLoop();
    initialize93Board();
}

function initialize93Board() {
    let coordinates = [0.4958, 1.0000, 0.6053, 0.9478, 0.7153, 0.8768, 0.8160, 0.7851, 0.8988, 0.6748, 0.9571, 0.5508, 0.9901, 0.4209, 1.0000, 0.2935, 0.9935, 0.1757, 0.8921, 0.1100, 0.7739, 0.0532, 0.6417, 0.0145, 0.5018, 0, 0.3617, 0.0129, 0.2291, 0.0502, 0.1101, 0.1056, 0.0080, 0.1702, 0, 0.2879, 0.0084, 0.4155, 0.0397, 0.5457, 0.0966, 0.6704, 0.1781, 0.7816, 0.2777, 0.8744, 0.3868, 0.9466, 0.4963, 0.9049, 0.6060, 0.8516, 0.7079, 0.7786, 0.7940, 0.6870, 0.8581, 0.5806, 0.8981, 0.4630, 0.9137, 0.3414, 0.9080, 0.2227, 0.8056, 0.1574, 0.6896, 0.1084, 0.5649, 0.0820, 0.4378, 0.0813, 0.3127, 0.1064, 0.1961, 0.1541, 0.0929, 0.2182, 0.0857, 0.3368, 0.0998, 0.4586, 0.1384, 0.5766, 0.2012, 0.6838, 0.2862, 0.7763, 0.3872, 0.8504, 0.4968, 0.8156, 0.6011, 0.7608, 0.6904, 0.6851, 0.7569, 0.5948, 0.8053, 0.4944, 0.8295, 0.3819, 0.8278, 0.2670, 0.7267, 0.2070, 0.6146, 0.1700, 0.5008, 0.1592, 0.3869, 0.1687, 0.2744, 0.2045, 0.1725, 0.2634, 0.1694, 0.3782, 0.1922, 0.4910, 0.2394, 0.5920, 0.3048, 0.6830, 0.3931, 0.7596, 0.4973, 0.7314, 0.5908, 0.6719, 0.6545, 0.5938, 0.7056, 0.5090, 0.7445, 0.4169, 0.7522, 0.3088, 0.6524, 0.2603, 0.5509, 0.2458, 0.4497, 0.2453, 0.3480, 0.2586, 0.2477, 0.3061, 0.2540, 0.4142, 0.2917, 0.5067, 0.3418, 0.5921, 0.4045, 0.6709, 0.4978, 0.6503, 0.5525, 0.5820, 0.6026, 0.5076, 0.6448, 0.4289, 0.6795, 0.3491, 0.5911, 0.3374, 0.4998, 0.3324, 0.4084, 0.3364, 0.3199, 0.3471, 0.3535, 0.4273, 0.3947, 0.5065, 0.4439, 0.5814, 0.4987, 0.5035, 0.5479, 0.4218, 0.4505, 0.4213];
    for(let node = 1; node <= nnodes; node++)
        nodes.push({x: 25 + coordinates[(node-1)*2]*(canvasSize-50), y: canvasSize - 25 - coordinates[(node-1)*2+1]*(canvasSize-50), player: 0});
    let neighbours = [2, 25, 24, 0, 0, 0, 1, 3, 26, 25, 0, 0, 2, 4, 27, 26, 0, 0, 5, 3, 27, 28, 0, 0, 4, 28, 6, 29, 0, 0, 5, 7, 30, 29, 0, 0, 6, 8, 31, 30, 0, 0, 9, 7, 31, 32, 0, 0, 8, 32, 10, 0, 0, 0, 11, 9, 33, 32, 0, 0, 10, 12, 33, 34, 0, 0, 11, 13, 34, 35, 0, 0, 35, 36, 12, 14, 0, 0, 15, 13, 37, 36,  0,  0, 14, 16, 37, 38,  0,  0, 15, 17, 38, 39,  0,  0, 18, 39, 16,  0,  0,  0, 17, 19, 40, 39,  0,  0, 20, 18, 40, 41,  0,  0, 19, 21, 41, 42,  0,  0, 22, 43, 42, 20,  0,  0, 21, 23, 44, 43,  0,  0, 24, 22, 44, 45,  0,  0, 23,  1, 45, 25,  0,  0, 46,  1, 45, 26,  2, 24, 3, 46,  2, 27, 25, 47, 48,  3, 26,  4, 28, 47, 48,  5, 49, 27,  4, 29, 50,  5, 49, 30, 28,  6, 7, 50,  6, 31, 29, 51, 52,  7, 30,  8, 32, 51, 52,  9, 33, 31,  8, 10, 11, 52, 53, 32, 10, 34, 54, 11, 53, 35, 12, 33, 13, 54, 34, 55, 12, 36, 56, 13, 37, 55, 35, 14, 15, 56, 57, 36, 14, 38, 58, 15, 57, 39, 16, 37, 58, 17, 38, 40, 18, 16, 19, 58, 41, 18, 39, 59, 60, 19, 42, 59, 20, 40, 60, 21, 41, 61, 43, 20, 62, 21, 61, 44, 22, 42, 23, 62, 45, 22, 43, 63, 46, 23, 25, 63, 24, 44, 25, 64, 47, 63, 26, 45, 46, 48, 26, 64, 65, 27, 28, 65, 27, 49, 47, 66, 50, 48, 66, 28, 29, 67, 29, 68, 49, 51, 67, 30, 50, 52, 30, 68, 69, 31, 32, 69, 31, 33, 51, 53, 52, 54, 69, 33, 70, 34, 70, 35, 34, 55, 53, 71, 56, 54, 71, 35, 36, 72, 36, 73, 55, 37, 72, 57, 56, 58, 73, 37, 74, 38, 74, 39, 59, 38, 40, 57, 58, 60, 41, 75, 74, 40, 42, 75, 76, 59, 61, 41, 62, 60, 43, 77, 42, 76, 78, 43, 63, 77, 44, 61, 62, 46, 45, 64, 78, 44, 79, 46, 47, 63, 65, 78, 48, 79, 66, 47, 64, 80, 48, 81, 65, 49, 80, 67, 81, 50, 66, 82, 68, 49, 50, 83, 51, 67, 82, 69, 52, 83, 53, 51, 68, 70, 54, 83, 71, 53, 69, 84, 54, 85, 70, 55, 84, 72, 85, 56, 71, 86, 73, 55, 56, 87, 57, 72, 86, 74, 58, 87, 59, 57, 75, 73, 87, 60, 76, 59, 88, 74, 60, 89, 61, 75, 88, 77, 89, 62, 61, 78, 90, 76, 62, 79, 77, 63, 64, 90, 64, 65, 78, 80, 90,  0, 81, 79, 91, 66, 65, 90, 80, 82, 67, 92, 66, 91, 83, 81, 67, 92, 68, 84, 82, 68, 69, 70, 84,  0, 85, 83, 92, 71, 82, 70, 84, 86, 92, 72, 93, 71, 85, 87, 72, 93, 88, 73, 75, 88, 86, 73, 74,  0, 89, 87, 93, 76, 75, 86, 90, 88, 77, 93, 76, 91, 89, 79, 77, 91, 78, 80, 81, 89, 80, 92, 90, 93, 85, 81, 91, 82, 84, 93, 89, 85, 91, 88, 86, 92]
    for(let node = 1; node <= nnodes; node++) {
        adjacencyList.push([]);
        for(let neighbour = 1; neighbour <= 6; neighbour++)
            if(neighbours[(node-1)*6+neighbour-1] !== 0)
                adjacencyList[node-1].push(neighbours[(node-1)*6+neighbour-1]);
    }
}

function drawBoard() {
    stroke(color(84, 8, 4));
    strokeWeight(2);
    for (let node = 0; node < nnodes; node++) {
        for(let nneighbour = 0; nneighbour < adjacencyList[node].length; nneighbour++)
            line(nodes[node].x, nodes[node].y, nodes[adjacencyList[node][nneighbour]-1].x, nodes[adjacencyList[node][nneighbour]-1].y);
    }
    for (let node = 0; node < nnodes; node++) {
        if(nodes[node].player === 0) {
            fill(color(84, 8, 4));
            ellipse(nodes[node].x, nodes[node].y, 15, 15);
        }
        else {
            fill(nodes[node].player === 1 ? color(239, 239, 239) : color(4, 2, 40));
            ellipse(nodes[node].x, nodes[node].y, 30, 30);
        }
    }
}

function draw() {
    background(color(248, 112, 96));
    drawBoard();
}

function startGame() {
    gameStarted = true;
    game = app.Game("93Board", nnodes, adjacencyList);
    document.getElementById("game_setup").style.display = "none";
    document.getElementById("game_window").style.display = "flex";
    $("#player1Stats .playerNameTurnText").text(p1name + "'s turn");
    $("#player2Stats .playerNameTurnText").text(p2name);
    if((currentPlayer&humanPlayer)===0)
        makeAImove();
}

function mousePressed() {
    if(gameStarted && (currentPlayer&humanPlayer)>0 && !gameFinished) {
        for (let node = 0; node < nnodes; node++)
            if (dist(mouseX, mouseY, nodes[node].x, nodes[node].y) < 10 && nodes[node].player === 0) {
                nodes[node].player = currentPlayer;
                redraw();
                if(game.make_move(node)) {
                    makeWin();
                    gameFinished = true;
                }
                currentPlayer = 3 - currentPlayer;
                if(!gameFinished) {
                    if (currentPlayer === 1) {
                        $("#player1Stats .playerNameTurnText").text(p1name + "'s turn");
                        $("#player2Stats .playerNameTurnText").text(p2name);
                    } else {
                        $("#player1Stats .playerNameTurnText").text(p1name);
                        $("#player2Stats .playerNameTurnText").text(p2name + "'s turn");
                    }
                    if (humanPlayer !== 3) {
                        app.makeAImove();
                    }
                }
                return;
            }
    }
}

function makeWin() {
    if (currentPlayer === 1) {
        $("#player1Stats .playerNameTurnText").text(p1name + " wins!");
        $("#player2Stats .playerNameTurnText").text(p2name + " loses");
    } else {
        $("#player1Stats .playerNameTurnText").text(p1name + " loses");
        $("#player2Stats .playerNameTurnText").text(p2name + " wins!");
    }
}

$(document).ready(function () {

    $("#selectGameMode input[type='checkbox']").on("change", function (){
        let $box = $(this);
        if ($box.is(":checked")) {
            $("input:checkbox[name='gameMode']").prop("checked", false);
            $box.prop("checked", true);
            changeSelectedMode($box.attr("value"));
        }
        else {
            changeSelectedMode("none");
        }
    });

    function changeSelectedMode(val){
        selectedMode = val;
        switch (selectedMode) {
            case "friend":
                document.getElementById("selectFirstPlayer").style.display = "none";
                document.getElementById("enterPlayerNames").style.display = "inline";
                $("#playerName1").attr("placeholder", "Enter player 1's name");
                document.getElementById("playerName1").style.display = "inline";
                document.getElementById("playerName2").style.display = "inline";
                document.getElementById("startButtons").style.display = "block";
                break;
            case "mdp":
            case "minimax":
            case "amaf":
                document.getElementById("selectFirstPlayer").style.display = "flex";
                document.getElementById("enterPlayerNames").style.display = "inline";
                $("#playerName1").attr("placeholder", "Enter player's name");
                document.getElementById("playerName1").style.display = "inline";
                document.getElementById("playerName2").style.display = "none";
                document.getElementById("startButtons").style.display = "block";
                break;
            default:
                document.getElementById("enterPlayerNames").style.display = "none";
                document.getElementById("startButtons").style.display = "none";
                break;
        }
    }

    $("#startButtons input[name='startButton']").click(function () {
        switch (selectedMode) {
            case "friend":
                if(document.getElementById("playerName1").value === "" || document.getElementById("playerName2").value === "") {
                    $("#errorMessage span").text("Uh-oh! Please enter the players' names!");
                    document.getElementById("errorMessage").style.display = "block";
                }
                else {
                    $("#errorMessage span").text("");
                    p1name = document.getElementById("playerName1").value;
                    p2name = document.getElementById("playerName2").value;
                    humanPlayer = 3; // both are human players
                    startGame();
                }
                break;
            case "mdp":
                if(document.getElementById("playerName1").value === "") {
                    $("#errorMessage span").text("Uh-oh! Please enter the player's name!");
                    document.getElementById("errorMessage").style.display = "block";
                }
                else {
                    $("#errorMessage span").text("");
                    if($("#firstPlayerCheckbox").prop("checked")) {
                        p1name = document.getElementById("playerName1").value;
                        p2name = "AI (MDP-based)";
                        humanPlayer = 1; // player 1 is human player
                    }
                    else {
                        p2name = document.getElementById("playerName1").value;
                        p1name = "AI (MDP-based)";
                        humanPlayer = 2; // player 2 is human player
                    }
                    startGame();
                }
                break;
            case "minimax":
                if(document.getElementById("playerName1").value === "") {
                    $("#errorMessage span").text("Uh-oh! Please enter the player's name!");
                    document.getElementById("errorMessage").style.display = "block";
                }
                else {
                    $("#errorMessage span").text("");
                    if($("#firstPlayerCheckbox").prop("checked")) {
                        p1name = document.getElementById("playerName1").value;
                        p2name = "AI (Minimax-based)";
                        humanPlayer = 1; // player 1 is human player
                    }
                    else {
                        p2name = document.getElementById("playerName1").value;
                        p1name = "AI (Minimax-based)";
                        humanPlayer = 2; // player 2 is human player
                    }
                    startGame();
                }
                break;
            case "amaf":
                if(document.getElementById("playerName1").value === "") {
                    $("#errorMessage span").text("Uh-oh! Please enter the player's name!");
                    document.getElementById("errorMessage").style.display = "block";
                }
                else {
                    $("#errorMessage span").text("");
                    if($("#firstPlayerCheckbox").prop("checked")) {
                        p1name = document.getElementById("playerName1").value;
                        p2name = "AI (AMAF-based)";
                        humanPlayer = 1; // player 1 is human player
                    }
                    else {
                        p2name = document.getElementById("playerName1").value;
                        p1name = "AI (AMAF-based)";
                        humanPlayer = 2; // player 2 is human player
                    }
                    startGame();
                }
                break;
            default:
                break;
        }
    });

});