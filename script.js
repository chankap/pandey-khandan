const family = {
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

const treeEl = document.getElementById("tree");
const svg = document.getElementById("connections");

// Default avatars
const maleAvatar = "assets/male.svg";
const femaleAvatar = "assets/female.svg";

// Detect gender from name
function getDefaultAvatar(name) {
  const lower = name.toLowerCase();
  if (lower.includes("kumari") || lower.endsWith("a") || lower.endsWith("i") || lower.endsWith("e")) {
    return femaleAvatar;
  }
  return maleAvatar;
}

// Build tree recursively
function createMember(member, parentEl) {
  const memberEl = document.createElement("div");
  memberEl.classList.add("member");

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const img = document.createElement("img");
  img.src = getDefaultAvatar(member.name);
  circle.appendChild(img);

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  circle.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const label = document.createElement("div");
  label.classList.add("member-name");
  label.textContent = member.name;

  memberEl.appendChild(circle);
  memberEl.appendChild(input);
  memberEl.appendChild(label);

  parentEl.appendChild(memberEl);

  if (member.children && member.children.length > 0) {
    const genEl = document.createElement("div");
    genEl.classList.add("generation");
    memberEl.appendChild(genEl);

    member.children.forEach((child) => {
      createMember(child, genEl);
    });
  }
}

createMember(family, treeEl);

// Resize dynamically if too many siblings
function resizeCircles() {
  const gens = document.querySelectorAll(".generation");
  gens.forEach((gen) => {
    const members = gen.querySelectorAll(":scope > .member > .circle");
    if (members.length > 0) {
      const containerWidth = gen.getBoundingClientRect().width;
      const maxPerRow = members.length;
      let circleSize = Math.min(120, (containerWidth - 40) / maxPerRow - 20);
      circleSize = Math.max(60, circleSize);

      members.forEach((circle) => {
        circle.style.width = circleSize + "px";
        circle.style.height = circleSize + "px";
      });
    }
  });
}

// Draw lines (parent → children + sibling connectors)
function drawLines() {
  svg.innerHTML = "";
  const members = document.querySelectorAll(".member");

  members.forEach((member) => {
    const parentCircle = member.querySelector(":scope > .circle");
    const gen = member.querySelector(":scope > .generation");
    if (gen) {
      const children = Array.from(gen.querySelectorAll(":scope > .member > .circle"));
      if (children.length > 0) {
        const parentRect = parentCircle.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        const px = parentRect.left + parentRect.width / 2 - svgRect.left;
        const py = parentRect.bottom - svgRect.top;

        const childRects = children.map(c => c.getBoundingClientRect());
        const cx = childRects.map(r => r.left + r.width / 2 - svgRect.left);
        const cy = childRects.map(r => r.top - svgRect.top);

        const minX = Math.min(...cx);
        const maxX = Math.max(...cx);
        const midY = Math.min(...cy) - 20;

        // Horizontal sibling line
        const hline = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hline.setAttribute("x1", minX);
        hline.setAttribute("y1", midY);
        hline.setAttribute("x2", maxX);
        hline.setAttribute("y2", midY);
        hline.setAttribute("stroke", "#9ca3af");
        hline.setAttribute("stroke-width", "2");
        svg.appendChild(hline);

        // Parent to sibling line
        const vline = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vline.setAttribute("x1", px);
        vline.setAttribute("y1", py);
        vline.setAttribute("x2", px);
        vline.setAttribute("y2", midY);
        vline.setAttribute("stroke", "#9ca3af");
        vline.setAttribute("stroke-width", "2");
        svg.appendChild(vline);

        // Each child vertical line
        cx.forEach((x, i) => {
          const v = document.createElementNS("http://www.w3.org/2000/svg", "line");
          v.setAttribute("x1", x);
          v.setAttribute("y1", midY);
          v.setAttribute("x2", x);
          v.setAttribute("y2", cy[i]);
          v.setAttribute("stroke", "#9ca3af");
          v.setAttribute("stroke-width", "2");
          svg.appendChild(v);
        });
      }
    }
  });
}

function refresh() {
  resizeCircles();
  drawLines();
}

window.addEventListener("load", refresh);
window.addEventListener("resize", refresh);
