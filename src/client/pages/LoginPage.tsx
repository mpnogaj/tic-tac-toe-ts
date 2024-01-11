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
			<div>
				<h1>Tic Tac Toe</h1>
				<div>
					<label>Nickname: </label>
					<input
						type="text"
						value={this.state.nickname}
						onInput={e => {
							this.setState({ nickname: e.currentTarget.value });
						}}
					/>
				</div>
				<div>
					<a onClick={async () => await this.playClickedHandler()}>Play</a>
				</div>
			</div>
		);
	}
}

export default navHOC(LoginPage);
