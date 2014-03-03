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
	};

	/**
	 * Starts a new game
	 */
	self.startNewGame = function()
	{
		self.currentGame = new self.Game(4, 4);
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
