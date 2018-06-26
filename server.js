var express = require('express'); 
var app = express(); //Create app variable
var server = require('http').createServer(app);//Set server variable and crate server and pass app
var io = require('socket.io').listen(server); //

//array for users and connections
users = [];
connections = [];

//run the server
server.listen(process.env.PORT || 3000);
console.log('Server running....');

//create a rout
app.get('/', function(req,res){
	res.sendFile( __dirname + '/index.html');
});

//Open a connection with socket.io
io.sockets.on('connection',function(socket){
	//all the events that we will be emitting
	connections.push(socket);
	console.log('Connected: %s sockets connected ', connections.length);

	//Disconnect
	socket.on('disconnect',function(data){

		//if(!socket.username) return;
		users.splice(users.indexOf(socket.username),1);
		updateUsernames();
		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected %s sockets connected',connections.length);
	});
  
	//Send messages
	socket.on('send message',function(data){
		//console.log(data);
		io.sockets.emit('new message',{msg:data , user:socket.username});

	});

	//New user 
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	
	function updateUsernames(){
		io.sockets.emit('get users',users);
	}

});