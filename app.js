var express    = require('express'),
    routes     = require('./routes'),
    http       = require('http'),
    path       = require('path'),
    app        = express(),
	server     = http.createServer(app),
	socketIO   = require('socket.io').listen(server),
	mysql      = require('mysql'),
	connection = mysql.createConnection(
	{
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'memory'
	});

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);

// Start server
server.listen(app.get('port'));
connection.connect();

// Socket IO
socketIO.sockets.on('connection', function (socket)
{
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data)
	{
		console.log(data);
	});

	function sendHighScores()
	{
		connection.query('SELECT * FROM high_scores LIMIT 0, 10', function(err, rows)
		{
			socket.emit('highScores', rows);
		});
	}

	sendHighScores();

	setInterval(function(){ sendHighScores(); }, 5000);
});