import React, {useState} from "react";
import {Button, Column, Row, TextArea} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

declare const chrome;
export class ExtrasUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		let [text, setText] = useState("");
		let [lastResult, setLastResult] = useState<any>();
		return (
			<Row style={{height: "100%"}}>
				<Column style={{width: 500}}>
					<div>Code:</div>
					<TextArea style={{flex: 1, border: "1px solid black"}} value={text} onChange={val=>setText(val)}/>
					<Row>
						<div>Run using:</div>
						<Button text="eval" onClick={()=>{
							const result = eval(text);
							console.log("Result:", result);
							setLastResult(result);
						}}/>
						<Button text="inspectedWindow.eval" onClick={()=>{
							chrome.devtools.inspectedWindow.eval(text, (result, exceptionInfo)=>{
								console.log("Result:", result, "@exceptionInfo:", exceptionInfo);
								if (exceptionInfo != null) {
									setLastResult({exceptionInfo});
									return;
								}
								setLastResult(result);
							});
						}}/>
					</Row>
				</Column>
				<Column style={{flex: 1}}>
					<div>Result:</div>
					<TextArea style={{height: "100%", tabSize: 4}} value={JSON.stringify(lastResult, null, "\t")}/>
				</Column>
				<Column style={{width: 300}}>
					<Button text="Test1" onClick={()=>{
						chrome.devtools.inspectedWindow.eval("5 * 30", (result, isException)=>{
							console.log("Result:", result);
						});
					}}/>
					<Button text="Test2" onClick={()=>{
					}}/>
					<Button text="Test3" onClick={()=>{
					}}/>
				</Column>
			</Row>
		);
	}
}