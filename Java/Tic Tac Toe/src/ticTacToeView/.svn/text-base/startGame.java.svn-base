package ticTacToeView;

/*
 * Here the execution of tictactoe begins.
 * */
public class startGame {

	public static void main(String[] args) {

		try {

			ticTacToeModel.player player1 = new ticTacToeModel.player(
					"Player 1");

			ticTacToeModel.player player2 = new ticTacToeModel.player(
					"Player 2");

			ticTacToeModel.board board = new ticTacToeModel.board(player1,
					player2);
			// Creating two views. You can create more views
			boardView view1 = new boardView(board);
			boardView view2 = new boardView(board);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
