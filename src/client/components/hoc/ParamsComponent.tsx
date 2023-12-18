import React from 'react';
import { Params, useParams } from 'react-router-dom';

export type ParamsComponentProps<T, P> = T & {
	params: Readonly<[P] extends [string] ? Params<P> : Partial<P>>;
};

export class ParamsComponent<
	T extends Readonly<unknown>,
	P extends Readonly<unknown>,
	S
> extends React.Component<ParamsComponentProps<T, P>, S> {}

export function paramsHOC<T extends Readonly<unknown>, P extends Readonly<unknown>, S>(
	Comp: typeof ParamsComponent<T, P, S>
) {
	const paramsHOC = (props: T) => {
		const params = useParams<P>();
		return <Comp {...props} params={params} />;
	};
	return paramsHOC;
}
