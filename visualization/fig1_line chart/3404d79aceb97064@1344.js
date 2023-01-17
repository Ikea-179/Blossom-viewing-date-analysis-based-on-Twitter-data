import define1 from "./26670360aa6f343b@202.js";

function _legend(d3,DOM,svg)
{
  const endColor = d3.schemePaired[2]
  const startColor = d3.schemePaired[3]
  const arrowId = DOM.uid("arrow");
  const gradientId = DOM.uid("gradient");
  function arc(x1, y1, x2, y2) {
  const r = Math.hypot(x1 - x2, y1 - y2) * 2;
  return `
    M${x1},${y1}
    A${r},${r} 0,0,1 ${x2},${y2}
  `;
}
  return svg`<svg width="180" height="40" style="display: block; font: 10px sans-serif;">
  <defs>
    <linearGradient id="${gradientId.id}" gradientUnits="userSpaceOnUse" x1="33" x2="149">
      <stop stop-color="${startColor}" stop-opacity="0.5"></stop>
      <stop stop-color="${endColor}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <path fill="none" stroke-width=4 stroke="${gradientId}" marker-end="${arrowId}" d="${arc(33, 16.5, 149, 16.5)}"></path>
  <circle cx="33" cy="16.5" r="2.5"  fill='#5C4033'></circle>
  <text x="4" y="28" dy="0.36em" text-anchor="start" font-size='18')>start time</text>
  <text x="176" y="28" dy="0.36em" text-anchor="end" font-size='18'>end time</text>
</svg>`;
}


async function _chart(d3,FileAttachment,width,DOM,sunflowerUrl,cherryurl,roseurl,daffodilurl,irisurl,Tulipurl,lavenderurl,pincushionurl,lilyurl,chrysamthemumurl)
{

  const endColor = d3.schemePaired[2]
  const startColor = d3.schemePaired[3]

  const height = 640
  const margin = ({top: 24, right: 10, bottom: 34, left: 40})
  
  const data = Object.assign(d3.csvParse(await FileAttachment("flowers.csv").text(), d3.autoType), {
  x: "Month →",
  y: "↑ Length of Blossom/days"
  })

  const x = d3.scaleLinear()
    .domain(padLinear(d3.extent(data.flatMap(d => [d.start, d.end])), 0.1))
    .rangeRound([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain(padLinear(d3.extent(data.flatMap(d => [d.zero, d.length])), 0.1))
    .rangeRound([height - margin.bottom, margin.top+10]);

  function padLinear([x0, x1], k) {
  const dx = (x1 - x0) * k / 2;
  return [x0 - dx, x1 + dx];
}
  function padLog(x, k) {
  return padLinear(x.map(Math.log), k).map(Math.exp);
}
  
  function arc(x1, y1, x2, y2) {
  const r = Math.hypot(x1 - x2, y1 - y2) * 2;
  return `
    M${x1},${y1}
    A${r},${r} 0,0,1 ${x2},${y2}
  `;
}
  const grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right));

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(months)).style("font-size","20")
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .attr('font-size', 22)
        .text(data.x));

  const months = d3.scaleOrdinal()
    .domain(['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sept','Oct'])
    .range([x(1), x(2), x(3), x(4), x(5), x(6), x(7), x(8), x(9), x(10), x(11), x(12)]);

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)).style("font-size","20")
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 22)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr('font-size', 22)
        .text(data.y));

  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const arrowId = DOM.uid("arrow");
  const gradientIds = data.map(() => DOM.uid("gradient"));


  svg.append("defs")
    .selectAll("linearGradient")
    .data(data)
    .join("linearGradient")
      .attr("id", (d, i) => gradientIds[i].id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => x(d.start))
      .attr("x2", d => x(d.end))
      .attr("y1", d => y(d.zero))
      .attr("y2", d => y(d.length))
      .call(g => g.append("stop").attr("stop-color", startColor).attr("stop-opacity", 0.5))
      .call(g => g.append("stop").attr("offset", "100%").attr("stop-color", endColor));
  
  svg.append("g")
      .call(grid);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .attr("fill", "none")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("stroke", (d, i) => gradientIds[i])
      .attr('stroke-width',4)
      .attr("d", d => arc(x(d.start), y(d.zero), x(d.end), y(d.length)))
      .on('mouseenter', mouseEnter)
      .on('mouseleave', mouseLeave);

  
  svg.append("g")
      .attr("fill", '#5C4033')
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 2.75)
      .attr("cx", d => x(d.start))
      .attr("cy", d => y(d.zero));

  
  // handle hovering over a line
  function mouseEnter(event, d) {
    d3.select(this)
        .attr('stroke-width',7)
        .attr("stroke",  '#238E23');
  }

  // handle leaving the line
  function mouseLeave(event, d) { 

    d3.select(this)
        .attr('stroke-width',4);
  }

  
  svg.append("image")
    .attr("xlink:href", sunflowerUrl)
    .attr("x", x(10.5)-55)
    .attr("y", y(45)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);
  
   svg.append("image")
    .attr("xlink:href", cherryurl)
    .attr("x", x(6.5)-55)
    .attr("y", y(22.5)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

    svg.append("image")
    .attr("xlink:href", roseurl)
    .attr("x", x(4.75)-55)
    .attr("y", y(112.5)-55)
    .attr("width", 110)
    .attr("height", 110)
   .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

    svg.append("image")
    .attr("xlink:href", daffodilurl)
    .attr("x", x(5.25)-55)
    .attr("y", y(67.5)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

    svg.append("image")
    .attr("xlink:href", irisurl)
    .attr("x", x(8)-55)
    .attr("y", y(60)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

    svg.append("image")
    .attr("xlink:href", Tulipurl)
    .attr("x", x(6.75)-55)
    .attr("y", y(52.5)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

   svg.append("image")
    .attr("xlink:href", lavenderurl)
    .attr("x", x(9.75)-55)
    .attr("y", y(52.5)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

   svg.append("image")
    .attr("xlink:href", pincushionurl)
    .attr("x", x(11.5)-55)
    .attr("y", y(97.5)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

   svg.append("image")
    .attr("xlink:href", lilyurl)
    .attr("x", x(9)-55)
    .attr("y", y(90)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

  svg.append("image")
    .attr("xlink:href", chrysamthemumurl)
    .attr("x", x(12.5)-55)
    .attr("y", y(120)-55)
    .attr("width", 110)
    .attr("height", 110)
    .on('mouseenter', mouseEnter2)
    .on('mouseleave', mouseLeave2);

  // handle hovering over a  flower
  function mouseEnter2(event, d) {
     d3.select(this)
        .attr("width", 120)
        .attr("height", 120);
  }

  // handle leaving the flower
  function mouseLeave2(event, d) {
    d3.select(this)
        .attr("width",110 )
        .attr("height", 110);
  }

     svg.append("g")
      .attr("fill",  'transparent')
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 40)
      .attr("cx", d => x(d.end))
      .attr("cy", d => y(d.length))
      .on('mouseenter', mouseEnter3)
      .on('mouseleave', mouseLeave3);

    // handle hovering over a circle
  function mouseEnter3(event, d) {
    // update the label's text and get its width
    tooltipText.text(d.name_display);
    tooltipText2.text(d.start_display);
    tooltipText3.text(d.end_display);
    const labelWidth = tooltipText.node().getComputedTextLength();
    // set the width of the tooltip's background rectangle
    // to match the width of the label, plus some extra space
    tooltipRect.attr('width', labelWidth + 6);
    // move the tooltip to the position of the circle (offset by a bit)
    // and make the tooltip visible
    const xPos = x(d.end)-labelWidth;
    const yPos = y(d.length);

    tooltip.attr('transform', `translate(${xPos},${yPos})`)
        .attr('visibility', 'visible');
  }

  // handle leaving the circle
  function mouseLeave3(event, d) { 
    // make the tooltip invisible
    tooltip
        .attr('visibility', 'hidden');
  }

  const tooltip = svg.append('g')
      .attr('visibility', 'hidden')
  const tooltipHeight = 62;
  // add a rectangle to the tooltip to serve as a background
  const tooltipRect = tooltip.append('rect')
      .attr('fill', 'black')
      .attr('rx', 5)
      .attr('height', tooltipHeight)
  // add a text element to the tooltip to contain the label
  const tooltipText = tooltip.append('text')
      .attr('fill', 'white')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16)
      .attr('y', 4) // offset it from the edge of the rectangle
      .attr('x', 4) // offset it from the edge of the rectangle
      .attr('dominant-baseline', 'hanging')
  const tooltipText2 = tooltip.append('text')
      .attr('fill', 'white')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16)
      .attr('y', 23) // offset it from the edge of the rectangle
      .attr('x', 4) // offset it from the edge of the rectangle
      .attr('dominant-baseline', 'hanging')
   const tooltipText3 = tooltip.append('text')
      .attr('fill', 'white')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16)
      .attr('y', 42) // offset it from the edge of the rectangle
      .attr('x', 4) // offset it from the edge of the rectangle
      .attr('dominant-baseline', 'hanging')

  svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function zoomed({transform}) {
    svg.attr("transform", transform);
  }


  return svg.node();
  
}


function _sunflowerUrl(FileAttachment){return(
FileAttachment("sunflower@4.png").url()
)}

function _cherryurl(FileAttachment){return(
FileAttachment("cherry@2.png").url()
)}

function _roseurl(FileAttachment){return(
FileAttachment("rose@1.png").url()
)}

function _daffodilurl(FileAttachment){return(
FileAttachment("daffodil@1.png").url()
)}

function _irisurl(FileAttachment){return(
FileAttachment("Iris@1.png").url()
)}

function _Tulipurl(FileAttachment){return(
FileAttachment("tulip@1.png").url()
)}

function _lavenderurl(FileAttachment){return(
FileAttachment("lavender.png").url()
)}

function _pincushionurl(FileAttachment){return(
FileAttachment("pincushion.png").url()
)}

function _lilyurl(FileAttachment){return(
FileAttachment("lily.png").url()
)}

function _chrysamthemumurl(FileAttachment){return(
FileAttachment("chrysamthemum.png").url()
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["rose@1.png", {url: new URL("./files/32ea49a3933a95c34803592be99fc42d7ee47b59cc0dcdb690682e0b1ceaefe613d7e24625d29ddc00e42fe39bd7b2ae19bbb838f3611a05b880f5d9e547bea7", import.meta.url), mimeType: "image/png", toString}],
    ["daffodil@1.png", {url: new URL("./files/00baf8273a9c82ae9c2ed646081c158f4930ee95fe4af5589b8546b4df23945e28fca606b0334413864b5da8bb2b94636a0281b62608ce1562098ba67b7505c5", import.meta.url), mimeType: "image/png", toString}],
    ["Iris@1.png", {url: new URL("./files/ab8e988fec73ed3f071b388e3d87e852cb558a5522340faedfb7bd948aeb272249a23ce3555477b59a55b2aacc9883865d956c8afe5de9387dc0a401c42b5884", import.meta.url), mimeType: "image/png", toString}],
    ["tulip@1.png", {url: new URL("./files/c920cb879d6dcc3e783b571e18845861c1f43922dcb14350f47553fad4281284e1bad29e428c94328e7f3c802db248e407515faab965309c589b8a8086fce05e", import.meta.url), mimeType: "image/png", toString}],
    ["lavender.png", {url: new URL("./files/02780c00805736edf93e1a371907087b6a7a6a4a072226720212a29a26bdb1dfc4a3b9249a21c077e38bd904aec7eb738085b39a2f4218aef82fd1fec50b7d30", import.meta.url), mimeType: "image/png", toString}],
    ["pincushion.png", {url: new URL("./files/9ef54ef2cf98d67a1d5f185c691b3e3ab1dcc8d0f67a59aa11f0ef76e12b1515568da57fe5fed1c18a1b8cee4e43ee6697ad75a0d277cbff07defd054d14302b", import.meta.url), mimeType: "image/png", toString}],
    ["sunflower@4.png", {url: new URL("./files/062162b8d57646ecba0f1c784fbe0f4f500a8749af8a21fba2e1274b4b35d8484b97d08c2c4c277aab05323d3d8530e15e88ccde7be5562e2e59799d73f5fc6b", import.meta.url), mimeType: "image/png", toString}],
    ["cherry@2.png", {url: new URL("./files/a27ad735974990d4fa4ee734b050f4568500de60598838f459fb4df9439019eb48956e5d5f2276b02d03b730ccd7868a4729ecfd1987fcfab773a1282cc32a91", import.meta.url), mimeType: "image/png", toString}],
    ["lily.png", {url: new URL("./files/e8f7cd52d54828711d9dd75931d7c78554502d876e0026177da0ebf3716cd9cc3d6e55051fab9f847e2712ca8e06cd9cab91e6cab592ddd5d46965053f322fc8", import.meta.url), mimeType: "image/png", toString}],
    ["chrysamthemum.png", {url: new URL("./files/38dbb78daed60b7f1a18bfcfb28448ff73d600d0b3de7c7df8241165eef8b2120f443f4c6ee2a67fccf3c1e2bb1ae089f5c51aaf1435e23fe784aa0336451415", import.meta.url), mimeType: "image/png", toString}],
    ["flowers.csv", {url: new URL("./files/67e922ac9610b7a94a0032494ea9eb1210a186f9c67ce4b347685e6fef4b57a3b23ee1a6a0beef17734c36e9dd63b535da7b817ac9018f514f60eb3c91e1bcea", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("legend")).define("legend", ["d3","DOM","svg"], _legend);
  main.variable(observer("chart")).define("chart", ["d3","FileAttachment","width","DOM","sunflowerUrl","cherryurl","roseurl","daffodilurl","irisurl","Tulipurl","lavenderurl","pincushionurl","lilyurl","chrysamthemumurl"], _chart);
  main.variable(observer("sunflowerUrl")).define("sunflowerUrl", ["FileAttachment"], _sunflowerUrl);
  main.variable(observer("cherryurl")).define("cherryurl", ["FileAttachment"], _cherryurl);
  main.variable(observer("roseurl")).define("roseurl", ["FileAttachment"], _roseurl);
  main.variable(observer("daffodilurl")).define("daffodilurl", ["FileAttachment"], _daffodilurl);
  main.variable(observer("irisurl")).define("irisurl", ["FileAttachment"], _irisurl);
  main.variable(observer("Tulipurl")).define("Tulipurl", ["FileAttachment"], _Tulipurl);
  main.variable(observer("lavenderurl")).define("lavenderurl", ["FileAttachment"], _lavenderurl);
  main.variable(observer("pincushionurl")).define("pincushionurl", ["FileAttachment"], _pincushionurl);
  main.variable(observer("lilyurl")).define("lilyurl", ["FileAttachment"], _lilyurl);
  main.variable(observer("chrysamthemumurl")).define("chrysamthemumurl", ["FileAttachment"], _chrysamthemumurl);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("vl", child1);
  return main;
}
