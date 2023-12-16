import React from 'react';

import {
	ParamsComponent,
	ParamsComponentProps,
	paramsHOC
} from '../components/hoc/ParamsComponent';
import { empty } from '../types/other';

type RoomPageParams = {
	roomGuid: string;
};

class RoomPage extends ParamsComponent<empty, RoomPageParams, {}> {
	constructor(props: ParamsComponentProps<empty, RoomPageParams>) {
		super(props);
	}

	render(): React.ReactNode {
		return (
			<div>
				<h1>Room: {this.props.params.roomGuid}</h1>
			</div>
		);
	}
}

export default paramsHOC(RoomPage);
