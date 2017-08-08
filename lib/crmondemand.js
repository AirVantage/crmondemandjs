var _ = require("lodash");
var BPromise = require("bluebird");
var request = require("request");
//request.debug = true;


/**
 * @param options.url
 */
module.exports = function(options) {


	var connect = function() {
		return new BPromise(function(resolve, reject) {

			if (!options || !options.auth) {
				reject({
					error: "Missing authentication options"
				});
			}

			request.get(options.url + "/OnDemand/user/Rest/Connection", {
				auth: {
					user: options.auth.user,
					password: options.auth.password
				},
				headers: {
					"User-Agent": "request"
				},
				gzip: true,
				jar: true
			}, function(error, response, body) {
				if (response.statusCode === 200) {
					resolve();
				} else {
					reject(error);
				}
			});
		});
	};
	//orderBy=AccountName:asc,AccountLocation:asc&limit=100&offset=0&fields=RowId,AccountName,AccountLocation
	var query = function(url, qs) {
		return new BPromise(function(resolve, reject) {
			var requestOptions = {
				url: url,
				qs: qs,
				headers: {
					"User-Agent": "request"
				},
				gzip: true,
				jar: true
			};
			request.get(requestOptions,
				function(error, response, body) {
					if (response.statusCode === 200) {
						resolve(JSON.parse(body));
					} else {
						reject(JSON.stringify(response));
					}
				});
		});
	};
	var update = function(url, object) {
		return new BPromise(function(resolve, reject) {
			var requestOptions = {
				url: url,
				headers: {
					"User-Agent": "request",
					"Content-Type": "application/vnd.oracle.adf.resource+json"
				},
				jar: true,
				body: JSON.stringify(object)
			};
			request.patch(requestOptions,
				function(error, response, body) {
					if (response.statusCode === 200) {
						resolve(JSON.parse(body));
					} else {
						reject(JSON.stringify(response));
					}
				});
		});
	};
	var create = function(url, object) {
		return new BPromise(function(resolve, reject) {
			var requestOptions = {
				url: url,
				headers: {
					"User-Agent": "request",
					"Content-Type": "application/vnd.oracle.adf.resource+json"
				},
				jar: true,
				body: JSON.stringify(object)
			};
			request.post(requestOptions,
				function(error, response, body) {
					if (response.statusCode === 201) {
						resolve(JSON.parse(body));
					} else {
						reject(JSON.stringify(response));
					}
				});
		});
	};

	return {

		/**
		 * Retrieve tickets for the given account
		 */
		tickets: {
			details: function(ticketNumber) {

				return connect().then(function(requestOptions) {
					// SRNumber = Ticket number
					// Owner = Contact name
					// CustomPickList13 = Severity
					// CustomPickList8 = External Status
					// CustomText3 = Account name
					return query(options.url + "/OnDemand/user/Rest/latest/ServiceRequests", {
						fields: "Id,SRNumber,Owner,Subject,Description,CustomPickList13,CustomPickList8,CustomText3",
						q: "SRNumber = '" + ticketNumber + "'"
					}).then(function(result) {
						return {
							items: _.map(result.ServiceRequests, function(serviceRequest) {
								return {
									id: serviceRequest.Id,
									number: serviceRequest.SRNumber,
									subject: serviceRequest.Subject,
									user: serviceRequest.Owner,
									customer: serviceRequest.CustomText3,
									description: serviceRequest.Description,
									severity: serviceRequest.CustomPickList13,
									status: serviceRequest.CustomPickList8
								};
							}),
							paging: result._contextInfo
						};
					});
				});
			},
			list: function(accountId) {
				return connect().then(function(requestOptions) {
					// CustomPickList13 = Severity
					// CustomPickList8 = External Status
					return query(options.url + "/OnDemand/user/Rest/latest/Accounts/" + accountId + "/child/ServiceRequests", {
						fields: "Id,Subject,Description,CustomPickList13,CustomPickList8"
					}).then(function(result) {
						return {
							items: _.map(result.ServiceRequests, function(serviceRequest) {
								return {
									id: serviceRequest.Id,
									subject: serviceRequest.Subject,
									description: serviceRequest.Description,
									severity: serviceRequest.CustomPickList13,
									status: serviceRequest.CustomPickList8
								};
							}),
							paging: result._contextInfo
						};
					});
				});
			},
			update: function(accountId, ticket) {
				return connect().then(function(requestOptions) {
					// CustomPickList13 = Severity
					// CustomPickList8 = External Status
					var updatedServiceRequest = {};
					if (ticket.subject)
						updatedServiceRequest.Subject = ticket.subject;
					if (ticket.description)
						updatedServiceRequest.Description = ticket.description;
					if (ticket.severity)
						updatedServiceRequest.CustomPickList13 = ticket.severity;
					if (ticket.status)
						updatedServiceRequest.CustomPickList8 = ticket.status;
					return update(options.url + "/OnDemand/user/Rest/latest/Accounts/" + accountId + "/child/ServiceRequests/" + ticket.id, {
						ServiceRequests: [updatedServiceRequest]
					}).then(function(result) {
						return result;
					});
				});
			},
			create: function(accountId, ticket) {
				return connect().then(function(requestOptions) {
					// CustomPickList13 = Severity
					// CustomPickList8 = External Status

					// TODO need to create the contact if not already exists
					var newServiceRequest = {};
					if (ticket.subject)
						newServiceRequest.Subject = ticket.subject;
					if (ticket.description)
						newServiceRequest.Description = ticket.description;
					if (ticket.severity)
						newServiceRequest.CustomPickList13 = ticket.severity;
					if (ticket.status)
						newServiceRequest.CustomPickList8 = ticket.status;
					if (ticket.contactId)
						newServiceRequest.ContactId = ticket.contactId;
					return create(options.url + "/OnDemand/user/Rest/latest/Accounts/" + accountId + "/child/ServiceRequests/", {
						ServiceRequests: [newServiceRequest]
					}).then(function(result) {
						return result;
					});
				});
			}
		},
		contacts: {
			search: function(email) {
				return connect().then(function(requestOptions) {
					return query(options.url + "/OnDemand/user/Rest/latest/Contacts/", {
						fields: "Id",
						q: "ContactEmail = '" + email + "'"
					}).then(function(result) {
						return {
							items: _.map(result.Contacts, function(contact) {
								return {
									id: contact.Id
								};
							}),
							paging: result._contextInfo
						};
					});
				});
			},
			list: function(accountId) {
				return connect().then(function(requestOptions) {
					return query(options.url + "/OnDemand/user/Rest/latest/Accounts/" + accountId + "/child/AccountContacts", {
						fields: "Id"
					}).then(function(result) {
						return {
							items: _.map(result.Contacts, function(contact) {
								return {
									id: contact.Id
								};
							}),
							paging: result._contextInfo
						};
					});
				});
			},
			create: function(accountId, contact) {
				return connect().then(function(requestOptions) {
					var newContact = {};
					if (contact.email)
						newContact.ContactEmail = contact.email;
					if (contact.firstName)
						newContact.ContactFirstName = contact.firstName;
					if (contact.lastName)
						newContact.ContactLastName = contact.lastName;
					newContact.AccountId = accountId;
					return create(options.url + "/OnDemand/user/Rest/latest/Contacts/", {
						Contacts: [newContact]
					}).then(function(result) {
						return result;
					});
				});
			}
		}
	};
};
