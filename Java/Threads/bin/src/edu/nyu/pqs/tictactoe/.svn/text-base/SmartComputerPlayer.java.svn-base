package src.edu.nyu.pqs.tictactoe;
/**
 * Define the Smart Computer player class
 * 
 */
public class SmartComputerPlayer extends Player{

	public SmartComputerPlayer(String token) {
		super(token);
		// TODO Auto-generated constructor stub
	}

	@Override
	public  Point getNextPlayerMove(Token[][] board, int x, int y) {
		// TODO Auto-generated method stub
	
		for (int i = 0; i != x; i++){
			for(int j = 0; j != y; j++){
				
				if( board[j][i].getSymbol() == null){
					System.out.println(i+"  "+j);
					return new Point(i,j);
				}
					
			}
		}
		return null;
	}

}
