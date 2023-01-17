d3.select("#tips")
	.style("position", "absolute")
	.style("display", "none")
	.style("padding", "1em 1em")
	.style("color", "#EEECE4")
	.style("border-radius", "10%")
	.style("background-color", "rgba(0,0,0,8)")

d3.csv("./variationup.csv", odata => {
	var columns = odata.columns;
	var maxValue = 0,
		minValue = 0;
	odata.forEach((d, i) => {
		for (var i = 1; i < columns.length; i++) {
			d[columns[i]] = 1 * d[columns[i]]
			if (d[columns[i]] > maxValue) {
				maxValue = d[columns[i]];
			}
			if (d[columns[i]] < minValue) {
				minValue = d[columns[i]];
			}
		}
	})

	console.log(minValue, maxValue)
	var height = 800;
	var width = 800;
	var innerCircleSize = 80;
	var outerCircleSize = 200;
	var startCenterAngle = 20;
	var paddingAngle = 2;

	var svg = d3.select('#circleMap')
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	var svgG = svg.append("g")
		.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
	var middleG = svgG.append("g");
	var middleG_circle = middleG.append("circle").attr("r", innerCircleSize)
		.style("stroke", "black").style("fill", "none");
	var middleG_text = middleG.append("text")
		.text("")
		.style("text-anchor", "middle")
		.style("user-select", "none")
		.style("font-size", innerCircleSize / 1.5 + "px")
		.attr("dy", innerCircleSize / 4 + "px")


	var outerG = svgG.append("g");
	var scale = d3.scaleLinear()
		.domain([1.1 * minValue, 1.1 * maxValue])
		.range([innerCircleSize, innerCircleSize + outerCircleSize])



	var scaleG = outerG.append("g");
	var startcircle = Math.floor(minValue * 1.1)
	var endcircle = Math.ceil(maxValue * 1.1)
	for (var i = startcircle; i <= endcircle; i++) {
		if (i % 10 == 0) {
			scaleG.append("circle").attr("r", scale(i))
				.style("fill", "none")
				.style("stroke", function() {
					if (i == 0) {
						return "rgba(0,0,0,0.5)"
					} else {
						return "rgba(0,0,0,0.3)"
					}
				})
		}
	}

	var scaleStargAngle = -(startCenterAngle / 2 - 4)
	var scaleEndAngle = (startCenterAngle / 2 - 4)
	scaleStargAngle = scaleStargAngle / 180 * Math.PI
	scaleEndAngle = scaleEndAngle / 180 * Math.PI

	let pie0 = d3.pie()
		.startAngle(scaleStargAngle)
		.endAngle(scaleEndAngle)
	let pieData0 = pie0([1])
	var arc0 = d3.arc().innerRadius(innerCircleSize + 1).outerRadius(scale(1.51 * maxValue))
		.startAngle(scaleStargAngle)
		.endAngle(scaleEndAngle)
	scaleG.append("path")
		.attr("d", arc0(pieData0[0]))
		.style("fill", "#fcf7fa")

	for (var i = startcircle; i <= endcircle; i++) {
		if (i % 10 == 0) {
			var x = 0;
			var y = -scale(i);
			scaleG.append("text")
				.style("text-anchor", "middle")
				.style("font-size", "12px")
				.text(i).attr("transform", "translate(" + x + "," + y + ")").attr("dy", "6px")
		}
	}


	var barG = outerG.append("g");
	var barGStartAngle = startCenterAngle / 2;
	var barGEndAngle = 360 - startCenterAngle / 2;
	var barLength = odata.length;

	var perBarAngle = (barGEndAngle - barGStartAngle - paddingAngle * (barLength - 1)) / barLength;

	for (var i = 0; i < barLength; i++) {
		var startAngle = barGStartAngle + (perBarAngle + paddingAngle) * i;
		var endAngle = startAngle + perBarAngle;
		startAngle = startAngle / 180 * Math.PI
		endAngle = endAngle / 180 * Math.PI
		console.log(startAngle, endAngle)
		let pie = d3.pie()
			.startAngle(startAngle)
			.endAngle(endAngle)
		let pieData = pie([1])
		var arc = d3.arc().innerRadius(innerCircleSize).outerRadius(innerCircleSize)
			.startAngle(startAngle)
			.endAngle(endAngle)
		let centroId = arc.centroid();

		barG.append("path")
			.attr("startAngle", startAngle)
			.attr("endAngle", endAngle)
			.attr("id", odata[i].state)
			.attr("d", arc(pieData[0]))

		barG.append("line")
			.attr("stroke", "rgba(0,0,0,0.5)")
			.style("stroke-width", "0.1px")
			.attr("x1", d => arc.centroid(d)[0] * 1)
			.attr("y1", d => arc.centroid(d)[1] * 1)
			.attr("x2", d => arc.centroid(d)[0] * 4)
			.attr("y2", d => arc.centroid(d)[1] * 4)

		barG.append("text").attr("transform", (d) => {
			var x = arc.centroid(pieData[0])[0] * 4.05;
			var y = arc.centroid(pieData[0])[1] * 4.05;
			var roateAngle = (endAngle) * 180 / Math.PI - 90 - ((endAngle -
				startAngle) / 2 * 180 / Math.PI);
			if (roateAngle > 90 && roateAngle < 270) {
				roateAngle = 180 + roateAngle
			}
			return "translate(" + x + "," + y + ") rotate(" + (roateAngle) + ")"
		}).style("font-size", "12px").attr("dy", "4px").attr("text-anchor", "middle").text(odata[i].state)
	}

	var myColorr = d3.scaleLinear()
			.range(["#FC354C", "#fcd9df"])
			.domain([-30,0])
	var myColorb = d3.scaleLinear()
			.range(["white", "#0ABFBC"])
			.domain([1,30])
	function drawCircleMap(years) {
		middleG_text.transition().text(years.replace("v", ""))
		odata.forEach((d,i)=>{
			var theBar = barG.select("#"+d.state);
			var startAngle = theBar.attr("startAngle")*1.0
			var endAngle =  theBar.attr("endAngle")*1.0
			let pie = d3.pie()
				.startAngle(startAngle)
				.endAngle(endAngle)
			let pieData = pie([1])
			var arc = d3.arc().innerRadius(innerCircleSize).outerRadius(scale(d[years]))
			theBar.attr("value",d[years]).transition().attr("d", arc(pieData[0])).style("fill",function(){
				if(d[years] > 0){
					return myColorb(d[years]);
				}else{
					return myColorr(d[years]);
				}
			})

			theBar.on("mouseover", function() {
				d3.select("#tips").html(d3.select(d3.event.target).attr("value"))
				d3.select("#tips").style("display", "block").style("top", d3.event.pageY + "px")
					.style("left", (d3.event.pageX + 4) + "px")
			})

			theBar.on("mouseout", function() {
				d3.select("#tips").style("display", "none")
				d3.select("#tips").html("")
			})
		})
	}
	drawCircleMap(columns[1])
	document.querySelector("#years").addEventListener("change", function(event) {
		document.querySelector("#yearsOutput").innerHTML = event.target.value;
		drawCircleMap("v" + event.target.value)
	})
	window.indexNum = 1;
	document.querySelector('#playOrStop').addEventListener('click',function(event){
		var valued = d3.select(event.target).attr("valued");
		if (valued == "play"){
			d3.select(event.target).attr("valued","stop")
			window.playSvg = setInterval(function(){
				if(window.indexNum>=columns.length){
					window.indexNum = 1;
				}else{
					window.indexNum ++;
				}
				drawCircleMap(columns[window.indexNum])
			},1200)
			d3.select(event.target).html("stop")
		}else{
			d3.select(event.target).attr("valued","play")
			clearInterval(window.playSvg)
			d3.select(event.target).html("play")
		}
	})
})
