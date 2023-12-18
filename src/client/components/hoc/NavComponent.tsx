import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export type NavComponentProps<T extends Readonly<unknown>> = T & { navigate: NavigateFunction };

export class NavComponent<T extends Readonly<unknown>, S> extends React.Component<
	NavComponentProps<T>,
	S
> {}

export function navHOC<T extends Readonly<unknown>, S>(Cmp: typeof NavComponent<T, S>) {
	const navHOC = (props: T) => {
		return <Cmp {...props} navigate={useNavigate()} />;
	};
	return navHOC;
}
