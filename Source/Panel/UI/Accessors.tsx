import {Assert} from "js-vextensions";
import React, {useState} from "react";
import {Button, Column, Row, Text} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

class AccessorMeta {
	name: string;
}

declare const chrome;
export class AccessorsUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		let [accessorMetas, setAccessorMetas] = useState<AccessorMeta[]>([]);
		return (
			<Row>
				<Column style={{flex: 33}}>
					<Row>
						<Text>Accessors</Text>
						<Button text="Refresh" onClick={()=>{
							chrome.devtools.inspectedWindow.eval("globalThis.mglDevTools_hook.GetAccessorMetadatas()", (result, exceptionInfo)=>{
								Assert(Array.isArray(result), `Got invalid result:${result}`);
								/*if (result.length) {
									Assert(typeof result[0] == "string", `Invalid entry:${JSON.stringify(result[0])}`);
								}*/
								setAccessorMetas(result);
							});
						}}/>
					</Row>
					{accessorMetas.map((meta, index)=>{
						return (
							<Row key={index}>
								{meta.name}
							</Row>
						);
					})}
				</Column>
				<Column style={{flex: 33}}>
					<Row>
						<Text>Call plans</Text>
						<Button text="Refresh" onClick={()=>{
						}}/>
					</Row>
				</Column>
				<Column style={{flex: 34}}>
					<Row>
						<Text>Call plan</Text>
						<Button text="Refresh" onClick={()=>{
						}}/>
					</Row>
				</Column>
			</Row>
		);
	}
}