import React from 'react';
import { Socket } from 'socket.io';

type GameComponentProps = {
	// socket: Socket;
};

type GameComponentState = {
	board: string[];
};

class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
	constructor(props: GameComponentProps) {
		super(props);

		this.state = {
			board: Array(9).fill('⬛')
		};
	}

	componentDidMount(): void {
		//we should subscribe to move made event
		//and update the state in that event handler
	}

	componentWillUnmount(): void {
		//unsubscribe from all ws events here
	}

	makeMove = (i: number, j: number) => {
		//tmp while API is in progress
		const newValue = '❌';
		const newBoard = this.state.board.map((x, ind) => {
			if (3 * i + j === ind) return newValue;
			return x;
		});

		this.setState({
			board: newBoard
		});

		//instead we should only send a request using websocket to the server
		//to validate out move and to brodcats it to other clients
	};

	render(): React.ReactNode {
		return (
			<table>
				<tbody>
					{Array.apply(0, Array(3)).map((x, i) => {
						return (
							<tr key={i}>
								{Array.apply(0, Array(3)).map((x, j) => {
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
		);
	}
}

type GameTileProps = {
	i: number;
	j: number;
	tileClickCallback: (i: number, j: number) => void;
	value: string;
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
