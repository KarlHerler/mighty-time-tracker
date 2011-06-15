
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