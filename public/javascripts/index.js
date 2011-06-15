var counter
var time = {tID: 			"",
						active: 	false,
						tags: 		[],
						tagsStr: 	"",
						time: 		0,
						timeStr: 	""
			 		 };

/* starter functions, should happen on load */	
findUnfinished();
//renderChart();
primeChart();

function findUnfinished() {
	//checks if any unfinished 
	if ($(".ongoing td").length>0 && $("#notice").html()!=null) {
		$.get('/work/unfinished', function(res) {
			//gets time elapsed
			var start = new Date(res[0].workData.start)
			var now = new Date();
			var timeElapsed = Math.floor((now - start)/1000); //in seconds
			time.tID = res[0].workData.tID;
			startTime(timeElapsed, res[0].workData.tags)
		});
		startTime(tags, elapsed)
	} else {
		$("#notice").hide();
	}
}

function primeChart() {
	$("#chart").hide();
  var times = [];
  $("tbody td:last-child").each(function() {times.push(($(this).attr('class'))/1000/60) });
	times = times.reverse();
	
  var labels = (function lambda(x, y){ if(x>0) { y[x-1]=x; lambda(x-1, y); } return y })(times.length, []);
  console.log(times);
  console.log(labels);
  renderChart(labels, times)
}

function renderChart(labels, times) {
  // create at top left corner of #element
  
	var r = Raphael('chart', $("table").width()+50);
	
	
	var linechart = {width: ($("table").width()), height: ($("table").width()/4)}
  		linechart = r.g.linechart(
																	50, 							/* margin left */ 
																	20, 							/* margin top */
																	linechart.width, 	/* width */
																	linechart.height, /* height */
																	labels, 					/* data labels */
																	times, 						/* times */
																	{
																		"colors": ["#2A8FBD"], 
																		"symbol": "o", 
																		shade: 		true, 
																		axis: 		"0 0 1 1", 
																		smooth: 	true
																	}
																);
  $("#chart").css('height', ($("table").width()/4)+25);

	$("#chart").show();
  // example

  linechart.hoverColumn(function () {
                      this.tags = r.set();
                      for (var i = 0, ii = this.y.length; i < ii; i++) {
                          this.tags.push(
                                      r.g.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{fill: "#fff"}, 
                                                                                                                   {fill: "#333"}]));
                      }
                  }, function () {
                      this.tags && this.tags.remove();
                  });
  console.log(linechart.symbols[0][1].attr())
  linechart.symbols.attr({r: 3.5, fill: '#fff', stroke: "#2A8FBD"});
  //linechart.lines[0].animate({"stroke-width": 6}, 1000);
  //linechart.symbols[0][1].animate({fill: "#f00"}, 1000);

  linechart.hover( function () {
                                      this.tags = r.set();
                                      for (var i = 0, ii = this.y.length; i < ii; i++) {
                                          this.tags.push(r.g.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{fill: "#fff"}, {fill: this.symbols[i].attr("fill")}]));
                                      }
                                  }, function () {
                                      this.tags && this.tags.remove();
                                  });

  // example
  /*linechart.click(function() {
     alert("You clicked on the line chart!"); 
  });*/
}

/* time tracking code */
function makeStr(t) {
	//Produces a time string based on time in seconds
	if(t<60) {
		return t+" sec";
	} else if (t>3599) {
		if (t%60==0) {
			return (Math.floor(t/3600))+" h "+(Math.floor((t%3600)/60))+" min";	
		} else{
			return (Math.floor(t/3600))+" h "+(Math.floor((t%3600)/60))+" min "+ (t%60)+ " sec";	
		}
	} else {
		if (t%60==0) {
			return (Math.floor(t/60))+" min";	
		} else{
			return (Math.floor(t/60))+" min "+ (t%60)+ " sec";	
		}
	}
}

function updateTime() {
	time.time++;
	time.timeStr = makeStr(time.time);
	$(".time").html(time.timeStr);
}
function fromForm() {
	var tags = $("#tags").val().split(",");
	startTime(0, tags)
}
function updateTags(tags) {
	var tagsStr = tags[0];
	for(i=0;i<tags.length;i++) {
		tags[i] = tags[i].replace(/^\s+|\s+$/g, '');
		if (i>0) { tagsStr = tagsStr+", "+tags[i]; }
	}
	time.tags = tags;
	time.tagsStr = tagsStr;
}
function notifyTime() {
	$(".tags").html(time.tagsStr);
	$(".time").html(makeStr(time.time));
	$("#notice").slideDown(100, function() {
		$("#notice").show();
	});
}
function startTime(elapsed, tags) {
	if (time.active==false) {
		time.active = true;
		updateTags(tags); //gives time the tags
		if (elapsed) { time.time=elapsed; }
		notifyTime(); 		//update the notice with the correct time
		counter = setInterval(updateTime, 1000);
	}
	if (!elapsed) {
		$.post('/work', time, function(data) {
			time = data[0];
		});
	}
	return false;
}

$("#done").click(function() {
	clearInterval(counter);
	time.active = false;
	$("#notice").slideUp(200, function() {
		$("#notice").hide();
	});
	
	$.post('/work', time, function(data) {
		var d = data[1];
		var addedWorks = "";
		for (i=0; i<d.length;i++) {
			addedWorks = addedWorks+"<tr class='flash'>"
			var start  = new Date(d[i].workData.start);
			addedWorks = addedWorks+"<td>"+start.toLocaleDateString()+"</td>";
			addedWorks = addedWorks+"<td>"+d[i].workData.tag+"</td>";
			addedWorks = addedWorks+"<td>"+d[i].workData.timeStr+"</td>";
		}
		addedWorks = addedWorks + "</tr>";
		$("#workdata tbody").prepend(addedWorks);
		/*$("#workdata .flash td").animate({border: 0}, 20000, function() {
			$(this).parent().removeClass("flash");
		});*/
	});
	
	time = {active: false,
					tags: [],
					tagsStr: "",
					time: 0,
					timeStr: ""
				 }
});







