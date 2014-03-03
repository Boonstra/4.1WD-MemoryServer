(function()
{
	var self = memoryScript;

	/**
	 * Constructor.
	 *
	 * @param name
	 */
	self.Player = function(name)
	{
		// Variables
		this.name  = name;
		this.score = 0;

		// Elements
		this.$playerScores     = $$('.player-scores');
		this.$playerScoreRow   = new Element('div', {
			html: '<strong>' + this.name + '</strong>: <span class="score">0</span> points'
		});
		this.$playerScoreField = this.$playerScoreRow.getElement('.score');

		this.$playerScores.adopt(this.$playerScoreRow);
	};

	/**
	 * Increment the player's score
	 */
	self.Player.prototype.incrementScore = function()
	{
		this.setScore(this.score + 1);
	};

	/**
	 * Set the player's score.
	 *
	 * @param score
	 */
	self.Player.prototype.setScore = function(score)
	{
		this.score = score;

		this.$playerScoreField.set('text', score);
	};
})();