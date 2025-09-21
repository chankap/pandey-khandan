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

// Setup tree layout
const width = window.innerWidth;
const height = window.innerHeight;
const svg = d3.select("#tree")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(50,50)");

const root = d3.hierarchy(treeData);
const treeLayout = d3.tree().size([width - 200, height - 200]);
treeLayout(root);

// Links (father to child)
svg.selectAll(".link")
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
  .attr("transform", d => `translate(${d.x},${d.y})`);

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
