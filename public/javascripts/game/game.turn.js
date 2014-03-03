(function()
{
	var self = memoryScript;

	/**
	 * Fires when the turn time slider changes.
	 */
	self.Game.prototype.handleTurnTimeSliderChange = function()
	{
		this.$turnTimeSliderValue.set('text', Math.round(this.getTurnTime() / 100) / 10);
	};

	/**
	 * Handles a click on a card.
	 *
	 * @param element
	 */
	self.Game.prototype.handleCardClick = function(element)
	{
		var $element = $$(element);

		// Prevent flipping cards when card is already flipped or two cards have been opened in the same turn
		if (this.turnedCardElements.length >= 2 ||
			$element[0].hasClass('flipped'))
		{
			return;
		}

		// Start the timer of the turn if it hasn't already been started
		if (this.turnTimer == null)
		{
			this.startTurnTimer();
		}

		$element.addClass('flipped');

		this.turnedCardElements.push($element);

		// When two cards have been turned, wait a defined number of seconds
		if (this.turnedCardElements.length >= 2)
		{
			// Check if card values match
			if (this.turnedCardElements[0].getElement('.card-back')[0].get('text') == this.turnedCardElements[1].getElement('.card-back')[0].get('text'))
			{
				this.turnedCardElements = [];

				this.players[this.currentPlayerIndex].incrementScore();

				if (this.loadingBarAnimation != null)
				{
					this.loadingBarAnimation.cancel();
				}

				// Check if end of game state was reached
				if (this.isEndOfGame())
				{
					this.endOfGame();

					return;
				}

				this.nextTurn(false);
			}
		}
	};

	/**
	 * Start turn timer.
	 */
	self.Game.prototype.startTurnTimer = function()
	{
		this.resetTurnTimer();

		// Animate loading bar
		this.loadingBarAnimation = new Fx.Tween(this.$loadingBarProgress[0], {
			duration  : this.getTurnTime(),
			transition: 'linear',
			property  : 'width',
			onComplete: (function(){ this.$loadingBarProgress.setStyle('width', 0); }).bind(this),
			onCancel  : (function(){ this.$loadingBarProgress.setStyle('width', 0); }).bind(this)
		}).start(0, this.$loadingBarBackground.getSize()[0].x + 2);

		// Go to next turn when the turn time runs out
		this.turnTimer = setTimeout((function()
		{
			this.nextTurn(true);
		}).bind(this), this.getTurnTime())
	};

	/**
	 * Start turn timer.
	 */
	self.Game.prototype.resetTurnTimer = function()
	{
		if (this.loadingBarAnimation != null)
		{
			this.loadingBarAnimation.cancel();
		}

		clearTimeout(this.turnTimer);

		this.turnTimer = null;
	};

	/**
	 * Go to next turn.
	 *
	 * @param nextPlayer
	 */
	self.Game.prototype.nextTurn = function(nextPlayer)
	{
		var nextPlayerIndex = this.currentPlayerIndex,
			elementIndex    = 0;

		// Set next player if next player is true
		if (nextPlayer)
		{
			nextPlayerIndex += 1;

			if (nextPlayerIndex >= this.players.length)
			{
				nextPlayerIndex = 0;
			}

			this.$currentPlayerNameField.set('text', this.players[nextPlayerIndex].name);

			this.currentPlayerIndex = nextPlayerIndex;
		}

		// Flip cards that haven't been matched yet
		for (elementIndex; elementIndex < this.turnedCardElements.length; elementIndex++)
		{
			this.turnedCardElements[elementIndex].removeClass('flipped');
		}

		this.turnedCardElements = [];

		this.resetTurnTimer();
	};

	/**
	 * Returns the period of time in milliseconds the cards are set to be shown for.
	 *
	 * @return int turnTime
	 */
	self.Game.prototype.getTurnTime = function()
	{
		var turnTime = parseInt(this.$turnTimeSlider[0].get('value'));

		if (isNaN(turnTime))
		{
			return 5000;
		}

		return turnTime;
	};
})();