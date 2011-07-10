$("#notice").hide();
var time = {tID: 			"",
						active: 	false,
						tags: 		[],
						tagsStr: 	"",
						time: 		0,
						timeStr: 	""
			 		 };

var user = $(".user a").html();

var view = {
	path:	window.location.pathname,
	user: window.location.pathname.split('/')[1],
	tag: 	window.location.pathname.split('/')[2]
};

function findUnfinished() {
	//checks if any unfinished 
	$.get('/work/'+user+'/unfinished', function(res) {
			//gets time elapsed
			var start = new Date(res[0].workData.start)
			var now = new Date();
			var timeElapsed = Math.floor((now - start)/1000); //in seconds
			time.tID = res[0].workData.tID;
			startTime(timeElapsed, res[0].workData.tags)
			$("#notice").slideDown('fast');
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
	startTime(0, tags);
	window.scroll(0,0);
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
		$.post('/work/'+user, time, function(data) {
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
	
	$.post('/work/'+user, time, function(data) {
		if (view.user===user) { 
			var d = data[1];
			var addedWorks = "<tr>";
			//var start  = new Date(d[i].workData.start);
			var start = new Date();
					addedWorks = addedWorks+"<td>"+start.toLocaleDateString()+"</td><td>";
			var tags = data[0].tags;
			for (i=0; i<tags.length;i++) {
				addedWorks = addedWorks+"<a href='"+user+"/"+tags[i]+"'>"+tags[i]+"</a>";
			}
			addedWorks = addedWorks+"</td><td>"+data[0].timeStr+"</td>";
			addedWorks = addedWorks + "</tr>";
		
			$("#workdata tbody").prepend(addedWorks);
		
			primeChart((parseInt(data[0].time)/3600), 10); 
		}
	});
	
	time = {
		active: false,
		tags: [],
		tagsStr: "",
		time: 0,
		timeStr: ""
	}
});