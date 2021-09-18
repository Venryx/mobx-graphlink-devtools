import {HSLA} from "@Shared/FromWVC";
import {vScrollBar_width} from "@Shared/General";
import {Assert, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import React, {useState} from "react";
import {Button, Column, Row, Text} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

const columnWidths = [40, 20, 20, 20]

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
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={{flex: columnWidths[0]}}>Name</Text>
						<Text style={{flex: columnWidths[1]}}>Total run-time</Text>
						<Text style={{flex: columnWidths[2]}}>Call count</Text>
						<Text style={{flex: columnWidths[3]}}>Call plans</Text>
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
									<Text style={{flex: columnWidths[0], minWidth: 0}}>{meta.name}</Text>
									<Text style={{flex: columnWidths[1], minWidth: 0}}>{(meta.totalRunTime / 1000).toFixed(3)}</Text>
									<Text style={{flex: columnWidths[2], minWidth: 0}}>{meta.callCount}</Text>
									<Text style={{flex: columnWidths[3], minWidth: 0}}>{meta.callPlansStored}</Text>
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