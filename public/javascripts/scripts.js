
$("#notice").hide();
var counter
var time = {active: false,
						tags: [],
						tagsStr: "",
						time: 0,
						timeStr: ""
			 		 };
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

function startTime() {
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
		console.log(data);
	});
	time = {active: false,
					tags: [],
					tagsStr: "",
					time: 0,
					timeStr: ""
				 }
});