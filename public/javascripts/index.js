var counter

/* starter functions, should happen on load */	
findUnfinished();
//renderChart();
primeChart();


var workChart; // globally available

function makeDateStr(x) {
	var d = new Date(x); 
	return d.getDate()+"."+(d.getMonth()+1);
}

function primeChart(adder) {
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
	
	
	if (adder!==undefined) { times[0] = times[0]+adder }
	times = times.reverse();
	
	labels = labels.reverse();
	
	console.log(times)
	
  //var labels = (function lambda(x, y){ if(x>0) { y[x-1]=(x-1)/2; lambda(x-1, y); } return y })(times.length, []);
  renderChart(times, labels)
}

function renderChart(times, labels) {
	$("#chart").show();
	workChart = new Highcharts.Chart({
		chart: {
	  	renderTo: 'chart',
	  	zoomType: 'x',
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
}00;
