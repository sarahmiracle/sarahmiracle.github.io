//-------------------------------------------graph related-------------------------------------------//
var g6_decrypt = function (graph_g6) {
    var tmp = graph_g6.charCodeAt(0);
    var n = tmp - 63;
    var adj = new Array(n), i, j, i1 = 1, j1 = 32, p = 1;
    for (i = 0; i < n; i++) adj[i] = new Array(n);
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) adj[i][j] = 0;
    for (j = 1; j < n; j++)
        for (i = 0; i < j; i++) {
            if (--i1 == 0) {
                i1 = 6;
                tmp = graph_g6.charCodeAt(p) - 63;
                p++;
            }
            if (tmp & j1) {
                adj[i][j] = 1;
                adj[j][i] = 1;
            }
            tmp <<= 1;
        }
    return adj;
};


var g6_encrypt = function(adj) {
    var g6 = "";

    var n = adj.length;
    g6 += String.fromCharCode(n + 63);

    var i1 = 0, tmp = 0;
    for(var j = 1; j < n; j++)
        for(var i = 0; i < j; i++){
            tmp <<= 1;
            tmp += adj[i][j];
            if(++i1 == 6)
            {
                i1 = 0;
                g6 += String.fromCharCode(63 + tmp);
                tmp = 0;
            }
        }
    if(i1 > 0) g6 += String.fromCharCode(63 + tmp);

    return g6;
};

var adjacency2bimatrix = function(adjacency)
{
    var n = adjacency.length;
    var V1 = [], V2 = [];
    var Q = [], color = [], j, i, tmp;
    Q.push(0);
    V1.push(0);
    color[0] = 1;
    while (Q.length > 0) {
        tmp = Q.shift();
        for (j = 0; j < n; j++)
            if (adjacency[tmp][j] && !color[j]) {
                Q.push(j);
                color[j] = color[tmp] ^ 3;
                if (color[j] == 1) V1.push(j);
                else V2.push(j);
            }
    }
    var b_matrix = new Array(V1.length);
    for (i = 0; i < V1.length; i++) b_matrix[i] = new Array(V2.length);
    for (i = 0; i < V1.length; i++)
        for (j = 0; j < V2.length; j++)
            b_matrix[i][j] = adjacency[V1[i]][V2[j]];
    return {
        bipartite_matrix: b_matrix,
        V1: V1,
        V2: V2,
        connected: (V1.length + V2.length == n)
    };
};

var g62bimatrix = function (graph) {
    var adjacency = this.g6_decrypt(graph);
    return adjacency2bimatrix(adjacency).bipartite_matrix;
};
//-------------------------------------------matrix Manipulations-------------------------------------------//
var matrix_normalize_min = function(matrix){
    var n = matrix.length;
    var m = matrix[0].length;
    var mi = matrix[0][0] + 1000;

    for(var i = 0; i < n; i++)
        for(var j = 0; j < m; j++)
            if(matrix[i][j]!=0) mi = Math.min(mi,matrix[i][j]);

    for(i = 0; i < n; i++)
        for(j = 0; j < m; j++)
            if(matrix[i][j]!=0) matrix[i][j] -= (mi-1);

    return matrix;
};

var matrix_copy = function(matrix)
{
    var n = matrix.length;
    var m = matrix[0].length;
    var ret = [];
    for(var i = 0; i < n; i++)
    {
        ret.push([]);
        for(var j = 0; j < m; j++)
        {
            ret[i].push(matrix[i][j]);
        }
    }
    return ret;
};

var matrix_swap_row = function(matrix, n1, n2)
{
    if(n1 == n2) return matrix;
    var row = matrix[n1];
    matrix[n1] = matrix[n2];
    matrix[n2] = row;

    return matrix;
};

var matrix_swap_col = function(matrix, m1, m2)
{
    var n = matrix.length;
    if(m1 == m2) return matrix;
    var tmp;
    for(var i = 0; i < n; i++)
    {
        tmp = matrix[i][m1];
        matrix[i][m1] = matrix[i][m2];
        matrix[i][m2] = tmp;
    }
    return matrix;
};

var matrix_find_non0 = function(matrix)
{
    var n = matrix.length;
    var m = matrix[0].length;
    for(var i = 0; i < n; i++)
        for(var j = 0; j < m; j++)
            if(matrix[i][j]!=0) return {
                row: i,
                col: j
            };

    return {
        row: -1,
        col: -1
    };
};