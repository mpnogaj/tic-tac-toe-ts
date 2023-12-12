import React from 'react';

import { empty } from '../types/other';

interface ILoginPageState {
	username: string;
	password: string;
	nick: string;
}

class LoginPage extends React.Component<empty, ILoginPageState> {
	constructor(props: empty) {
		super(props);
		this.state = {
			username: '',
			password: '',
			nick: ''
		};
	}

	render(): React.ReactNode {
		return (
			<div>
				<h1>Login ...</h1>
				<div>
					<label>Login: </label>
					<input type="text" value={this.state.username} />
				</div>
				<div>
					<label>Password: </label>
					<input type="password" value={this.state.password} />
				</div>
				<div>
					<a>Login</a>
				</div>
				<div>
					<span>
						Don't have an account? <a href="/register">Register</a>
					</span>
				</div>
				<h1>... or play anonymously</h1>
				<div>
					<label>Nick: </label>
					<input type="text" value={this.state.nick} />
				</div>
				<div>
					<a>Play</a>
				</div>
			</div>
		);
	}
}

export default LoginPage;
