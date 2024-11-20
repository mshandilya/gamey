//disjoint set union (explicitly inserted --> cp)
class dsu {
    //the dsu uses 0 based indexing
    //this dsu performs union by size for maximum efficiency
    parent = [];
    size = [];
    value = [];
    union_stack = [];

    constructor(n, values) {
        this.parent = [];
        for(let i = 0; i<n; i++) {
            this.parent.push(i);
            this.value.push(values[i]);
        }
        this.size.fill(1, 0, n);
    }

    make_set(value) {
        this.value.push(value);
        this.parent.push(this.parent.length);
    }

    union_sets(a, b) {
        a = this.find_set(a);
        b = this.find_set(b);
        if(a===b)
            return false;
        if(this.size[a] < this.size[b]) {
            let c = b;
            b = a;
            a = c;
        }
        this.union_stack.push([a, b, this.value[a], this.value[b]]);
        this.parent[b] = a;
        this.value[a] |= this.value[b];
        this.size[a] += this.size[b];
        return true;
    }

    rollback() {
        let last_update = this.union_stack.pop();
        this.parent[last_update[1]] = last_update[1];
        this.value[last_update[0]] = last_update[2];
        this.value[last_update[1]] = last_update[3];
        this.size[last_update[0]] -= this.size[last_update[1]];
    }

    find_set(v) {
        if(this.parent[v]===v)
            return v;
        return this.find_set(this.parent[v]);
    }

    find_val(v) {
        v = this.find_set(v);
        return this.value[v];
    }
}

class Game {
    gameBoard = "93Board";
    currentPlayer = 1;
    nnodes = 93;
    adjList;
    nodePlayers = [];
    BoardDsu;
    movesStack = [];

    constructor(gameBoard, nnodes, adjList) {
        this.gameBoard = gameBoard;
        this.nnodes = nnodes;
        this.adjList = adjList;
        for(let i = 0; i < nnodes; i++) {
            this.nodePlayers[i] = 0;
        }
        let values = [];
        switch (gameBoard) {
            case "93Board":
                for(let i = 0; i < nnodes; i++) {
                    values.push(0);
                }
                for(let i = 0; i < 9; i++) {
                    values[i] |= 1;
                }
                for(let i = 8; i < 17; i++) {
                    values[i] |= 2;
                }
                for(let i = 16; i < 24; i++) {
                    values[i] |= 4;
                }
                values[0] |= 4;
                break;
            default:
                break;
        }
        this.BoardDsu = new dsu(nnodes, values);
    }

    makeMove(node) {
        this.movesStack.push([node, 0]);
        this.nodePlayers[node] = this.currentPlayer;
        for(let i = 0; i < this.adjList[node].length; i++) {
            if(this.nodePlayers[this.adjList[node][i]]===this.currentPlayer) {
                if(this.BoardDsu.union_sets(node, this.adjList[node][i]))
                    this.movesStack[this.movesStack.length-1][1]++;
            }
        }
        this.currentPlayer = 3 - this.currentPlayer;
        return (this.BoardDsu.find_val(node) === 7);
    }

    undoMove() {
        let last_move = this.movesStack.pop();
        this.nodePlayers[last_move[0]] = 0;
        for(let i = 0; i < last_move[1]; i++)
            this.BoardDsu.rollback();
        this.currentPlayer = 3 - this.currentPlayer;
        return last_move[0];
    }

    evalPositions() {
        let node, wp, cp = this.currentPlayer, temp_moves, win_iters = 0, max_iter = 1000, nodePlayed = [], nodeWon = [];
        for(let i = 0; i < this.nnodes; i++) {
            nodePlayed.push(0);
            nodeWon.push(0);
        }
        for(let iter = 0; iter<max_iter; iter++) {
            temp_moves = 0;
            node = Math.floor(Math.random() * this.nnodes);
            while (this.nodePlayers[node] !== 0)
                node = Math.floor(Math.random() * this.nnodes);
            temp_moves++;
            while (!this.makeMove(node)) {
                while (this.nodePlayers[node] !== 0)
                    node = Math.floor(Math.random() * this.nnodes);
                temp_moves++;
            }
            wp = 3 - this.currentPlayer; // winning player
            while ((temp_moves--) > 0) {
                node = this.undoMove();
                nodePlayed[node]++;
                if (this.currentPlayer === wp)
                    nodeWon[node]++;
            }
            if(wp===cp)
                win_iters++;
        }
        for(let i = 0; i<this.nnodes; i++)
            if(nodePlayed[i]>0)
                nodeWon[i] = nodeWon[i]/nodePlayed[i];
        return [nodeWon, win_iters/max_iter];
    }

    bestMoveMdp() {
        let p1rewards = [], p1n_rewards = [], p2rewards = [], p2n_rewards = [], f_rewards = [];
        // gamma + beta < 1
        let gamma = 0.95, max_iter = 1000, beta = 0.03, delta = 1, fact = 1, max_ind = 0;
        for (let i = 0; i < this.nnodes; i++) {
            f_rewards.push(1);
            p1rewards.push([0, 0, 0]);
            p1n_rewards.push([0, 0, 0]);
            p2rewards.push([0, 0, 0]);
            p2n_rewards.push([0, 0, 0]);
        }
        switch (this.gameBoard) {
            case "93Board":
                for (let i = 0; i < 9; i++) {
                    p1rewards[i][0] = 10;
                    p2rewards[i][0] = 10;
                }
                for (let i = 8; i < 17; i++) {
                    p1rewards[i][1] = 10;
                    p2rewards[i][1] = 10;
                }
                for (let i = 16; i < 24; i++) {
                    p1rewards[i][2] = 10;
                    p2rewards[i][2] = 10;
                }
                p1rewards[0][2] = 10;
                p2rewards[0][2] = 10;
                for(let i = 0; i<24; i++) {
                    if (this.nodePlayers[i] === 3 - this.currentPlayer)
                        p1rewards[i] = [0, 0, 0];
                    else if (this.nodePlayers[i] === this.currentPlayer)
                        p2rewards[i] = [0, 0, 0];
                }
                break;
            default:
                break;
        }
        for(let iter = 0; iter<max_iter; iter++) {
            for (let i = 0; i < this.nnodes; i++)
                for(let j = 0; j < 3; j++) {
                    p1n_rewards[i][j] = 0;
                    p2n_rewards[i][j] = 0;
                }
            for (let i = 0; i < this.nnodes; i++) {
                for (let j = 0; j < this.adjList[i].length; j++) {
                    if(this.nodePlayers[this.adjList[i][j]]===0) {
                        p1n_rewards[i][0] = Math.max(p1n_rewards[i][0], (beta * p2rewards[i][0] + gamma * p1rewards[this.adjList[i][j]][0])*fact);
                        p1n_rewards[i][1] = Math.max(p1n_rewards[i][1], (beta * p2rewards[i][1] + gamma * p1rewards[this.adjList[i][j]][1])*fact);
                        p1n_rewards[i][2] = Math.max(p1n_rewards[i][2], (beta * p2rewards[i][2] + gamma * p1rewards[this.adjList[i][j]][2])*fact);
                        p2n_rewards[i][0] = Math.max(p2n_rewards[i][0], (beta * p1rewards[i][0] + gamma * p2rewards[this.adjList[i][j]][0])*fact);
                        p2n_rewards[i][1] = Math.max(p2n_rewards[i][1], (beta * p1rewards[i][1] + gamma * p2rewards[this.adjList[i][j]][1])*fact);
                        p2n_rewards[i][2] = Math.max(p2n_rewards[i][2], (beta * p1rewards[i][2] + gamma * p2rewards[this.adjList[i][j]][2])*fact);
                    }
                    else if(this.nodePlayers[this.adjList[i][j]]===this.currentPlayer) {
                        p1n_rewards[i][0] = Math.max(p1n_rewards[i][0], (beta * p2rewards[i][0] + delta * p1rewards[this.adjList[i][j]][0])*fact);
                        p1n_rewards[i][1] = Math.max(p1n_rewards[i][1], (beta * p2rewards[i][1] + delta * p1rewards[this.adjList[i][j]][1])*fact);
                        p1n_rewards[i][2] = Math.max(p1n_rewards[i][2], (beta * p2rewards[i][2] + delta * p1rewards[this.adjList[i][j]][2])*fact);
                    }
                    else {
                        p2n_rewards[i][0] = Math.max(p2n_rewards[i][0], (beta * p1rewards[i][0] + delta * p2rewards[this.adjList[i][j]][0])*fact);
                        p2n_rewards[i][1] = Math.max(p2n_rewards[i][1], (beta * p1rewards[i][1] + delta * p2rewards[this.adjList[i][j]][1])*fact);
                        p2n_rewards[i][2] = Math.max(p2n_rewards[i][2], (beta * p1rewards[i][2] + delta * p2rewards[this.adjList[i][j]][2])*fact);
                    }
                }
            }
            for (let i = 0; i < this.nnodes; i++)
                if (this.nodePlayers[i] === 3-this.currentPlayer)
                    p1n_rewards[i] = [0, 0, 0];
            for (let i = 0; i < this.nnodes; i++)
                for(let j = 0; j<3; j++)
                    p1rewards[i][j] = p1n_rewards[i][j];
            for (let i = 0; i < this.nnodes; i++)
                if (this.nodePlayers[i] === this.currentPlayer)
                    p2n_rewards[i] = [0, 0, 0];
            for (let i = 0; i < this.nnodes; i++)
                for(let j = 0; j<3; j++)
                    p2rewards[i][j] = p2n_rewards[i][j];
            console.log(p1rewards);
        }
        for (let i = 0; i < this.nnodes; i++)
            for(let j = 0; j<3; j++)
                f_rewards[i] *= p1rewards[i][j];
        let available = [];
        for (let i = 0; i < this.nnodes; i++)
            if(this.nodePlayers[i] === 0)
                available.push(i);
        available.sort((a, b) => f_rewards[b] - f_rewards[a]);
        return available[0];
    }

    bestMoveMinimax(depth = 0, alpha = -1, beta = 1){
        let [moveOrder, myVal] = this.evalPositions(), maxElem = 4, maxDepth = 3, available = [], currentBestMove, nextBestMove, nextBestValue;
        for(let i = 0; i < this.nnodes; i++)
            if(this.nodePlayers[i] === 0)
                available.push(i);
        available = available.sort((a, b) => moveOrder[b] - moveOrder[a]).slice(0, maxElem);
        console.log(available);
        currentBestMove = -1;
        if(depth===maxDepth)
            return [-1, myVal];
        for(let i = 0; i < maxElem; i++) {
            let exploringNode = available[i];
            if(this.makeMove(exploringNode)) {
                this.undoMove();
                return [exploringNode, 1];
            }
            [nextBestMove, nextBestValue] = this.bestMoveMinimax(depth+1, -beta, -alpha);
            nextBestValue *= -1;
            this.undoMove();
            if (nextBestValue > alpha) {
                currentBestMove = exploringNode;
                alpha = nextBestValue;
                if(alpha>=beta)
                    return [currentBestMove, alpha];
            }
        }
        return [currentBestMove, alpha];
    }

    bestMoveAMAF() {
        let evalResult = this.evalPositions()[0], available = [];
        for(let i = 0; i < this.nnodes; i++)
            if(this.nodePlayers[i] === 0)
                available.push(i);
        available.sort((a, b)=>evalResult[b] - evalResult[a]);
        return available[0];
    }
}

export {Game};