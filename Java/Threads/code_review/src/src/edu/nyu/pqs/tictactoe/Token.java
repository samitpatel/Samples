package src.edu.nyu.pqs.tictactoe;
/**
 * Define Token class to record the token
 * 
 */
public class Token {
	private String symbol;

	public Token() {

	}

	public Token(String symbol) {
		this.symbol = symbol;

	}

	public Token(Token token) {
		if (token != null) {
			this.symbol = token.getSymbol();
		} else
			this.symbol = null;
	}

	public String getSymbol() {
		return this.symbol;
	}

}
