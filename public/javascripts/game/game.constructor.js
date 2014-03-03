(function()
{
	var self = memoryScript;

	/**
	 * Constructor.
	 *
	 * @param cellCountX
	 * @param cellCountY
	 */
	self.Game = function(cellCountX, cellCountY)
	{
		// Variables
		this.cellCountX          = cellCountX;
		this.cellCountY          = cellCountY;
		this.players             = [];
		this.currentPlayerIndex  = 0;
		this.turnedCardElements  = [];
		this.turnTimer           = null;
		this.loadingBarAnimation = null;
		this.startTime           = Math.round((new Date()).getTime() / 1000);

		// Elements
		this.$board                  = $$('.board');
		this.$turnTimeSlider         = $$('.turn-time-slider');
		this.$turnTimeSliderValue    = $$('.turn-time-slider-value');
		this.$currentPlayerNameField = $$('.current-player-name');
		this.$playerScores           = $$('.player-scores');
		this.$loadingBarBackground   = $$('.loading-bar-background');
		this.$loadingBarProgress     = $$('.loading-bar-progress');
		this.$endOfGameScreen        = $$('.end-of-game-screen');

		// Start up
		this.$playerScores.set('text', '');

		this.players.push(new self.Player('Player 1'));
//		this.players.push(new self.Player('Player 2'));

		this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);

		this.resetEndOfGame();
		this.nextTurn(true);
		this.prepareBoard(this.cellCountX, this.cellCountY);

		// Events
		this.$turnTimeSlider.addEvent('change', (function(){ this.handleTurnTimeSliderChange(); }).bind(this));
		this.$board.addEvent('click:relay(.card-container)', (function(event, element){ this.handleCardClick(element); }).bind(this));
	};
})();