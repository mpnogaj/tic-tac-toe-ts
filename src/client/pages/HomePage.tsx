import axios, { AxiosResponse } from 'axios';
import React from 'react';

class HomePage extends React.Component {
	async sendRequest() {
		try {
			const resp = await axios.get<unknown, AxiosResponse<string, unknown>>('/api/ping/ping');
			alert(resp.data);
		} catch (ex) {
			alert(ex);
		}
	}

	render(): React.ReactNode {
		return (
			<div>
				<button
					onClick={async () => {
						await this.sendRequest();
					}}
				>
					Click me!
				</button>
			</div>
		);
	}
}

export default HomePage;
