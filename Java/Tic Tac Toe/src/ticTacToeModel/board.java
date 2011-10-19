package ticTacToeModel;

import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/*
 * This is the model where the login resides and all manipulation to 
 * game matrix are directed to all views registered from here.
 * */
public class board {

	// list of all the registered listeners.
	private List<PropertyChangeListener> listener = new ArrayList<PropertyChangeListener>();
	// matrix that keeps rough sketch of game board.
	private String[][] gameMatrix = new String[3][3];
	private String winner = "";
	private boolean gameOver = false;
	private int currentPlayer = 1;
	private int dimension = 3;
	private player player1;
	private player player2;
	private String[] temp = new String[3];
	private int row;
	private int col;
	private int lastModifiedRow = 0;
	private int lastModifiedCol = 0;
	private String currentToken = "X";

	// this is used to direct the view what to update on been notified.
	private String whatToDo;
	// this stores the total moves from beginning of the game.
	private int totalMoves = 0;

	public int getTotalMoves() {
		return totalMoves;
	}

	public String getWhatToDo() {
		return whatToDo;
	}

	public String getCurrentToken() {
		return currentToken;
	}

	/*
	 * This function toggles the token after each play its move.
	 */
	public void toggleToken() {
		if (currentToken.toUpperCase().equals("X"))
			currentToken = "O";
		else
			currentToken = "X";
	}

	public int getLastModifiedRow() {
		return lastModifiedRow;
	}

	public void setLastModifiedRow(int lastModifiedRow) {
		this.lastModifiedRow = lastModifiedRow;
	}

	public int getLastModifiedCol() {
		return lastModifiedCol;
	}

	public void setLastModifiedCol(int lastModifiedCol) {
		this.lastModifiedCol = lastModifiedCol;
	}

	/*
	 * Constructor assigns player object to its respective references. And it
	 * also initializes the game matrix.
	 * 
	 * @param player
	 * 
	 * @param player
	 */
	public board(player player1, player player2) {

		resetGameMatrix();

		this.player1 = player1;
		this.player2 = player2;
	}

	/*
	 * This function resets the board on restarting the game and also notifies
	 * all the registered views to reset there board.
	 */
	public void startTheGame() {
		whatToDo = "startGame";
		resetGameMatrix();
		notifyListeners();
	}

	/*
	 * This function reset's the gameMatrix.This is performed when the game is
	 * restarted.
	 */
	public void resetGameMatrix() {
		for (int i = 0; i < 3; i++)
			for (int j = 0; j < 3; j++)
				gameMatrix[i][j] = "-";
	}

	/*
	 * This function just sets the Player 2 as computer.
	 */
	public void setPlayer2AsComputer() {
		player2.setName("Computer");
	}

	/*
	 * This function returns the name of player next to play.
	 */
	public String getNextPlayer() {
		if (currentPlayer == 2)
			return player1.getName();
		else
			return player2.getName();
	}

	/*
	 * This function forwards the turn to next player. It also checks whether
	 * the next player is computer, if so than it plays the computer move.
	 */
	public void nextPlayer() {
		currentPlayer++;
		if (currentPlayer > 2)
			currentPlayer = 1;

		if (currentPlayer == 2) {
			if (player2.getName().toLowerCase().equals("computer")) {
				playComputerMove();
			}
		}
	}

	/*
	 * Returns the name of winner.
	 * 
	 * @return player name who won the game
	 */
	public String getWinner() {
		return winner;
	}

	/*
	 * This function fills the spot requested by player and also checks whether
	 * the player won the game at this move, if so it just notifies all the
	 * registered views and completes the game.
	 * 
	 * @param temp it consists of 3 values. temp[0]=row, temp[1]=column &
	 * temp[2]=token
	 */
	public void updateBoard(String[] temp) {

		whatToDo = "";
		totalMoves++;
		gameMatrix[Integer.parseInt(temp[0].toString())][Integer
				.parseInt(temp[1].toString())] = temp[2].toString()
				.toUpperCase();

		// Check whether the player won on this move
		row = Integer.parseInt(temp[0].toString());
		col = Integer.parseInt(temp[1].toString());

		gameOver = true;
		for (int i = 0; i < dimension; i++) {
			if (!gameMatrix[row][i].equals(temp[2].toString().toUpperCase())) {
				gameOver = false;
				break;
			}
		}

		if (!gameOver) {
			gameOver = true;
			for (int i = 0; i < dimension; i++) {
				if (!gameMatrix[i][col]
						.equals(temp[2].toString().toUpperCase())) {
					gameOver = false;
					break;
				}
			}
		}

		if (!gameOver && row + col == dimension - 1) {
			gameOver = true;
			for (int i = 0; i < dimension; i++) {
				if (!gameMatrix[i][dimension - i - 1].equals(temp[2].toString()
						.toUpperCase())) {
					gameOver = false;
					break;
				}
			}
		}

		if (!gameOver && row == col) {
			gameOver = true;
			for (int i = 0; i < dimension; i++) {
				if (!gameMatrix[i][i].equals(temp[2].toString().toUpperCase())) {
					gameOver = false;
					break;
				}
			}
		}

		if (gameOver) {
			totalMoves = 0;
			if (currentPlayer == 1)
				winner = player1.getName();
			else
				winner = player2.getName();

		}
		notifyListeners();
	}

	/*
	 * This return whether the game is over or not.
	 * 
	 * @return true or false
	 */
	public boolean isGameOver() {
		return gameOver;
	}

	/*
	 * This function notifies each of the registered views.
	 */
	private void notifyListeners() {
		for (Iterator iterator = listener.iterator(); iterator.hasNext();) {
			PropertyChangeListener name = (PropertyChangeListener) iterator
					.next();
			name.propertyChange(null);

		}
	}

	/*
	 * This function registers a new view to model notifications
	 */
	public void addChangeListener(PropertyChangeListener newListener) {
		listener.add(newListener);
	}

	/*
	 * This function finds the first empty space on board and play the spot for
	 * the computer.
	 */
	public void playComputerMove() {
		for (int i = 0; i < dimension; i++)
			for (int j = 0; j < dimension; j++) {
				if (gameMatrix[i][j].equals("-")) {
					lastModifiedRow = i;
					lastModifiedCol = j;
					temp[0] = Integer.toString(i);
					temp[1] = Integer.toString(j);
					temp[2] = "O";
					updateBoard(temp);
					if (!isGameOver()) {
						toggleToken();
						nextPlayer();
					}
					return;
				}
			}
	}
}