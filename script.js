// ---------------------
// Family Data
// ---------------------
let treeData = {
  name: "Parag Pandey",
  children: [
    {
      name: "Harihar Pandey",
      children: [
        {
          name: "Balkeshwar Pandey",
          children: [
            { name: "Vijay Kumar Pandey" },
            {
              name: "Nand Kumar Pandey",
              children: [
                {
                  name: "Arun Kumar Pandey",
                  children: [
                    { name: "Himanshu Gaurav" },
                    { name: "Kumar Sudhanshu" }
                  ]
                },
                {
                  name: "Uday Kumar Pandey",
                  children: [
                    { name: "Nityam Kumar" },
                    { name: "Sanjana Kumari", gender: "female" }
                  ]
                },
                {
                  name: "Dhananjay Kumar Pandey",
                  children: [
                    { name: "Harshit Kumar Pandey" },
                    { name: "Suhani Kumari", gender: "female" }
                  ]
                }
              ]
            },
            { name: "Nagendra Pandey" },
            { name: "Pramod Pandey" }
          ]
        },
        { name: "Kameshwar Pandey" },
        { name: "Ramchandar Pandey" },
        { name: "Deepnarayan Pandey" }
      ]
    }
  ]
};

// ---------------------
// Configuration
// ---------------------
const width = window.innerWidth;
const height = window.innerHeight;
const minRadius = 25;
const maxRadius = 35;
const minFont = 10;
const maxFont = 14;
const paddingY = 20;           // general padding below each node
const parentChildPadding = 40; // extra space between parent & children
const generationSpacing = 50;  // extra space between generations

// ---------------------
// Create SVG with zoom/pan
// ---------------------
const svgRoot = d3.select("#tree")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const svg = svgRoot.append("g");

svgRoot.call(d3.zoom()
  .scaleExtent([0.5, 2])
  .on("zoom", (event) => {
    svg.attr("transform", event.transform);
  })
);

// ---------------------
// Node Helpers
// ---------------------
function getNodeRadius(node) {
  const siblings = node.parent ? node.parent.children.length : 1;
  let radius = maxRadius;
  if (siblings > 4) {
    radius = Math.max(minRadius, maxRadius - (siblings - 4) * 2);
  }
  return radius;
}

function getFontSize(node) {
  const siblings = node.parent ? node.parent.children.length : 1;
  let font = maxFont;
  if (siblings > 4) {
    font = Math.max(minFont, maxFont - (siblings - 4));
  }
  return font;
}

function getNameLines(node) {
  return node.data.name.split(" ").length;
}

function getNodeSpacing(node) {
  const extra = node.children && node.children.length > 0 ? parentChildPadding : 0;
  return getNodeRadius(node) + getNameLines(node) * getFontSize(node) + paddingY + extra + generationSpacing;
}

// ---------------------
// Recursive Y Position Adjust
// ---------------------
function adjustNodeY(node, startY = 0) {
  node.y = startY;
  if (node.children && node.children.length > 0) {
    let currentY = startY + getNodeSpacing(node);
    node.children.forEach(child => adjustNodeY(child, currentY));
  }
}

// ---------------------
// Tree Layout
// ---------------------
const treeLayout = d3.tree().nodeSize([120, 100]);

// ---------------------
// Draw Links
// ---------------------
function drawLinks(root) {
  svg.selectAll(".link").remove();
  root.descendants().forEach(d => {
    if (d.children && d.children.length > 0) {
      const minX = d3.min(d.children, c => c.x);
      const maxX = d3.max(d.children, c => c.x);
      const y = d.children[0].y - getNodeRadius(d.children[0]) - 15;

      // Horizontal sibling line
      svg.append("line")
        .attr("class", "link")
        .attr("x1", minX)
        .attr("y1", y)
        .attr("x2", maxX)
        .attr("y2", y)
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 2);

      // Vertical line to parent
      const fatherX = d.x;
      const fatherY = d.y + getNodeRadius(d) - 5;
      svg.append("line")
        .attr("class", "link")
        .attr("x1", fatherX)
        .attr("y1", fatherY)
        .attr("x2", fatherX)
        .attr("y2", y)
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 2);

      // Vertical lines to each child
      d.children.forEach(c => {
        const childY = c.y - getNodeRadius(c) + 5;
        svg.append("line")
          .attr("class", "link")
          .attr("x1", c.x)
          .attr("y1", y)
          .attr("x2", c.x)
          .attr("y2", childY)
          .attr("stroke", "#9ca3af")
          .attr("stroke-width", 2);
      });
    }
  });
}

// ---------------------
// Draw Nodes
// ---------------------
function drawNodes(root) {
  const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded)
    );

  node.append("circle")
    .attr("r", d => getNodeRadius(d))
    .attr("fill", "white")
    .attr("stroke", "#333")
    .attr("stroke-width", 2);

  // CSS-based avatar
  node.each(function(d) {
    const radius = getNodeRadius(d);
    const isFemale = d.data.gender === "female" || d.data.name.toLowerCase().includes("kumari");
    const g = d3.select(this);

    // Head
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", -radius / 2)
      .attr("r", radius / 3)
      .attr("fill", isFemale ? "pink" : "lightblue")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5);

    // Body
    if (isFemale) {
      const points = [
        [0, -radius / 6],
        [-radius / 2, radius / 2],
        [radius / 2, radius / 2]
      ].map(p => p.join(",")).join(" ");
      g.append("polygon")
        .attr("points", points)
        .attr("fill", "pink")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    } else {
      g.append("rect")
        .attr("x", -radius / 3)
        .attr("y", -radius / 6)
        .attr("width", (radius / 3) * 2)
        .attr("height", radius * 0.8)
        .attr("fill", "lightblue")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    }
  });

  // Name with word-wrap
  node.append("text")
    .attr("y", d => getNodeRadius(d) + 10)
    .attr("text-anchor", "middle")
    .style("font-size", d => getFontSize(d) + "px")
    .each(function(d) {
      const g = d3.select(this);
      const words = d.data.name.split(" ");
      const lineHeight = getFontSize(d) + 2;
      words.forEach((word, i) => {
        g.append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? 0 : lineHeight)
          .text(word);
      });
    });
}

// ---------------------
// Drag Functions
// ---------------------
function dragStarted(event, d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
  drawLinks(root);
}

function dragEnded(event, d) {
  d3.select(this).classed("active", false);
}

// ---------------------
// Add Member Dynamically
// ---------------------
function addMember(parentName, memberName, gender) {
  function findParent(node, name) {
    if (node.name === name) return node;
    if (!node.children) return null;
    for (let child of node.children) {
      const res = findParent(child, name);
      if (res) return res;
    }
    return null;
  }

  const parentNode = findParent(treeData, parentName);
  if (!parentNode) {
    alert("Parent not found!");
    return;
  }

  if (!parentNode.children) parentNode.children = [];
  parentNode.children.push({ name: memberName, gender });

  redrawTree();
}

// ---------------------
// Redraw Tree
// ---------------------
function redrawTree() {
  svg.selectAll("*").remove();
  const root = d3.hierarchy(treeData);
  treeLayout(root);
  adjustNodeY(root, 0);
  drawLinks(root);
  drawNodes(root);
}

// ---------------------
// Initialize Tree
// ---------------------
const root = d3.hierarchy(treeData);
treeLayout(root);
adjustNodeY(root, 0);
drawLinks(root);
drawNodes(root);

// ---------------------
// Form Listener
// ---------------------
document.getElementById("addMemberBtn").addEventListener("click", () => {
  const parentName = document.getElementById("parentName").value.trim();
  const memberName = document.getElementById("memberName").value.trim();
  const gender = document.getElementById("gender").value;
  if (!parentName || !memberName) {
    alert("Please enter both parent and member names.");
    return;
  }
  addMember(parentName, memberName, gender);
});
