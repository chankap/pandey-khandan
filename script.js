const treeData = {
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
                    { name: "Sanjana Kumari" }
                  ]
                },
                {
                  name: "Dhananjay Kumar Pandey",
                  children: [
                    { name: "Harshit Kumar Pandey" },
                    { name: "Suhani Kumari" }
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

const width = window.innerWidth;
const height = window.innerHeight;
const minRadius = 25;
const maxRadius = 35;
const minFont = 10;
const maxFont = 14;
const paddingY = 20; // extra vertical spacing

// --- Create SVG with zoom/pan ---
const svgRoot = d3.select("#tree")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const svg = svgRoot.append("g");

// Zoom behavior
svgRoot.call(d3.zoom()
  .scaleExtent([0.5, 2])
  .on("zoom", (event) => {
    svg.attr("transform", event.transform);
  })
);

// --- Node radius and font scaling ---
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

// --- Compute name line count ---
function getNameLines(node) {
  return node.data.name.split(" ").length;
}

// --- Dynamic vertical spacing based on name lines ---
function getNodeSpacing(node) {
  return getNodeRadius(node) + getNameLines(node) * getFontSize(node) + paddingY;
}

// --- Recursively adjust y positions based on vertical spacing ---
function adjustNodeY(node, startY = 0) {
  node.y = startY;
  if (node.children && node.children.length > 0) {
    let currentY = startY + getNodeSpacing(node);
    node.children.forEach(child => {
      adjustNodeY(child, currentY);
    });
  }
}

// --- Initialize tree layout ---
const root = d3.hierarchy(treeData);

// Set x spacing arbitrarily
const treeLayout = d3.tree().nodeSize([120, 100]);
treeLayout(root);

// Apply dynamic vertical spacing
adjustNodeY(root, 0);

// --- Center root horizontally ---
const rootX = root.x;
const initialOffsetX = width / 2 - rootX;
const initialOffsetY = 100;
svg.attr("transform", `translate(${initialOffsetX}, ${initialOffsetY})`);

// --- Draw sibling/father lines ---
function drawLinks() {
  svg.selectAll(".link").remove();

  root.descendants().forEach(d => {
    if (d.children && d.children.length > 0) {
      const minX = d3.min(d.children, c => c.x);
      const maxX = d3.max(d.children, c => c.x);
      const y = d.children[0].y - getNodeRadius(d.children[0]) - 15;

      // Horizontal sibling bar
      svg.append("line")
        .attr("class", "link")
        .attr("x1", minX)
        .attr("y1", y)
        .attr("x2", maxX)
        .attr("y2", y)
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 2);

      // Vertical line to father
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

// --- Nodes ---
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

// --- CSS avatars ---
node.each(function(d) {
  const radius = getNodeRadius(d);
  const isFemale = d.data.name.toLowerCase().includes("kumari") || d.data.name.toLowerCase().endsWith("a");
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

// --- Name with word-wrap ---
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

// --- Drag ---
function dragStarted(event, d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
  drawLinks();
}

function dragEnded(event, d) {
  d3.select(this).classed("active", false);
}

// --- Initial draw ---
drawLinks();
