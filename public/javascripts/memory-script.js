memoryScript = function()
{
	var self = { };

	/**
	 * Initialize.
	 */
	self.init = function()
	{
		$$(document).addEvent('click:relay(.new-game-button)', function(event){ event.preventDefault(); self.startNewGame(); });

		self.startNewGame();

		self.openSocket();

		self.currentGame.endOfGame();
	};

	/**
	 * Starts a new game
	 */
	self.startNewGame = function()
	{
		self.currentGame = new self.Game(4, 4);
	};

	/**
	 * Open an IO socket
	 */
	self.openSocket = function()
	{
		self.socket = io.connect('http://localhost:3000');

		self.socket.on('highScores', function (highScores)
		{
			self.updateHighScoresList(highScores);
		});
	};

	/**
	 * Updates the high scores list with the passed data
	 *
	 * @param highScores
	 */
	self.updateHighScoresList = function(highScores)
	{
		var $table = $$('.high-scores-list'),
			$tableRow,
			highScore,
			i;

		$table.set('html', '');

		$tableRow = new Element('tr');

		$tableRow.adopt(new Element('th', { text: '#' }));
		$tableRow.adopt(new Element('th', { text: 'Name' }));
		$tableRow.adopt(new Element('th', { text: 'Score' }));
		$tableRow.adopt(new Element('th', { text: 'Time' }));

		$table.adopt($tableRow);

		for (i = 0; i < highScores.length; i++)
		{
			highScore = highScores[i];

			$tableRow = new Element('tr');

			$tableRow.adopt(new Element('td', { text: i + 1 }));
			$tableRow.adopt(new Element('td', { text: highScore.name }));
			$tableRow.adopt(new Element('td', { text: highScore.score }));
			$tableRow.adopt(new Element('td', { text: highScore.time }));

			$table.adopt($tableRow);
		}
	};

	window.addEvent('domready', function()
	{
		self.init();
	});

	return self;
}();

// @codekit-append game/game.constructor.js
// @codekit-append game/game.board.js
// @codekit-append game/game.turn.js
// @codekit-append game/game.end.js
// @codekit-append player/player.constructor.js
