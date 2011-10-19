package src.edu.nyu.pqs.tictactoe;

import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class BoardDisplay implements GameListener {
	List<JButton> buttonList = new ArrayList<JButton>();
	Board board = new Board();

	/**
	 * Constructor of BoardDisplay
	 */
	public BoardDisplay(final Board board) {
		this.board = board;
		JFrame frame = new JFrame("TieTacToe");
		frame.getContentPane().setLayout(new GridLayout(3, 3));
		int height = board.getHeight();
		int width = board.getWidth();

		frame.setSize(300, 300);
		for (int col = 0; col < width; col++) {
			for (int row = 0; row < height; row++) {
				final Token token = board.getToken(row, col);
				final JButton button = new JButton();
				button.setEnabled(true);
				buttonList.add(button);
				frame.getContentPane().add(button);
				final int fRow = row;
				final int fCol = col;
				button.addActionListener(new ActionListener() {
					public void actionPerformed(ActionEvent evt) {
						board.play(token, fRow, fCol);

					}
				});

				frame.setVisible(true);
				frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

			}

		}

	}

	/**
	 * Override movePerformed
	 * 
	 * @param int row, int col ,Player p
	 * 
	 */
	@Override
	public void movePerformed(int row, int col, Player p) {

		int height = this.board.getHeight();
		int width = this.board.getWidth();

		Token[][] newboard = new Token[height][width];

		newboard = this.board.getBoard();

		for (int i = 0; i < width; i++) {
			for (int j = 0; j < height; j++) {

				Token token;
				if (newboard[i][j] != null) {
					token = newboard[i][j];//
				} else {
					token = null;
				}
				final String displayToken = token != null ? token.getSymbol()
						: null;
				int k = 3 * i + j;
				JButton button = (JButton) this.buttonList.get(k);

				button.setEnabled(displayToken == null);
				button.setText(displayToken);

			}

		}
		if (this.board.winner()) {
			for (int i = 0; i != buttonList.size(); i++) {
				JButton button = (JButton) this.buttonList.get(i);
				button.setEnabled(false);
			}

		}

	}

	/**
	 * Override gameOver
	 * 
	 * @param String
	 *            winner
	 * @return the boolean result of whether the game is over.
	 * 
	 */
	@Override
	public void gameOver(String winner) {
		// TODO Auto-generated method stub
		// ask the board who the winner is
		// display the winner name to the user
		JFrame frame = new JFrame("GameOver");
		JLabel label;
		if (winner.equals("tied")) {
			label = new JLabel("Tied game !", JLabel.CENTER);
		} else
			label = new JLabel("Game over, the winner is " + winner,
					JLabel.CENTER);
		frame.add(label);
		frame.setSize(300, 200);
		frame.setVisible(true);

	}

}
