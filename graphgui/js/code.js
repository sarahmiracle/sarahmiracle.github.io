$(document).ready(function() {

    var cy = cytoscape({

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
            }*/
        ],

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
            rows: 1
        }

    });

    n1 = 4;
    n2 = 5;

    for(var i = 1; i <= n1; i++)
    {
        var eles = cy.add(
            { group: "nodes", data: { id: "n"+i }, position: { x: 100 * (i-1), y: 100} }
        );
        cy.$('#n' + (i)).lock();
    }
    for(var i = 1; i <= n2; i++)
    {
        var eles = cy.add(
            { group: "nodes", data: { id: "n" + (n1+i) }, position: { x: 100 * (n1-1) / (n2-1) * (i-1), y: 500} }
        );
        cy.$('#n' + (n1+i)).lock();
    }

    cy.fit(undefined, 15);
    cy.userPanningEnabled(false);


    /*cy.on('tap', 'node', function(evt){
        var node = evt.target;
        console.log( 'tapped ' + node.id() );
    });*/

    cy.on('tap', 'edge', function(evt){
        var edge = evt.target;
        console.log( 'tapped ' + edge.id() );
        var j = cy.$("#" + edge.id());
        cy.remove( j );
    });

    //cy.add({ group: "edges", data: { id: "e1", source: "n17", target: "n7" } });
    var down = -1;
    cy.on('mousedown', 'node', function(evt){
        var node = evt.target;
        console.log( 'down ' + node.id() );
        down = node.id();
    });

    cy.on('mouseup', 'node', function(evt){
        var node = evt.target;
        console.log( 'up ' + node.id() );
        var up = node.id();

        console.log(down + " " + up);
        if(parseInt(up.substr(1)) <= n1 && parseInt(down.substr(1)) > n1 ||
            parseInt(up.substr(1)) > n1 && parseInt(down.substr(1)) <= n1)
            cy.add({ group: "edges", data: { id: "e"+down + up, source: down, target: up } });
    });

    cy.on('mouseup', function(event){
        // target holds a reference to the originator
        // of the event (core or element)
        var evtTarget = event.target;

        if( evtTarget === cy ){
            down = -1;
            console.log('mouseup on background');
        }
    });

});