import React from "react";
import {Column, Row} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

export class AccessorsUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		return (
			<Row>
				<Column style={{flex: 33}}>
					<Row>Accessors</Row>
				</Column>
				<Column style={{flex: 33}}>
					<Row>Call plans</Row>
				</Column>
				<Column style={{flex: 34}}>
					<Row>Call plan</Row>
				</Column>
			</Row>
		);
	}
}