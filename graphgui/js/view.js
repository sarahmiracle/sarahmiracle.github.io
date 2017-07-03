
//-------------------------------------------View-------------------------------------------//
var View = function(octapi) {
    this.octapi = octapi;

    this.cy = cytoscape({
        container: document.getElementById('cy'), // container to render in

        elements: [ /*// list of graph elements to start with
         { // node a
         data: {id: 'a'}
         },
         { // node b
         data: {id: 'b'}
         },
         { // edge ab
         data: {id: 'ab', source: 'a', target: 'b'}
         }*/],

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],

        layout: {
            name: 'grid',
            rows: 2
        }

    });

    this.width = document.getElementById('cy').offsetWidth;
    this.height = document.getElementById('cy').offsetHeight;

    this.sizes = {
        n1: 4,
        n2: 5
    };
    //add functionality
    this.cy_functionality(this.sizes, octapi);
};

//-------------------------------------------update-------------------------------------------//
View.prototype.update = function(n1, n2) {
    this.cy.remove(this.cy.nodes());
    this.sizes.n1 = n1;
    this.sizes.n2 = n2;

    //creating nodes
    var dx1 = this.width / 2, dx2 = this.width / 2;
    if(n1>1) dx1 = this.width / (n1-1);
    if(n2>1) dx2 = this.width / (n2-1);

    for(var i = 1; i <= n1; i++)
    {
        this.cy.add(
            { group: "nodes", data: { id: "n"+i }, position: { x: dx1 * (i-1), y: 0} }
        );
        this.cy.$('#n' + (i)).lock();
    }
    for(i = 1; i <= n2; i++)
    {
        var id = n1+i;
        this.cy.add(
            { group: "nodes", data: { id: "n" + id }, position: { x: dx2 * (i-1), y: this.height} }
        );
        this.cy.$('#n' + id).lock();
    }
    this.cy.fit(undefined, 15);
    this.cy.userPanningEnabled(false);

};
//-------------------------------------------functionality-------------------------------------------//

View.prototype.cy_functionality = function(sizes, octapi) {
    var cy = this.cy;
    cy.on('tap', 'edge', function(evt){
        var edge = evt.target;
        console.log( 'tapped ' + edge.id() );
        var j = cy.$("#" + edge.id());
        cy.remove( j );

        /*console.log(edge.source().id());
        console.log(edge.target().id());*/

        octapi.remove_edge(edge.source().id(), edge.target().id());
    });

    var down = -1;
    this.cy.on('mousedown', 'node', function(evt){
        var node = evt.target;
        console.log( 'down ' + node.id() );
        down = node.id();
    });

    this.cy.on('mouseup', 'node', function(evt){
        if(down == -1) return;

        var node = evt.target;
        console.log( 'up ' + node.id() );
        var up = node.id();

        console.log(this.down + " " + up);

        var node1 = parseInt(down.substr(1));
        var node2 = parseInt(up.substr(1));
        if(node1 > node2) //swap
        {
            var tmp = node1;
            node1 = node2;
            node2 = tmp;
            tmp = down;
            down = up;
            up = tmp;
        }

        if(node1  <= sizes.n1 && node2 > sizes.n1 ) {
            cy.add({
                group: "edges",
                data: {
                    id: "e" + down + up, //en11n75
                    source: down,
                    target: up
                }/*, style:
                 {
                 "source-label" : up.substr(1),
                 "source-text-offset": 100,
                 "target-label" : down.substr(1),
                 "target-text-offset": 100
                 }*/
            });

            octapi.add_edge(down, up);
        }

    });

    this.cy.on('mouseup', function(event){
        var evtTarget = event.target;
        console.log(evtTarget);
        if( evtTarget === cy ){
            down = -1;
            console.log('mouseup on background');
        }
    });
};


View.prototype.show_coloring = function(coloring, V1, V2)
{

    this.cy.remove(this.cy.edges());
    var n1 = coloring.length;
    var n2 = coloring[0].length;

    this.sizes.n1 = n1;
    this.sizes.n2 = n2;

    for(var i = 0; i < n1; i++)
        for(var j =0; j < n2; j++)
        {
            if(coloring[i][j]!=0)
            {
                if(V1 === undefined)
                {
                    var node1 = "n" + (i + 1);
                    var node2 = "n" + (j + n1 + 1);
                }
                else
                {
                    var node1 = "n" + (V1[i] + 1);
                    var node2 = "n" + (V2[j] + 1);
                }
                this.cy.add({
                    group: "edges",
                    data: {
                        id: "e" + node1 + node2, //en11n75
                        source: node1,
                        target: node2
                    }, style:
                     {
                     "source-label" : coloring[i][j],
                     "source-text-offset": 100,
                     "target-label" : coloring[i][j],
                     "target-text-offset": 100
                     }
                });
            }

        }
}