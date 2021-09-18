import {HSLA} from "@Shared/FromWVC";
import {vScrollBar_width} from "@Shared/General";
import {Assert, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import React, {useState} from "react";
import {Button, Column, Row, Text} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

const columnWidths = [55, 15, 15, 15];
const columnWidths2 = [10, 70, 10, 10];

function RefreshAccessorMetas() {
	chrome.devtools.inspectedWindow.eval("globalThis.mglDevTools_hook.GetAccessorMetadatas()", (result, exceptionInfo)=>{
		Assert(Array.isArray(result), `Got invalid result:${result}`);
		/*if (result.length) {
			Assert(typeof result[0] == "string", `Invalid entry:${JSON.stringify(result[0])}`);
		}*/
		store.accessorMetas = result;
	});
}

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
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={{flex: columnWidths[0]}}>Name</Text>
						<Text style={{flex: columnWidths[1]}}>Run-time</Text>
						<Text style={{flex: columnWidths[2]}}>Call count</Text>
						<Text style={{flex: columnWidths[3]}}>Call plans</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{store.accessorMetas.map((meta, index)=>{
							const selected = store.selectedAccessorMeta_index == index;
							return (
								<Row key={index}
										style={E(
											{cursor: "pointer"},
											selected && {background: HSLA(0, 0, .5, .5)}
										)}
										onClick={()=>store.selectedAccessorMeta_index = index}>
									<Text style={{flex: columnWidths[0], minWidth: 0, overflowWrap: "anywhere"}}>{meta.name}</Text>
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
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={{flex: columnWidths2[0]}}>Index</Text>
						<Text style={{flex: columnWidths2[1]}}>Call args</Text>
						<Text style={{flex: columnWidths2[2]}}>Run-time</Text>
						<Text style={{flex: columnWidths2[3]}}>Call count</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{(GetSelectedAccessorMeta()?.callPlanMetas ?? []).map((meta, index)=>{
							const selected = store.selectedCallPlan_index == index;
							return (
								<Row key={index}
										style={E(
											{cursor: "pointer"},
											selected && {background: HSLA(0, 0, .5, .5)}
										)}
										onClick={()=>store.selectedCallPlan_index = index}>
									<Text style={{flex: columnWidths2[0], minWidth: 0}}>#{meta.index}</Text>
									<Text style={{flex: columnWidths2[1], minWidth: 0, overflowWrap: "anywhere"}}>{meta.argsStr}</Text>
									<Text style={{flex: columnWidths2[2], minWidth: 0}}>{(meta.totalRunTime / 1000).toFixed(3)}</Text>
									<Text style={{flex: columnWidths2[3], minWidth: 0}}>{meta.callCount}</Text>
								</Row>
							);
						})}
					</div>
				</Column>
				<Column style={{flex: 40}}>
					<Row>
						<Text>Call plan</Text>
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
					</Row>
				</Column>
			</Row>
		);
	}
}