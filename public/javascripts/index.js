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


var workChart; // globally available
function renderChart2() {
	
}

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
	} else {
		$("#notice").hide();
	}
}

function makeDateStr(x) {
	var d = new Date(x); 
	return d.getDate()+"."+(d.getMonth()+1);
}
function primeChart() {
	$("#chart").hide();
  var times = [];
	var dayTime = 0;
	var cDay = $("tbody td").eq(0).html();
	var labels = []
  $("tbody td:last-child").each(function() { 
		if($(this).attr('class')!=="ongoing") {
			if (cDay===$(this).parent().find("td").eq(0).html()) {
				dayTime += (($(this).attr('class'))/1000/60/60);
			} else {
				labels.push(makeDateStr(cDay));
				cDay = $(this).parent().find("td").eq(0).html();
				
				times.push(dayTime)	
				dayTime = 0;
			}
		}
	});
	times.push(dayTime);
	labels.push(makeDateStr(cDay));
	
	times = times.reverse();
	labels = labels.reverse();
	
  //var labels = (function lambda(x, y){ if(x>0) { y[x-1]=(x-1)/2; lambda(x-1, y); } return y })(times.length, []);
  renderChart(times, labels)
}

function renderChart(times, labels) {
	$("#chart").show();
	workChart = new Highcharts.Chart({
		chart: {
	  	renderTo: 'chart',
	    defaultSeriesType: 'areaspline',
			backgroundColor: 'none',
			height: 270,
			width: ($("table").width()+50),
			marginLeft: 55
	  },
		plotOptions: {
			areaspline: {
				fillOpacity: .5
			}
		},
	  title: {
	  	text: ''
	  },
	  yAxis: {
	  	title: {
	    	text: ''
	    }
	 	},
		xAxis: {
			allowDecimals: true,
			categories: labels
		},
	  series: [{
	  	name: 'work',
	    data: times
	  }],
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		}, 
		tooltip: {
			formatter: function() {
				return "Hours: "+Math.round((this.y)*100)/100;
			}
		}
	});
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