
//-------------------------------------------Octopus-------------------------------------------//
var Octopus = function() {
    this.data = new Data();

    viewapi = {
        add_edge: this.add_edge(),
        remove_edge: this.remove_edge()
    };
    this.view = new View(viewapi);

    this.update_view();
    //this.cy = this.view.cy;

    //this.make_sample_graph();
    //this.cy_functionality();
};

//-------------------------------------------view api-------------------------------------------//
Octopus.prototype.add_edge = function() //"n7", "n15"
{
    var me = this;
    var nested = function(node1, node2){
        var node1 = parseInt(node1.substr(1));
        var node2 = parseInt(node2.substr(1));
        me.data.add_edge(node1,node2);
    };
    return nested;
};

Octopus.prototype.remove_edge = function() //"n7", "n14"
{
    var me = this;
    var nested = function(node1, node2){
        var node1 = parseInt(node1.substr(1));
        var node2 = parseInt(node2.substr(1));
        me.data.remove_edge(node1,node2);
    };
    return nested;
};


//-------------------------------------------color-------------------------------------------//
Octopus.prototype.color = function()
{
    var adj = this.data.make_adjacency();

    var transformed_bip = adjacency2bimatrix(adj);
    if(!transformed_bip.connected)
    {
        alert("The graph is not connected");
        return;
    }

    var coloring = program(transformed_bip.bipartite_matrix);
    if(coloring == "can\'t find")
    {
        alert("could not find a coloring");
        return;
    }

    coloring = matrix_normalize_min(coloring);

    console.log(coloring);

    this.view.show_coloring(coloring, transformed_bip.V1, transformed_bip.V2);
};

//-------------------------------------------new graph-------------------------------------------//
Octopus.prototype.new_graph = function() {
    var n1 = document.getElementById("n1").value;
    var n2 = document.getElementById("n2").value;
    n1 = parseInt(n1);
    n2 = parseInt(n2);

    this.data.set_graph(n1,n2);
    console.log(n1);
    console.log(n2);

    this.update_view();
};

//-------------------------------------------update view-------------------------------------------//
Octopus.prototype.update_view = function() {
    var n1 = this.data.n1;
    var n2 = this.data.n2;
    this.view.update(n1,n2);
};


var oct = new Octopus();