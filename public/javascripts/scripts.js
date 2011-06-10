$("#notice").hide();
var counter
var time = {active: false,
						tags: [],
						tagsStr: "",
						time: 0,
						timeStr: ""
			 		 };
			
function asd() {
	//checks if any unfinished 
	//if unfinished then show them and resume counting
	//else hide #notice
}
function makeStr(t){
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

function startTime(elapsed) {
	if (time.active==false) {
		time.active = true;
		var tags = $("#tags").val().split(",");
		var tagsStr = tags[0];
		for(i=0;i<tags.length;i++) {
			tags[i] = tags[i].replace(/^\s+|\s+$/g, '');
			if (i>0) { tagsStr = tagsStr+", "+tags[i]; }
		}
		time.tags = tags;
		time.tagsStr = tagsStr;
		$(".tags").html(tagsStr);
		if (elapsed) { time.time=elapsed; }
		counter = setInterval(updateTime, 1000);
		$(".time").html("0 sec");
		$("#notice").slideDown(100, function() {
			$("#notice").show();
		});
	}
	$.post('/work', time, function(data) {
		time = data[0];
	});
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