//disjoint set union (explicitly inserted --> cp)
class dsu {
    //the dsu uses 0 based indexing
    //this dsu uses path-optimization and performs union by size for maximum efficiency
    parent = [];
    size = [];
    value = [];

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
            return;
        if(this.size[a] < this.size[b]) {
            let c = b;
            b = a;
            a = c;
        }
        this.parent[b] = a;
        this.value[a] |= this.value[b];
        this.size[a] += this.size[b];
    }

    find_set(v) {
        if(this.parent[v]===v)
            return v;
        this.parent[v] = this.find_set(this.parent[v]);
        return this.parent[v];
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
        this.nodePlayers[node] = this.currentPlayer;
        for(let i = 0; i < this.adjList[node].length; i++) {
            if(this.nodePlayers[this.adjList[node][i]]===this.currentPlayer)
                this.BoardDsu.union_sets(node, this.adjList[node][i]);
        }
        this.currentPlayer = 3 - this.currentPlayer;
        return (this.BoardDsu.find_val(node) === 7);
    }

    bestMoveMdp() {
        let rewards = [], n_rewards = [], f_rewards = [];
        let gamma = 1, max_iter = 100, max_ind = 0;
        for (let i = 0; i < this.nnodes; i++) {
            f_rewards.push(1);
            rewards.push([0, 0, 0]);
            n_rewards.push([0, 0, 0]);
        }
        switch (this.gameBoard) {
            case "93Board":
                for (let i = 0; i < 9; i++)
                    rewards[i][0] = 100;
                for (let i = 8; i < 17; i++)
                    rewards[i][1] = 100;
                for (let i = 16; i < 24; i++)
                    rewards[i][2] = 100;
                rewards[0][2] = 100;
                for(let i = 0; i<25; i++)
                    if(this.nodePlayers[i]===3-this.currentPlayer)
                        rewards[i] = [0, 0, 0];
                break;
            default:
                break;
        }
        for(let iter = 0; iter<max_iter; iter++) {
            for (let i = 0; i < this.nnodes; i++)
                n_rewards[i] = [0, 0, 0];
            for (let i = 0; i < this.nnodes; i++) {
                for (let j = 0; j < this.adjList[i].length; j++) {
                    if(this.nodePlayers[j]===0) {
                        n_rewards[i][0] += gamma * rewards[j][0];
                        n_rewards[i][1] += gamma * rewards[j][1];
                        n_rewards[i][2] += gamma * rewards[j][2];
                    }
                    else if(this.nodePlayers[j]===this.currentPlayer) {
                        n_rewards[i][0] += rewards[j][0];
                        n_rewards[i][1] += rewards[j][1];
                        n_rewards[i][2] += rewards[j][2];
                    }
                }
                n_rewards[i][0] = Math.max(rewards[i][0], n_rewards[i][0]/this.adjList[i].length);
                n_rewards[i][1] = Math.max(rewards[i][1], n_rewards[i][1]/this.adjList[i].length);
                n_rewards[i][2] = Math.max(rewards[i][2], n_rewards[i][2]/this.adjList[i].length);
            }
            for (let i = 0; i < this.nnodes; i++)
                if (this.nodePlayers[i] === 3-this.currentPlayer)
                    n_rewards[i] = [0, 0, 0];
            for (let i = 0; i < this.nnodes; i++)
                for(let j = 0; j<3; j++)
                    rewards[i][j] = n_rewards[i][j];
        }
        for (let i = 0; i < this.nnodes; i++)
            for(let j = 0; j<3; j++)
                f_rewards[i] *= rewards[i][j];
        let available = [];
        for (let i = 0; i < this.nnodes; i++)
            if(this.nodePlayers[i] === 0)
                available.push(i);
        available.sort((a, b) => f_rewards[b] - f_rewards[a]);
        console.log("Returning " + available[0].toString());
        return available[0];
    }
}

export {Game};