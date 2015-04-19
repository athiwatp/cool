"use strict;"; // Web MVC Demo

function MyController () {  Controller.call(this); 
	this.view     = new View();
	this.database = new Database("mysql://user:password@localhost/db");
	this.system   = new System();
	this.sessions = [];

	{
		this.view.header = "header.html";
		this.view.footer = "footer.html";

		this.database.execute("select * from sesions", [], function(records) {
			if (records == null) records = [];
			for (var i = 0; i < records.length; i++) {
			}
		});
	}

	this.error = function (context) {
		var page = this.view.render("error.html", {
			title: "Error " + context.request.url
		});
		context.response.end(page);
	}

	this.index = function (context) {
		var page = this.view.render("index.html", {
			title: "Kookiat Suetrong (Beer)"
		});
		context.response.end(page);
	}



/*
	this.signin = function (context) {
		if (context.request.method == "POST") {
			var data = "";
			var body = {};
			var controller = this;

			context.request.on("readable", function() {
				var chunk = context.request.read();
				data += chunk.toString();
			});

			context.request.on("end", function() {
				var system = new System();
				data = system.unescape(data);
				var tokens = data.split("&");
				for (var i = 0; i < tokens.length; i++) {
					var fields = tokens[i].split("=");
					body[fields[0]] = fields[1];
				}

				system.write(body);
				if (body.email == "user@email.com" &&
					body.password == "password") {
					var token = "token007007";
					controller.sessions[token] = body.email;
					context.response.setHeader("Set-Cookie",
						"session=" + token + "; HttpOnly");
				}
				context.response.writeHead(302, {Location: "/"});
				context.response.end();
			});

		} else {
			var model = {title: "Sign In"};
			var page  = this.view.render("signin.html", model);
			context.response.end(page);
		}
	}

	this.blog = function (context) {
		var view = this.view;
		var title = context.request.url.split("/")[2] || "";

		this.database.execute("select * from blogs where title=? or id=?",
		[title, title],
		function(records) {
			if (records == null || records.length == 0) {
				var model = {title: "Blog not found"};
				var page  = view.render("error.html", model);
				context.response.end(page);
			} else {
				var model = {title: records[0].title, record: records[0]};
				var page  = view.render("blog.html", model);
				context.response.end(page);
			}
		});
	}

// creating token
var token = "token-ABC0000001";
this.session[token] = { email: "kookiat@kookiat.com" };
context.response.setHeader("Set-Cookie", "session=" + token + "; HttpOnly");
context.response.end("OK");

// verify token
this.system.write(context.request.headers);
var cookies = context.request.headers.cookie.split(";");
for (var i = 0; i < cookies.length; i++) {
	var fields = cookies[i].trim().split("=");
	if (fields[0] == "session") {
		if (this.session[fields[1]]) {
			this.system.write("session is " + this.session[fields[1]]["email"]);
		}
	}
}
*/

	this.query = function (context) {
		var view = this.view;
		this.database.execute("select * from users", function(records) {
			var model = {title: "Query", records: records};
			var page  = "";
			try {
				page = view.render("query.html", model);
			} catch (e) {}
			context.response.end(page);
		});
	}
}

new Test();
function Test () { 
	{
		var controller = new MyController();
		var server = new Server(controller);
		// server.middleware.push(new Logger());
		server.middleware.push(new Less());
		server.start();
		var system = new System();
		system.write(server.text());
	}
}












//

// Standard Library

function Root () { 
	this.class = "Root";
	this.text = function () {
		return this.class;
	}
}

function Exception () {  Root.call(this); 
	this.class = "Exception";
}

function System () {  Root.call(this); 
	this.class = "System";

	this.write = function (data) {
		console.log(data);
	}
	this.execute = function (name) {
		var child = require("child_process");
		child.exec(name).unref();
	}
	this.unescape = function (data) {
		return unescape(data);
	}
	this.escape = function (data) {
		return escape(data);
	}
}

// JavaScript Engine
function Engine () {  Root.call(this); 
	this.class = "Engine";

	this.execute = function (code) {
		return eval(code);
	}
	this.parse = function (data) {
		return JSON.parse(data);
	}
	this.text = function (data) {
		return JSON.stringify(data);
	}
}

function Web () {  Root.call(this); 
	this.class = "Web";
	this.select = function (x) {
		return [];
	}
	this.list = function (x) {
		return [];
	}
	this.get = function (url, data, callback) {
		callback();
	}
	this.post = function (url, data, callback) {
		callback();
	}
}

function File (name){ Root.call(this); 
	this.class = "File";
	this.fs = require("fs");
	{
		this.name = name;
	}
	this.read = function () {
		var result = null;
		try {
			result = this.fs.readFileSync(this.name);
		} catch (e) { /* throw new Exception(); */ }
		return result;
	}
	this.write = function (data) {
		this.fs.writeFileSync(this.name, data);
	}
}

function TextFile (name){ File.call(this, name); 
	this.class = "TextFile";

	this.read = function () {
		var result = null;
		try {
			result = this.fs.readFileSync(this.name, {encoding: "utf8"});
		} catch (e) { /* throw new Exception(); */ }
		return result;
	}
	this.write = function (data) {
		this.fs.writeFileSync(this.name, data);
	}
	this.append = function (data) {
		this.fs.appendFileSync(this.name, data);
	}
}

function Integer () {  Root.call(this); 
	this.class = "Integer";
	this.parse = function (n) { return parseInt(n); }
}

function Float () {  Root.call(this); 
	this.class = "Float";
	this.parse = function (f) { return parseFloat(f); }
}



/*
this.exists = function (name) {
	return this.fs.existsSync(name);
}
this.list = function (name) {
	return this.fs.readdirSync(name);
}
this.isDirectory = function (name) {
	var info = this.fs.statsSync(name);
	return info.isDirectory();
}
*/

// DEPRECATED
function Console () {  Root.call(this); 
	this.class = "Console";
	this.data = "";
	this.index = 0;

	this.write = function (data) {
		process.stdout.write(data + "");
	}
	this.read = function (callback) {
		// process.stdin.resume();
		// process.stdin.setEncoding("UTF8");
		// process.stdin.on("data", function (chunk) { this.data += chunk; });

		process.stdin.on("readable", function() {
			var chunk = process.stdin.read();
			this.data += chunk;
		});
		process.stdin.on("end", function() { callback(this.data); });
	}
	/*
	this.readLine = function () {
		process.stdin.pause();
		var lines = this.data.split("\n");
		process.stdin.resume();
		// return lines[this.index++];
	}
	*/
}

// Web MVC Framework

function Database (connection){ Root.call(this); 
	this.connection = "";
	{
		this.connection = connection;
	}

	this.mysql = require("mysql");
	this.pool  = this.mysql.createPool(this.connection);

	this.execute = function (sql, data, callback) {
		this.pool.getConnection(function(error, server) {
			if (error) {
				callback(null);
			} else {
				server.query(sql, data, function(error, data) {
					callback(data);
					server.release();
				});
			}
		});
	}
}

function View () {  Root.call(this); 
	this.fs     = require("fs");
	this.engine = require("ejs");
	this.folder = "./views/";
	this.header = "";
	this.footer = "";

	this.render = function (name, data) {
		var engine = this.engine;
		var header = "";
		var footer = "";
		var center = "";
		try { header = this.fs.readFileSync(this.folder + this.header); }
		catch (e) {}
		try { footer = this.fs.readFileSync(this.folder + this.footer); }
		catch (e) {}
		try { center = this.fs.readFileSync(this.folder + name);        }
		catch (e) { center = ""; }
		var html = header + center + footer;

		// TODO: add caching here for production server
		return engine.render(html, data);
	}
}

function Server (controller){ Root.call(this); 
	this.port    = 2000;
	this.address = "0.0.0.0";
	this.http    = require("http");
	this.folder  = "./public"
	this.storage = require("fs");

	{
		this.controller = controller;
	}

	this.middleware = [];

	this.start = function () {
		var controller = this.controller;
		var server     = this;

		var http = this.http.createServer(function (request, response) {
			var context = {request:request, response:response, server:server};

			for (var i = 0; i < server.middleware.length; i++) {
				if (typeof server.middleware[i].request == "function") {
					server.middleware[i].request(context);
				}
			}

			var tokens = request.url.split(/\/|\?/g);
			var callee = tokens[1];
			if (callee == "") callee = "index";

			if (server.exception.indexOf(callee) >= 0) {
				response.statusCode = 404;
				response.setHeader("Content-Type", "text/html");
				controller.error(context);
			} else if (typeof controller[callee] == "function") {
				response.statusCode = 200;
				response.setHeader("Content-Type", "text/html");
				controller[callee](context);
			} else {
				// TODO: check existing here then send(file) or 404
				server.send(context);
			}
		});

		http.listen(this.port, this.address);
	}

	this.send = function (context) {
		var response   = context.response;
		var request    = context.request;
		var server     = this;
		var controller = this.controller;

		var urlTokens  = request.url.split("/");
		var path       = server.folder + request.url;
		var pathTokens = path.split(".");
		var fileType   = pathTokens[pathTokens.length-1];

		server.storage.readFile(path, function(error, data) {
			if (error) {
				response.statusCode = 404;
				response.setHeader("Content-Type", "text/html");
				controller.error(context);
			} else {
				var mime   = server.mime[fileType] == null ?
								"application/octet-stream" :
								server.mime[fileType].type;
				var isText = server.mime[fileType] == null ?
								false :
								server.mime[fileType].text;

				response.statusCode = 200;
				response.setHeader("Content-Type", mime);

				if (isText) {
					server.storage.readFile(path, {encoding:"utf8"},
					function(error, data) {
						response.end(data);
					});
				} else {
					response.end(data);
				}
			}
		});
	}

	this.text = function () {
		return "Running at http://" + this.address + ":" + this.port;
	}

	this.exception = [
		"__defineGetter__",
		"__defineSetter__",
		"__lookupGetter__",
		"__lookupSetter__",
		"constructor",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"toLocaleString",
		"toString",
		"valueOf"
	];

	this.mime = {
		"html" : { text: true , type: "text/html"  },
		"js"   : { text: true , type: "text/javascript"  },
		"css"  : { text: true , type: "text/css"         },
		"cool" : { text: true , type: "text/cool"        },
		"txt"  : { text: true , type: "text/plain"       },
		"map"  : { text: true , type: "text/plain"       },
		"json" : { text: true , type: "application/json" },
		"xml"  : { text: true , type: "application/xml"  },
	};
}

function Controller () {  Root.call(this); 
	this.index = function (context) {context.response.end(); }
	this.error = function (context) {context.response.end(); }
}

function Middleware () {  Root.call(this); 
	this.request = function (context) {
	}
}

function Logger () {  Middleware.call(this); 
	this.request = function (context) {
		var system = new System();
		system.write(context.request.url);
	}
}

function Less () {  Middleware.call(this); 
	this.less = require('less');

	this.request = function (context) {
		var urlTokens  = context.request.url.split("/");
		var path       = context.server.folder + context.request.url;
		var pathTokens = path.split(".");
		var fileType   = pathTokens[pathTokens.length-1];
		var less       = this.less;
		if (fileType == "css") {
			var old = path.replace(/\.css$/g, ".less");
			context.server.storage.readFile(old, {encoding:"utf8"},
			function(error, data) {
				if (!error) {
					less.render(data, function(error, css) {
						if (!error) {
							context.server.storage.writeFile(path, css.css);
						}
					});
				}
			});
		}
	}
}

// TODO: On production server, .html, .js, .css must be minified
// or create minified middleware

