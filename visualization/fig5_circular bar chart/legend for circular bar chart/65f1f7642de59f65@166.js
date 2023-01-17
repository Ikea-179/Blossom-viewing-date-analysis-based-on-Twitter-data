// https://observablehq.com/@e2e3304fe255ae2c/untitled@166
import define1 from "./a33468b95d0b15b0@808.js";

function _heat(Legend,d3){return(
Legend(d3.scaleSqrt([-40, 0, 20], ["#FC354C", "#fcd9df", "#0ABFBC"]), {
  title: "Date Variation"
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  main.variable(observer("heat")).define("heat", ["Legend","d3"], _heat);
  return main;
}
