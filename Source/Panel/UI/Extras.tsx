import React, {useState} from "react";
import {Button, Column, Row, TextArea} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

export class ExtrasUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		let [text, setText] = useState("");
		return (
			<Row style={{height: "100%"}}>
				<Column style={{width: 500}}>
					<div>Code:</div>
					<TextArea style={{flex: 1, border: "1px solid black"}} value={text} onChange={val=>setText(val)}/>
					<Button text="Run" onClick={()=>{
						eval(text);
					}}/>
				</Column>
			</Row>
		);
	}
}