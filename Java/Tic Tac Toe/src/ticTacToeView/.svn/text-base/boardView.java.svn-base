package ticTacToeView;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class boardView extends JFrame implements PropertyChangeListener {

	private ticTacToeModel.board playBoard;
	private JFrame frame;
	private JPanel topPanel;
	private JPanel buttonPanel;
	private JLabel gameStatus;
	private String[] temp = new String[3];
	private int dimension = 3;
	private List<JButton> buttons = new ArrayList<JButton>();
	private int lastModifiedRow = 0;
	private int lastModifiedCol = 0;
	private String[] playerOptions = { "Player 2", "Computer" };
	private final JComboBox playerSelect = new JComboBox(playerOptions);
	private JButton gameStart;

	/*
	 * This class creates the visual interface to play tic tac toe.
	 */
	public boardView(ticTacToeModel.board board) {

		// assign the model object to a reference.
		playBoard = board;
		// registers this view to listen to model changes.
		playBoard.addChangeListener(this);

		frame = new JFrame("TIC-TAC-TOE");
		frame.getContentPane().setLayout(new BorderLayout());
		topPanel = new JPanel();
		topPanel.add(new JLabel("Player 1"));
		topPanel.add(new JLabel(" vs "));
		topPanel.add(playerSelect);
		gameStart = new JButton("Start");
		topPanel.add(gameStart);
		frame.add(topPanel, BorderLayout.NORTH);
		gameStatus = new JLabel("");
		JButton singleGridButton;

		// assigns an actionListener to start button
		gameStart.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (playerSelect.getSelectedIndex() == 1)
					playBoard.setPlayer2AsComputer();
				playBoard.startTheGame();
			}
		});

		buttonPanel = new JPanel(new GridLayout(dimension, dimension));

		// creates the button panel which consists of the grid of tictactoe
		for (int i = 0; i < dimension; i++) {
			for (int j = 0; j < dimension; j++) {
				singleGridButton = new JButton();
				singleGridButton.addActionListener(new ActionListener() {
					public void actionPerformed(ActionEvent e) {
						callBoard(e);
					}
				});
				singleGridButton.setEnabled(false);
				buttonPanel.add(singleGridButton);
				buttons.add(singleGridButton);
			}
		}

		frame.add(buttonPanel, BorderLayout.CENTER);
		frame.add(gameStatus, BorderLayout.SOUTH);

		frame.setSize(400, 300);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

	}

	/*
	 * This function is binded to each button and calls functions in model to
	 * modify the game state including determining whether the game has been 
	 * won by a player if not proceeds and model will notify all the views.
	 * @param ActionEvent
	 */
	public void callBoard(ActionEvent e) {

		JButton b = (JButton) e.getSource();

		Rectangle r = b.getBounds();
		Point p = b.getLocation();
		lastModifiedRow = p.y / r.height;
		lastModifiedCol = p.x / r.width;
		playBoard.setLastModifiedRow(lastModifiedRow);
		playBoard.setLastModifiedCol(lastModifiedCol);
		temp[0] = Integer.toString(lastModifiedRow);
		temp[1] = Integer.toString(lastModifiedCol);
		temp[2] = playBoard.getCurrentToken();
		playBoard.updateBoard(temp);
		if (playBoard.isGameOver()) {

		} else {
			playBoard.toggleToken();
			playBoard.nextPlayer();
		}
	}

	/*
	 * This function changes the view when notified by the model.On been
	 * notified it checks whether the game is over, it also checks whether the
	 * game is tied.
	 * 
	 * @param PropertyChangeEvent
	 */
	@Override
	public void propertyChange(PropertyChangeEvent arg0) {

		if (playBoard.getWhatToDo().equals("startGame")) {

			gameStatus.setText("Player 1 move");
			playerSelect.setEnabled(false);
			gameStart.setEnabled(false);

			for (int i = 0; i < buttons.size(); i++) {
				buttons.get(i).setEnabled(true);
				buttons.get(i).setText("");
			}

		} else {

			lastModifiedRow = playBoard.getLastModifiedRow();
			lastModifiedCol = playBoard.getLastModifiedCol();

			buttons.get(lastModifiedRow * dimension + lastModifiedCol).setText(
					playBoard.getCurrentToken());
			buttons.get(lastModifiedRow * dimension + lastModifiedCol)
					.setEnabled(false);

			if (playBoard.isGameOver()) {
				gameStatus.setText("\n!!!Congratulations!!! "
						+ playBoard.getWinner() + " won.");
				playerSelect.setEnabled(true);
				gameStart.setEnabled(true);
				for (int i = 0; i < buttons.size(); i++) {
					buttons.get(i).setEnabled(false);
				}
			} else if (playBoard.getTotalMoves() == dimension * dimension) {
				gameStatus.setText("\nGame Tied");
				playerSelect.setEnabled(true);
				gameStart.setEnabled(true);
				for (int i = 0; i < buttons.size(); i++) {
					buttons.get(i).setEnabled(false);
				}
			} else {
				gameStatus.setText("\n" + playBoard.getNextPlayer() + " move ");
			}
		}
	}

}