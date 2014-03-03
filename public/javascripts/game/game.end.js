(function()
{
	var self = memoryScript;

	/**
	 * Checks if end of game state is reached.
	 *
	 * @return boolean
	 */
	self.Game.prototype.isEndOfGame = function()
	{
		return this.$board.getElements('.card-container.flipped')[0].length >= this.cellCountX * this.cellCountY;
	};

	/**
	 * Handles the end of the game.
	 */
	self.Game.prototype.endOfGame = function()
	{
		var $endOfGameScreenContent       = this.$endOfGameScreen.getElement('.end-of-game-screen-content'),
			$winnerPlayerNameField        = this.$endOfGameScreen.getElement('.winner-player-name'),
			$totalPlayTimeContainer       = this.$endOfGameScreen.getElement('.total-play-time-container'),
			$totalPlayTimeField           = $totalPlayTimeContainer.getElement('.total-play-time'),
			$totalScoreContainer          = this.$endOfGameScreen.getElement('.total-score-container'),
			$totalScoreField              = $totalScoreContainer.getElement('.total-score'),
			highestScore                  = -1,
			playersWithHighestScore       = [],
			playersWithHighestScoreString = ' ',
			playerIndex;

		// Determine winner
		for (playerIndex = 0; playerIndex < this.players.length; playerIndex++)
		{
			if (this.players[playerIndex].score > highestScore)
			{
				playersWithHighestScore = [ this.players[playerIndex] ];

				highestScore = this.players[playerIndex].score;
			}
			else if (this.players[playerIndex].score == highestScore)
			{
				playersWithHighestScore.push(this.players[playerIndex]);
			}
		}

		// Put winning player's names into the congratulations message
		for (playerIndex = 0; playerIndex < playersWithHighestScore.length; playerIndex++)
		{
			playersWithHighestScoreString += playersWithHighestScore[playerIndex].name;

			if (playerIndex < playersWithHighestScore.length - 1)
			{
				playersWithHighestScoreString += ' and ';

				continue;
			}

			break;
		}

		$winnerPlayerNameField.set('text', playersWithHighestScoreString);
		$totalPlayTimeField.set('text', Math.round((((new Date).getTime() / 1000) - this.startTime) * 100) / 100);
		$totalScoreField.set('text', highestScore);

		this.$endOfGameScreen.setStyle('width' , this.$board.getSize()[0].x);
		this.$endOfGameScreen.setStyle('height', this.$board.getSize()[0].y);
		this.$endOfGameScreen.setStyle('top'   , -(this.$board.getSize()[0].y));

		$endOfGameScreenContent.setStyle('margin-top', (this.$board.getSize()[0].y - $endOfGameScreenContent.getSize()[0].y) / 2);

		new Fx.Tween(this.$endOfGameScreen[0], {
			duration  : 2000,
			transition: 'bounce:out',
			property  : 'top'
		}).start(-this.$board.getSize()[0].y, 0);
	};

	/**
	 * Resets the end of the game.
	 */
	self.Game.prototype.resetEndOfGame = function()
	{
		this.$endOfGameScreen.setStyle('height', 0);
	}
})();