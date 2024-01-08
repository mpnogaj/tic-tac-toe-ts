import React from 'react';

interface ICompState {
	loading: boolean;
	authorized: boolean;
}

interface ICompProps {
	checkAuthFunc: () => Promise<boolean>;
	child: JSX.Element;
	loading: JSX.Element;
	fallback: JSX.Element;
}

class ProtectedRoute extends React.Component<ICompProps, ICompState> {
	constructor(props: ICompProps) {
		super(props);

		this.state = {
			loading: true,
			authorized: false
		};
	}

	componentDidMount(): void {
		this.authenticate();
	}

	render(): React.ReactNode {
		if (this.state.loading) return this.props.loading;
		return this.state.authorized ? this.props.child : this.props.fallback;
	}

	authenticate = async (): Promise<void> => {
		try {
			const isAuth = await this.props.checkAuthFunc();
			this.setState({ loading: false, authorized: isAuth });
		} catch {
			this.setState({ loading: false, authorized: false });
		}
	};
}

export default ProtectedRoute;
