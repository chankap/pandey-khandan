const treeData = {
  name: "Parag Pandey",
  children: [
    {
      name: "Harihar Pandey",
      children: [
        {
          name: "Balkeshwar Pandey",
          children: [
            {
              name: "Vijay Kumar Pandey"
            },
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
            {
              name: "Nagendra Pandey"
            },
            {
              name: "Pramod Pandey"
            }
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

// tree layout with gaps
const treeLayout = d3.tree().nodeSize([120, 150]);
treeLayout(root);

// Links (with sibling connectors)
const links = svg.selectAll(".link")
  .data(root.links())
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", d3.linkVertical()
    .x(d => d.x)
    .y(d => d.y)
  );

// Nodes
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
  .attr("r", 35)
  .attr("fill", "white")
  .attr("stroke", "#333")
  .attr("stroke-width", 2);

node.append("image")
  .attr("xlink:href", "assets/male.png")
  .attr("x", -30)
  .attr("y", -30)
  .attr("width", 60)
  .attr("height", 60);

node.append("text")
  .attr("dy", 45)
  .text(d => d.data.name);

// --- Drag functions ---
function dragStarted(event, d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("transform", `translate(${d.x},${d.y})`);

  // update links
  svg.selectAll(".link")
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y)
    );
}

function dragEnded(event, d) {
  d3.select(this).classed("active", false);
}
