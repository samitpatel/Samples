package src.edu.nyu.pqs.tictactoe;

import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
/**
 * @author Kun Bao 
 * Design the TieTacToe game
 * this is the main method
 */
public class TicTacToe {

	public static void main(String[] args) {
		System.out.println("game begin");

		final JFrame frame = new JFrame("choose");
		JButton button1 = new JButton("Human vs Human");
		JButton button2 = new JButton("Human vs Computer");
		frame.getContentPane().setLayout(new GridLayout(1, 2));
		frame.getContentPane().add(button1);
		frame.getContentPane().add(button2);
		frame.setSize(500, 100);
		frame.setVisible(true);

		button1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				Board board = new Board();
				Player player1 = new HumanPlayer("O");
				Player player2 = new HumanPlayer("X");
				board.startPlay(player1, player2);
				BoardDisplay display = new BoardDisplay(board);
				frame.setVisible(false);
				board.addGameListener(display);

			}
		});
		button2.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				Board board = new Board();
				Player player1 = new HumanPlayer("O");
				Player player2 = new SmartComputerPlayer("X");
				board.startPlay(player1, player2);
				BoardDisplay display = new BoardDisplay(board);
				frame.setVisible(false);
				board.addGameListener(display);

			}
		});

	}
}
