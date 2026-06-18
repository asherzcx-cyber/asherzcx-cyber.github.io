let sizee = 50;
let nodeSize = 6;

let nodes = [];
let edges = [];

// Axon-inspired palette
let nodeInnerColor = [155, 163, 220];   // bright soft blue
let nodeGlowColor  = [106, 114, 174];   // mid blue
let edgeColor      = [106, 114, 174];   // same family as background
let edgeGlowColor  = [66, 78, 139];     // darker glow

function setup() {
    let canvas = createCanvas(300, 300);
    canvas.parent("hypercube_place");

    buildHypercube();
}

function buildHypercube() {
    nodes = [];
    edges = [];

    // Create 16 vertices of a tesseract
    for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
            for (let z = -1; z <= 1; z += 2) {
                for (let w = -1; w <= 1; w += 2) {
                    nodes.push([
                        x * sizee,
                        y * sizee,
                        z * sizee,
                        w * sizee
                    ]);
                }
            }
        }
    }

    // Connect vertices that differ in exactly one coordinate
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let diff = 0;

            for (let k = 0; k < 4; k++) {
                if (nodes[i][k] !== nodes[j][k]) {
                    diff++;
                }
            }

            if (diff === 1) {
                edges.push([i, j]);
            }
        }
    }
}

function rotate4D(a, b, theta) {
    let s = sin(theta);
    let c = cos(theta);

    for (let i = 0; i < nodes.length; i++) {
        let p = nodes[i];
        let pa = p[a];
        let pb = p[b];

        p[a] = pa * c - pb * s;
        p[b] = pa * s + pb * c;
    }
}

function projectPoint(p) {
    let x = p[0];
    let y = p[1];
    let z = p[2];
    let w = p[3];

    // 4D -> 3D perspective
    let d4 = 350;
    let f4 = d4 / (d4 - w);
    x *= f4;
    y *= f4;
    z *= f4;

    // 3D -> 2D perspective
    let d3 = 400;
    let f3 = d3 / (d3 - z);
    x *= f3;
    y *= f3;

    return [x, y];
}

function draw() {
    clear();

    translate(width / 2, height / 2);

    drawEdges();
    drawNodes();

    // Smooth continuous rotation
    rotate4D(0, 3, 0.01);
    rotate4D(1, 2, 0.008);
    rotate4D(0, 2, 0.006);
}

function drawEdges() {
    for (let e = 0; e < edges.length; e++) {
        let a = edges[e][0];
        let b = edges[e][1];

        let p1 = projectPoint(nodes[a]);
        let p2 = projectPoint(nodes[b]);

        // Outer soft glow line
        stroke(edgeGlowColor[0], edgeGlowColor[1], edgeGlowColor[2], 35);
        strokeWeight(5);
        line(p1[0], p1[1], p2[0], p2[1]);

        // Main line
        stroke(edgeColor[0], edgeColor[1], edgeColor[2], 180);
        strokeWeight(2);
        line(p1[0], p1[1], p2[0], p2[1]);
    }
}

function drawNodes() {
    noStroke();

    for (let n = 0; n < nodes.length; n++) {
        let p = projectPoint(nodes[n]);

        // Outer glow
        fill(nodeGlowColor[0], nodeGlowColor[1], nodeGlowColor[2], 35);
        ellipse(p[0], p[1], 14, 14);

        // Inner node
        fill(nodeInnerColor[0], nodeInnerColor[1], nodeInnerColor[2], 220);
        ellipse(p[0], p[1], nodeSize, nodeSize);
    }
}

function mouseDragged() {
    rotate4D(0, 3, (mouseX - pmouseX) * 0.005);
    rotate4D(1, 2, (mouseY - pmouseY) * 0.005);
}