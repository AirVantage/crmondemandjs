crmondemandjs
========
> Node.js API for Oracle CRM OnDemand

:warning: __This project is a work in progress and is not yet intended to be used in production.__ :warning:


## Install

```
$ npm install --save crmondemandjs
```

## Usage

```javascript

var options = {
	url: "URL",
	auth: {
		user: "USER",
		password: "PWD"
	}
};

var crm = require("../lib/crmondemand.js")(options);

crm.tickets.list("AJBA-270GBKV").then(function(tickets) {
	tickets.items.forEach(function(ticket) {
		console.log(ticket.id + " - " + ticket.severity + " - " + ticket.status + " - " + ticket.subject);
	});
});

crm.tickets.update("AJBA-270GBKV", {
	id: "AJBA-270GBKV",
	subject: "Un sujet"
}).then(function(result) {
	console.log(JSON.stringify(result));
});

crm.tickets.create("AJBA-270GBKV", {
	subject: "Un sujet3",
	contactId: "ALYA-E4IJF"
}).then(function(result) {
	console.log(JSON.stringify(result));
});

crm.contacts.create("AJBA-270GBKV", {
	firstName: "Jean2",
	lastName: "Dupont2",
	email: "jdupont@pouet.com"
}).then(function(result) {
	console.log(JSON.stringify(result));
});

crm.contacts.search("jdupont@pouet.com").then(function(result) {
	console.log(JSON.stringify(result));
});

```
## License

MIT

## Contributions are welcome

See https://github.com/AirVantage/crmondemandjs/issues.
