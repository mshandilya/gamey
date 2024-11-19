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

    make_move(node) {
        this.nodePlayers[node] = this.currentPlayer;
        for(let i = 0; i < this.adjList[node].length; i++) {
            if(this.nodePlayers[this.adjList[node][i]]===this.currentPlayer) {
                this.BoardDsu.union_sets(node, this.adjList[node][i]);
                console.log("Sets merged");
                console.log("New value = " + this.BoardDsu.find_val(node).toString());
            }
        }
        this.currentPlayer = 3 - this.currentPlayer;
        return (this.BoardDsu.find_val(node) === 7);
    }


}

export {Game};