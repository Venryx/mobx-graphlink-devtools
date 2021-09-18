import {HSLA} from "@Shared/FromWVC";
import {vScrollBar_width} from "@Shared/General";
import {Assert, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import React, {useState} from "react";
import {Button, Column, Row, Text, TextInput} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

const columnWidths = [1, "0 50px", "0 50px", "0 50px", "0 50px", "0 50px", "0 50px"];
const columnWidths2 = ["0 50px", 1, "0 50px", "0 50px", "0 50px", "0 50px", "0 50px"];

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
				<Column style={{flex: 25}}>
					<Row>
						<Text>Accessors</Text>
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
						<Text ml={5}>Filter:</Text>
						<TextInput ml={5} instant={true} value={store.accessors_filter} onChange={val=>store.accessors_filter = val}/>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={{flex: columnWidths[0]}}>Name</Text>
						<Text style={{flex: columnWidths[1], justifyContent: "end", fontSize: 11}}>Run-time</Text>
						<Text style={{flex: columnWidths[2], justifyContent: "end"}}>1st RT</Text>
						<Text style={{flex: columnWidths[3], justifyContent: "end"}}>Min RT</Text>
						<Text style={{flex: columnWidths[4], justifyContent: "end"}}>Max RT</Text>
						<Text style={{flex: columnWidths[5], justifyContent: "end"}}>Calls</Text>
						<Text style={{flex: columnWidths[6], justifyContent: "end", fontSize: 11}}>Call plans</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{store.accessorMetas
						.filter(meta=>store.accessors_filter == "" || JSON.stringify(meta).includes(store.accessors_filter))
						.map((meta, index)=>{
							const selected = store.selectedAccessorMeta_index == index;
							return (
								<Row key={index}
										style={E(
											{cursor: "pointer"},
											selected && {background: HSLA(0, 0, .5, .5)}
										)}
										onClick={()=>store.selectedAccessorMeta_index = index}>
									<Text style={{flex: columnWidths[0], minWidth: 0, overflowWrap: "anywhere"}}>{meta.name}</Text>
									<Text style={{flex: columnWidths[1], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.totalRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths[2], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.firstRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths[3], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.minRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths[4], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.maxRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths[5], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.callCount}</Text>
									<Text style={{flex: columnWidths[6], minWidth: 0, justifyContent: "end"}}>{meta.callPlansStored}</Text>
								</Row>
							);
						})}
					</div>
				</Column>
				<Column style={{flex: 40}}>
					<Row>
						<Text>Call plans (for: {GetSelectedAccessorMeta()?.name})</Text>
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
						<Text ml={5}>Filter:</Text>
						<TextInput ml={5} instant={true} value={store.callPlans_filter} onChange={val=>store.callPlans_filter = val}/>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={{flex: columnWidths2[0]}}>Index</Text>
						<Text style={{flex: columnWidths2[1]}}>Call args</Text>
						<Text style={{flex: columnWidths2[2], justifyContent: "end", fontSize: 11}}>Run-time</Text>
						<Text style={{flex: columnWidths2[3], justifyContent: "end"}}>1st RT</Text>
						<Text style={{flex: columnWidths2[4], justifyContent: "end"}}>Min RT</Text>
						<Text style={{flex: columnWidths2[5], justifyContent: "end"}}>Max RT</Text>
						<Text style={{flex: columnWidths2[6], justifyContent: "end"}}>Calls</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{(GetSelectedAccessorMeta()?.callPlanMetas ?? [])
						.filter(meta=>store.callPlans_filter == "" || JSON.stringify(meta).includes(store.callPlans_filter))
						.map((meta, index)=>{
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
									<Text style={{flex: columnWidths2[2], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.totalRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths2[3], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.firstRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths2[4], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.minRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths2[5], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.maxRunTime.toFixed(1)}</Text>
									<Text style={{flex: columnWidths2[6], minWidth: 0, justifyContent: "end"}}>{meta.profilingInfo.callCount}</Text>
								</Row>
							);
						})}
					</div>
				</Column>
				<Column style={{flex: 35}}>
					<Row>
						<Text>Call plan</Text>
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
					</Row>
				</Column>
			</Row>
		);
	}
}