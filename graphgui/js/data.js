//-------------------------------------------Data-------------------------------------------//
var Data = function() {
    this.n1 = 4;
    this.n2 = 5;

    this.make_empty(this.n1,this.n2);
};

//-------------------------------------------set graph-------------------------------------------//
Data.prototype.set_graph = function(n1,n2) {
    this.n1 = n1;
    this.n2 = n2;

    this.make_empty(n1,n2);
};

//-------------------------------------------edges manipulation-------------------------------------------//
Data.prototype.make_adjacency = function() {
    this.adjacency = [];
    var n = this.n1 + this.n2;
    var node1, node2;
    for(var i = 0; i < n; i++) {
        this.adjacency.push([]);
        for (var j = 0; j < n; j++) {
            node1 = i;
            node2 = j;
            if (node1 > node2) {
                var tmp = node1;
                node1 = node2;
                node2 = tmp;
            }
            if (node1 < this.n1 && node2 >= this.n1)
                this.adjacency[i].push(this.edges[node1][node2 - this.n1]);
            else this.adjacency[i].push(0);
        }
    }
    return this.adjacency;
};

//-------------------------------------------edges manipulation-------------------------------------------//
Data.prototype.make_empty = function(n1,n2) {
    this.edges = [];
    for(var i = 0; i < n1; i++)
    {
        this.edges.push([]);
        for(var  j = 0; j < n2; j++) this.edges[i].push(0);
    }
};

Data.prototype.add_edge = function(node1, node2)
{
    this.edges[node1-1][node2-this.n1-1] = 1;
};

Data.prototype.remove_edge = function(node1, node2)
{
    this.edges[node1-1][node2-this.n1-1] = 0;
};

