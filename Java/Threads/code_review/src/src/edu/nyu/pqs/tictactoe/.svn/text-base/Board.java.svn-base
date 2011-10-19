package src.edu.nyu.pqs.tictactoe;

import java.util.ArrayList;
import java.util.List;

/**
 * Define the model of board
 * 
 */
public class Board {
	private int height = 3;
	private int width = 3;
	private String winnerToken;
	private int step = 0;
	private Player player1;
	private Player player2;
	private Player currentPlayer;
	private List<GameListener> listeners = new ArrayList<GameListener>();
	private Token[][] board = new Token[getHeight()][getWidth()];

	/**
	 * initialize the board
	 * 
	 */
	private void initBoard() {
		for (int i = 0; i != getHeight(); i++) {
			for (int j = 0; j != getWidth(); j++) {

				board[i][j] = new Token();
			}
		}
	}

	/**
	 * get the winner name
	 * 
	 * @return String winner name
	 * 
	 */
	public String getWinner() {
		if (this.winnerToken.equals(player1.getSymbol())) {
			return "Player1";
		} else
			return "Player2";
	}

	/**
	 * 
	 * get a copy of board
	 * 
	 * @return Token[][] board copy
	 * 
	 */
	public Token[][] getBoard() {
		Token[][] copyboard = new Token[getHeight()][getWidth()];
		for (int i = 0; i != getHeight(); i++) {
			for (int j = 0; j != getWidth(); j++) {
				copyboard[i][j] = new Token(this.board[i][j]);
			}
		}
		return copyboard;

	}

	/**
	 * 
	 * play one step of the game
	 * 
	 * @param Token
	 *            token, position int col and row
	 * 
	 */

	public void play(Token token, int col, int row) {

		Player p = getCurrentPlayer();

		fireMovePerformedEvent(row, col, p);
	}

	/**
	 * 
	 * action of one move
	 * 
	 * @param int row, int col, Player player
	 * 
	 */
	private void fireMovePerformedEvent(int row, int col, Player player) {

		Token token = new Token(player.getSymbol());
		this.setToken(token, row, col);
		step++;
		switchPlayer();

		for (GameListener listener : listeners) {

			listener.movePerformed(row, col, player);
		}
		if (winner()) {
			System.out.println(winnerToken);
			for (GameListener listener : listeners) {

				listener.gameOver(getWinner());
			}
		}
		if (tied()) {
			System.out.println("tied");
			for (GameListener listener : listeners) {

				listener.gameOver("tied");
			}
		}
		Point p = currentPlayer.getNextPlayerMove(this.getBoard(),
				this.getHeight(), this.getWidth());
		if (p != null) {
			this.play(new Token(currentPlayer.getSymbol()), p.getX(), p.getY());
		}
	}

	/**
	 * 
	 * reset of the board
	 */
	public void reset() {
		initBoard();
	}

	/**
	 * get the height
	 */
	public int getHeight() {

		return this.height;
	}

	/**
	 * get the width
	 */
	public int getWidth() {
		return this.width;
	}

	/**
	 * get the token
	 */
	public Token getToken(int row, int col) {
		Token token = new Token(board[row][col]);
		return token;

	}

	/**
	 * set the token
	 */
	private void setToken(Token token, int row, int col) {

		this.board[row][col] = token;
	}

	/**
	 * init the game to start
	 */

	public void startPlay(Player player1, Player player2) {
		this.player1 = player1;
		this.player2 = player2;
		currentPlayer = player1;
		initBoard();
	}

	/**
	 * switch players
	 */
	private void switchPlayer() {
		if (this.currentPlayer == player1)
			this.currentPlayer = player2;
		else
			this.currentPlayer = player1;
	}

	private Player getCurrentPlayer() {
		return this.currentPlayer;
	}

	/**
	 * add a listener to the board
	 */
	public synchronized void addGameListener(GameListener listener) {
		if (listener == null)
			throw new NullPointerException();
		if (!listeners.contains(listener)) {
			listeners.add(listener);
		}
	}

	/**
	 * delete a listener
	 */
	public synchronized void deleteListener(GameListener listener) {
		listeners.remove(listener);
	}

	/**
	 * check whether is tied
	 */
	private boolean tied() {

		if (!winner() && step == 9) {

			return true;
		}

		return false;

	}

	/**
	 * check whether some player wins
	 */
	protected boolean winner() {
		// Checking rows

		for (int i = 0; i < this.getHeight(); i++) {
			if (board[i][0].getSymbol() != null
					&& board[i][0].getSymbol() == board[i][1].getSymbol()
					&& board[i][0].getSymbol() == board[i][2].getSymbol()) {
				winnerToken = board[i][0].getSymbol();
				return true;
			}

		}
		// Checking columns
		for (int i = 0; i < this.getHeight(); i++) {
			if (board[0][i].getSymbol() != null
					&& board[0][i].getSymbol() == board[1][i].getSymbol()
					&& board[0][i].getSymbol() == board[2][i].getSymbol()) {
				winnerToken = board[0][i].getSymbol();
				return true;
			}

		}

		// Checking diagonals

		if (board[0][0].getSymbol() != null
				&& board[0][0].getSymbol() == board[1][1].getSymbol()
				&& board[1][1].getSymbol() == board[2][2].getSymbol()) {
			winnerToken = board[1][1].getSymbol();
			return true;
		}
		if (board[1][1].getSymbol() != null
				&& board[0][2].getSymbol() == board[1][1].getSymbol()
				&& board[1][1].getSymbol() == board[2][0].getSymbol()) {
			winnerToken = board[1][1].getSymbol();
			return true;
		}

		return false;
	}

}
