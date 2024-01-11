import React from 'react';
import { Socket } from 'socket.io-client';

import Player from '../../common/types/dto/player';

type GameComponentProps = {
	startingPlayer: Player;
	socket: Socket;
	roomGuid: string;
};

type GameComponentState = {
	playerTurn: Player;
	board: ('⬛' | '⭕' | '❌' | undefined)[];
	gameFinished: boolean;
	winner: string | null | undefined;
};

class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
	constructor(props: GameComponentProps) {
		super(props);

		this.state = {
			playerTurn: this.props.startingPlayer,
			board: Array(9).fill('⬛'),
			gameFinished: false,
			winner: undefined
		};

		this.props.socket.on('UpdateBoardState', (board: string, player: Player) => {
			const newBoard = board.split('').map(x => {
				switch (x) {
					case '0':
						return '⬛';
					case '1':
						return '⭕';
					case '2':
						return '❌';
				}
			});
			this.setState({ playerTurn: player, board: newBoard });
		});
		this.props.socket.on('NotifyGameFinished', (winner: string | null) => {
			this.setState({ ...this.state, gameFinished: true, winner: winner });
		});
	}

	makeMove = async (i: number, j: number) => {
		this.props.socket.emit('makeMove', i, j, this.props.roomGuid);
	};

	render(): React.ReactNode {
		return (
			<div>
				{!this.state.gameFinished ? (
					<div>
						<h2>Current move: {this.state.playerTurn.nickname}</h2>
					</div>
				) : (
					<div>
						<h2>
							Game ended. {this.state.winner != null ? `Winner: ${this.state.winner}` : 'Draw'}
						</h2>
						<a href="/rooms">Return</a>
					</div>
				)}
				<table>
					<tbody>
						{Array.apply(0, Array(3)).map((x: unknown, i: number) => {
							return (
								<tr key={i}>
									{Array.apply(0, Array(3)).map((x: unknown, j: number) => {
										return (
											<th key={j}>
												<GameTile
													i={i}
													j={j}
													tileClickCallback={(i: number, j: number) => {
														this.makeMove(i, j);
													}}
													value={this.state.board[3 * i + j]}
													key={3 * i + j}
												/>
											</th>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

type GameTileProps = {
	i: number;
	j: number;
	tileClickCallback: (i: number, j: number) => void;
	value: '⬛' | '⭕' | '❌' | undefined;
};

const GameTile = (props: GameTileProps) => {
	return (
		<button
			onClick={() => {
				props.tileClickCallback(props.i, props.j);
			}}
		>
			{props.value}
		</button>
	);
};

export default GameComponent;
