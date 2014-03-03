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
	// Listen for a submitted score
	socket.on('submitScore', function (score)
	{
		if (typeof score === 'object' &&
			typeof score.name === 'string' &&
			typeof score.score === 'number' &&
			typeof score.time === 'number' &&
			score.name.length > 0 &&
			score.score > 0 &&
			score.time > 0)
		{
			connection.query('INSERT INTO high_scores(name, score, time) VALUES("' + score.name + '", ' + score.score + ', ' + score.time + ')');
		}
	});

	// Sends the highest scores
	function sendHighScores()
	{
		connection.query('SELECT * FROM high_scores ORDER BY score, time LIMIT 0, 10', function(err, rows)
		{
			socket.emit('highScores', rows);
		});
	}

	sendHighScores();

	// Periodically send high scores
	setInterval(function(){ sendHighScores(); }, 5000);
});