import {HSLA} from "@Shared/FromWVC";
import {Assert, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import React, {useState} from "react";
import {Button, Column, Row, Text} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

declare const chrome;
@observer
export class AccessorsUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		return (
			<Row style={{height: "100%"}}>
				<Column style={{flex: 20}}>
					<Row>
						<Text>Accessors</Text>
						<Button text="Refresh" onClick={()=>{
							chrome.devtools.inspectedWindow.eval("globalThis.mglDevTools_hook.GetAccessorMetadatas()", (result, exceptionInfo)=>{
								Assert(Array.isArray(result), `Got invalid result:${result}`);
								/*if (result.length) {
									Assert(typeof result[0] == "string", `Invalid entry:${JSON.stringify(result[0])}`);
								}*/
								store.accessorMetas = result;
							});
						}}/>
					</Row>
					<div style={{overflow: "auto"}}>
						{store.accessorMetas.map((meta, index)=>{
							const selected = store.selectedAccessorMeta_index == index;
							return (
								<Row key={index}
									style={E(
										{cursor: "pointer"},
										selected && {background: HSLA(0, 0, .5, .5)}
									)}
									onClick={()=>{
										store.selectedAccessorMeta_index = index;
									}}>
									{meta.name}
								</Row>
							);
						})}
					</div>
				</Column>
				<Column style={{flex: 40}}>
					<Row>
						<Text>Call plans (for: {GetSelectedAccessorMeta()?.name})</Text>
						<Button text="Refresh" onClick={()=>{
						}}/>
					</Row>
				</Column>
				<Column style={{flex: 40}}>
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