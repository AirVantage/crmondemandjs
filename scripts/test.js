var options = {
	url: "URL",
	auth: {
		user: "USER",
		password: "PWD"
	}
};

var crm = require("../lib/crmondemand.js")(options);

//var testAccount = "AJBA-27169Q7";
var testAccount = "AIMA-1O3PW2Y";

/*crm.tickets.list(testAccount).then(function(tickets) {
	tickets.items.forEach(function(ticket) {
		console.log(ticket.id + " - " + ticket.severity + " - " + ticket.status + " - " + ticket.subject);
	});
});*/

/*var testTicket = "AJBA-270GBKV";

crm.tickets.update(testAccount, {
	id: testTicket,
	subject: "Un sujet"
}).then(function(result) {
	console.log(JSON.stringify(result));
});*/

/*
crm.tickets.create(testAccount, {
	subject: "Un sujet3",
	contactId: "ALYA-E4IJF"
}).then(function(result) {
	console.log(JSON.stringify(result));
});*/

/*crm.contacts.create(testAccount, {
	firstName: "Jean2",
	lastName: "Dupont2",
	email: "jdupont@pouet.com"
}).then(function(result) {
	console.log(JSON.stringify(result));
});*/

crm.contacts.search("jdupont@pouet.com").then(function(result) {
	console.log(JSON.stringify(result));
});
