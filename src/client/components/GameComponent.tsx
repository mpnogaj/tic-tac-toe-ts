import { Modal } from 'bootstrap';
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
	board: string[];
	gameFinished: boolean;
	winner: string | null | undefined;
};

class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
	constructor(props: GameComponentProps) {
		super(props);

		this.state = {
			playerTurn: this.props.startingPlayer,
			board: Array(9).fill('0'),
			gameFinished: false,
			winner: undefined
		};

		this.props.socket.on('UpdateBoardState', (board: string, player: Player) => {
			const newBoard = board.split('');
			this.setState({ playerTurn: player, board: newBoard });
		});
		this.props.socket.on('NotifyGameFinished', (winner: string | null) => {
			this.setState({ ...this.state, gameFinished: true, winner: winner });
		});
	}

	makeMove = async (i: number, j: number) => {
		this.props.socket.emit('makeMove', i, j, this.props.roomGuid);
	};

	componentDidUpdate() {
		if (this.state.gameFinished) {
			const element = window.document.getElementById('modal') as HTMLElement;
			const modal = new Modal(element);
			modal.show();
		}
	}

	render(): React.ReactNode {
		return (
			<div className="container">
				{this.state.gameFinished ? (
					<div className="modal fade" id="modal" tabIndex={-1}>
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">Game finished</h5>
								</div>
								<div className="modal-body">
									<h2>
										Game finished.{' '}
										{this.state.winner != null ? `Winner: ${this.state.winner}` : 'Draw'}
									</h2>
								</div>
								<div className="modal-footer">
									<a className="btn btn-primary" href="/rooms">
										Play another game
									</a>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div></div>
				)}

				<div className="row justify-content-md-center">
					<div className="text-center">
						<h2>Current Move: {this.state.playerTurn.nickname}</h2>
					</div>
				</div>

				<div className="row justify-content-md-center">
					<div className="col-xs" style={{ maxWidth: '720px' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<tbody>
								{Array.apply(0, Array(3)).map((x: unknown, i: number) => {
									return (
										<tr key={i}>
											{Array.apply(0, Array(3)).map((x: unknown, j: number) => {
												return (
													<td
														key={j}
														onClick={() => this.makeMove(i, j)}
														style={{ border: '2px solid' }}
													>
														<div style={{ aspectRatio: '1/1' }}>
															<GameTile value={this.state.board[3 * i + j]} />
														</div>
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

type GameTileProps = {
	value: string;
};

const CrossTile = () => {
	return (
		<svg aria-label="X" role="img" viewBox="0 0 128 128" style={{ visibility: 'visible' }}>
			<path
				d="M16,16L112,112"
				style={{
					stroke: 'rgb(38, 38, 255)',
					strokeDashoffset: '0px',
					fill: 'none',
					strokeWidth: '3px'
				}}
			/>
			<path
				d="M112,16L16,112"
				style={{
					stroke: 'rgb(38, 38, 255)',
					strokeDashoffset: '0px',
					fill: 'none',
					strokeWidth: '3px'
				}}
			/>
		</svg>
	);
};

const CircleTile = () => {
	return (
		<svg aria-label="O" role="img" viewBox="0 0 128 128" style={{ visibility: 'visible' }}>
			<path
				d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"
				style={{
					stroke: 'rgb(224, 43, 43)',
					strokeDashoffset: '0px',
					fill: 'none',
					strokeWidth: '3px'
				}}
			/>
		</svg>
	);
};

const GameTile = (props: GameTileProps) => {
	switch (props.value) {
		case '1':
			return <CircleTile />;
		case '2':
			return <CrossTile />;
	}
	return <div></div>;
};

export default GameComponent;
