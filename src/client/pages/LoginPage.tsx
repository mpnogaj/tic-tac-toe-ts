import axios from 'axios';
import React from 'react';

import { empty } from '../../common//types/other';
import Player from '../../common/types/dto/player';
import { NavComponent, NavComponentProps, navHOC } from '../components/hoc/NavComponent';
import Endpoints from '../endpoints';

interface ILoginPageState {
	nickname: string;
}

class LoginPage extends NavComponent<empty, ILoginPageState> {
	constructor(props: NavComponentProps<empty>) {
		super(props);
		this.state = {
			nickname: ''
		};
	}

	playClickedHandler = async () => {
		const data: Player = {
			guid: '00000000-0000-0000-0000-000000000000',
			nickname: this.state.nickname
		};

		await axios.post(Endpoints.Login, data);

		this.props.navigate('/rooms');
	};

	render(): React.ReactNode {
		return (
			<div
				className="container"
				onKeyUp={async event => {
					if (event.key === 'Enter') {
						await this.playClickedHandler();
					}
				}}
			>
				<h1>Tic Tac Toe</h1>
				<div className="form">
					<div className="form-group">
						<label className="form-label">Nickname: </label>
						<input
							className="form-control"
							type="text"
							value={this.state.nickname}
							onInput={e => {
								this.setState({ nickname: e.currentTarget.value });
							}}
						/>
					</div>

					<button
						className="btn btn-primary mt-3"
						onClick={async () => await this.playClickedHandler()}
					>
						Play
					</button>
				</div>
			</div>
		);
	}
}

export default navHOC(LoginPage);
