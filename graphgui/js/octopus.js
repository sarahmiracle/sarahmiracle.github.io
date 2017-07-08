
//-------------------------------------------Octopus-------------------------------------------//
var Octopus = function() {
    this.data = new Data();

    var viewapi = {
        add_edge: this.add_edge(),
        remove_edge: this.remove_edge()
    };
    this.view = new View(viewapi);

    this.update_view();
    this.update_g6();
    //this.cy = this.view.cy;

    //this.make_sample_graph();
    //this.cy_functionality();
};

//-------------------------------------------view api-------------------------------------------//
Octopus.prototype.add_edge = function() //"n7", "n15"
{
    var me = this;
    var nested = function(node1, node2){
        node1 = parseInt(node1.substr(1));
        node2 = parseInt(node2.substr(1));
        me.data.add_edge(node1,node2);
        me.update_g6();
    };
    return nested;
};

Octopus.prototype.remove_edge = function() //"n7", "n14"
{
    var me = this;
    var nested = function(node1, node2){
        node1 = parseInt(node1.substr(1));
        node2 = parseInt(node2.substr(1));
        me.data.remove_edge(node1,node2);
        me.update_g6();
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

    if(n1 + n2 > 60)
    {
        alert("the number of nodes must not exceed 40");
        return;
    }

    this.data.set_graph(n1,n2);
    console.log(n1);
    console.log(n2);

    this.update_view();
    this.update_g6();
};

//-------------------------------------------update view-------------------------------------------//
Octopus.prototype.update_view = function() {
    var n1 = this.data.n1;
    var n2 = this.data.n2;
    this.view.update(n1,n2);
};

//-------------------------------------------g6 input output-------------------------------------------//
Octopus.prototype.update_g6 = function() {
    document.getElementById("graph_g6").innerHTML = g6_encrypt(this.data.adjacency);
};

Octopus.prototype.load_g6 = function(){
    var g6 = document.getElementById("g6_input").value;
    var adj = g6_decrypt(g6);
    var transformed_bip = adjacency2bimatrix(adj);
    if(!transformed_bip.connected)
    {
        alert("The graph is not connected");
        return;
    }

    this.data.change_graph(adj, transformed_bip);
    document.getElementById("n1").value = this.data.n1;
    document.getElementById("n2").value = this.data.n2;

    this.view.show_coloring(this.data.edges, "no_label", "new_nodes");

    this.update_g6();
};

var oct = new Octopus();