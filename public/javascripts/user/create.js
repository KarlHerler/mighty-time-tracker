/***************************************************************************
 * on user/create. 																												 *
 ***************************************************************************/
var Validity = {name: false, password: false, mail: false};


/* Submit methods */
function createUser() {
	validateEVERYTHING();
	if (Validity.name&&Validity.password&&Validity.mail) {
		$.post('/user/create', $("form").serialize(), function(res) {
			console.log(res)
			if (res.isCreated) {
				window.location = '/';
			} else {
				alert("unable to create at the moment. ("+res.err.message.split(':')[0]+")")
			}
		});
	} 
}



/* Validation methods */
function validationMessage(s, message, isValid) {
	messageArea = s.parent().parent().find('.validator')
	if(isValid) {
		messageArea.removeClass('invalid');
		messageArea.addClass('valid');
	} else {
		messageArea.removeClass('valid');
		messageArea.addClass('invalid')
	}
	messageArea.html(message);
}

function nameValidate(s) {
	//do some server side user validate.
	$.post('/user/validate/name', {name: s.val()}, function(res) {
			if (res.isAvaliable) {
				validationMessage(s, "Aww yeah, hello "+s.val(), true);
				Validity.name = true;
			} else {
				validationMessage(s, "That username isn't avaliable!", false);
				Validity.name = false;
			}
	});
}
function passwordValidate(s) {
	if (s.val()==="rosebud") {
		validationMessage(s, 'At least it isn\'t "123456".', true)
	} else {
		validationMessage(s, 'At least it isn\'t "rosebud".', true)
	}
	Validity.password = true;
}

function mailValidate(s) {
	//do some clientside validation (find email validator regex) <--
	var validdatorArea = s.parent().parent().find('.validator');
	var validatorExp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
	if (validatorExp.test(s.val())) {
		validationMessage(s, "Great mail address sir!", true);
		Validity.mail = true;
	} else {
		validationMessage(s, "Hmm, that doesn't look like a mail to me", false);
		Validity.mail = false;
	}
}

function validateEVERYTHING() {
	nameValidate($("#create-user #name"));
	mailValidate($("#create-user #mail"));
	passwordValidate($("#create-user #password"));
}
function validate(field) {
	if (field.val().length<1) { 				 return false;						} //if the field is empty then do nothing
	if (field.attr('id')==="name") { 		 nameValidate(field); 		} //validate that the name is avaliable
	if (field.attr('id')==="mail") { 		 mailValidate(field);			}	//validate email syntax validity
	if (field.attr('id')==="password") { passwordValidate(field); }	//set password to valid for a non-empty string
}
/* form validation hooks */
$("#create-user input").change(function() { validate($(this)) })
$("#create-user input").keyup(function() { validate($(this)) })