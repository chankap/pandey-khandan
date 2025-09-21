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

const svg = d3.select("#tree")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(50,50)");

const root = d3.hierarchy(treeData);
const treeLayout = d3.tree().nodeSize([120, 150]);
treeLayout(root);

// --- Draw sibling connector + vertical father line ---
function drawLinks() {
  svg.selectAll(".link").remove();

  root.descendants().forEach(d => {
    if (d.children && d.children.length > 0) {
      // Horizontal sibling bar
      const minX = d3.min(d.children, c => c.x);
      const maxX = d3.max(d.children, c => c.x);
      const y = d.children[0].y - 50; // a bit above children

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
      const fatherY = d.y;
      const barY = y;
      svg.append("line")
        .attr("class", "link")
        .attr("x1", fatherX)
        .attr("y1", fatherY)
        .attr("x2", fatherX)
        .attr("y2", barY)
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 2);

      // Vertical lines to each child
      d.children.forEach(c => {
        svg.append("line")
          .attr("class", "link")
          .attr("x1", c.x)
          .attr("y1", y)
          .attr("x2", c.x)
          .attr("y2", c.y - 35) // circle radius
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

// Circle
node.append("circle")
  .attr("r", 35)
  .attr("fill", "white")
  .attr("stroke", "#333")
  .attr("stroke-width", 2);

// Avatar image
node.append("image")
  .attr("xlink:href", d => {
    const name = d.data.name.toLowerCase();
    if (name.includes("kumari") || name.endsWith("a") || name.endsWith("i") || name.endsWith("e")) {
      return "assets/female.svg";
    }
    return "assets/male.svg";
  })
  .attr("x", -30)
  .attr("y", -30)
  .attr("width", 60)
  .attr("height", 60);

// Name below circle
node.append("text")
  .attr("dy", 45)
  .text(d => d.data.name);

// --- Drag Functions ---
function dragStarted(event, d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
  drawLinks(); // Update lines dynamically
}

function dragEnded(event, d) {
  d3.select(this).classed("active", false);
}

// --- Initial draw of lines ---
drawLinks();
