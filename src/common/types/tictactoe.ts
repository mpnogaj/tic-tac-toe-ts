import Player from './dto/player';

enum Tile {
	Empty,
	Circle,
	Cross
}

class TicTacToe {
	private readonly N: number = 3;
	private _moves: number = 0;
	public GameStarted: boolean = false;
	public GameFinished: boolean = false;
	public Winner: Player | null = null;
	public CurrentTurn!: Player;
	private _nextTurn!: Player;
	private readonly _shapesDict: Map<Player, Tile> = new Map();
	private readonly _board: Tile[][] = [];

	constructor() {
		for (let i = 0; i < this.N; i++) {
			this._board[i] = [];
			for (let j = 0; j < this.N; j++) {
				this._board[i][j] = Tile.Empty;
			}
		}
	}

	public StartGame(player1: Player, player2: Player): void {
		this._moves = 0;

		const randInt = Math.floor(Math.random() * 100);
		this._shapesDict.set(player1, randInt % 2 === 0 ? Tile.Circle : Tile.Cross);
		this._shapesDict.set(player2, randInt % 2 === 0 ? Tile.Cross : Tile.Circle);

		this.CurrentTurn = this._shapesDict.get(player1) === Tile.Cross ? player1 : player2;
		this._nextTurn = this.CurrentTurn === player1 ? player2 : player1;

		this.GameStarted = true;
		this.GameFinished = false;
		this.Winner = null;
	}

	public CanMakeMove(i: number, j: number, player: Player): boolean {
		if (!this._shapesDict.has(player)) return false;
		if (this.CurrentTurn !== player) return false;
		if (i < 0 || j < 0 || i >= this.N || j >= this.N) return false;
		if (this.GameFinished) return false;
		return this._board[i][j] === Tile.Empty;
	}

	public MakeMove(i: number, j: number, player: Player): boolean {
		if (!this.CanMakeMove(i, j, player)) return false;
		this._board[i][j] = this._shapesDict.get(player)!;
		this._moves++;
		this.CheckWinner(i, j, player);

		[this.CurrentTurn, this._nextTurn] = [this._nextTurn, this.CurrentTurn];
		return true;
	}

	public Surrender(player: Player): void {
		this.GameFinished = true;
		this.Winner = player === this.CurrentTurn ? this._nextTurn : this.CurrentTurn;
	}

	private CheckWinner(i: number, j: number, player: Player): void {
		const move = this._board[i][j];

		// Check row
		for (let x = 0; x < this.N; x++) {
			if (this._board[i][x] !== move) break;
			if (x === this.N - 1) {
				this.GameFinished = true;
				this.Winner = player;
				return;
			}
		}

		// Check column
		for (let x = 0; x < this.N; x++) {
			if (this._board[x][j] !== move) break;
			if (x === this.N - 1) {
				this.GameFinished = true;
				this.Winner = player;
				return;
			}
		}

		// Check diagonal
		if (i === j) {
			for (let x = 0; x < this.N; x++) {
				if (this._board[x][x] !== move) break;
				if (x === this.N - 1) {
					this.GameFinished = true;
					this.Winner = player;
					return;
				}
			}
		}

		// Check reverse diagonal
		if (i + j === this.N - 1) {
			for (let x = 0; x < this.N; x++) {
				if (this._board[x][this.N - 1 - x] !== move) break;
				if (x === this.N - 1) {
					this.GameFinished = true;
					this.Winner = player;
					return;
				}
			}
		}

		// Check draw
		if (this._moves === this.N * this.N) {
			this.GameFinished = true;
			this.Winner = null;
			return;
		}

		this.GameFinished = false;
		this.Winner = null;
	}

	public BoardToString(): string {
		let result: string = '';
		for (let i = 0; i < this.N; i++) {
			for (let j = 0; j < this.N; j++) {
				const chr =
					this._board[i][j] === Tile.Empty ? '0' : this._board[i][j] === Tile.Circle ? '1' : '2';
				result += chr;
			}
		}
		return result;
	}
}

export default TicTacToe;
