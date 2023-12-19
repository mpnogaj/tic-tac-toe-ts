import React from 'react';

class GameComponent extends React.Component {
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
													console.log(`${i} ${j} clicked`);
												}}
												value={'X'}
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
