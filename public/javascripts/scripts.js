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
		//startTime(tags, elapsed)
	} else {
		$("#notice").hide();
	}
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








/***************************************************************************
 * on user/create. 																												 *
 ***************************************************************************/

function nameValidate(s) {
	//do some server side user validate.
	$.post('/user/validate/name', {name: s.val()}, function(res) {
		console.log(res);
	});
}
function passwordValidate(s) { /* wont do anything. */ }

function mailValidate(s) {
	//do some clientside validation (find email validator regex) <--
	var validdatorArea = s.parent().parent().find('.validator');
	var validatorExp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
	if (validatorExp.test(s.val())) {
		validdatorArea.removeClass('invalid');
		validdatorArea.addClass('valid');
		validdatorArea.html("Great mail address sir!");
	} else {
		validdatorArea.removeClass('valid');
		validdatorArea.addClass('invalid');
		validdatorArea.html("Hmm, that doesn't look like a mail to me");
	}
}
function validate(field) {
	console.log("asdasd")
	//make sure all of them are longer than 0 char
	if (field.attr('id')==="name") { 		 nameValidate(field); 		} 
	if (field.attr('id')==="mail") { 		 mailValidate(field);			}
	if (field.attr('id')==="password") { passwordValidate(field); }
}
/* form validation hooks */
$("#create-user input").change(function() { validate($(this)) })
$("#create-user input").keyup(function() { validate($(this)) })