import {HSLA} from "@Shared/FromWVC";
import {vScrollBar_width} from "@Shared/General";
import {Assert, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import React, {useState} from "react";
import {Button, Column, Row, Text, TextInput} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

const columnWidths = [1, "0 50px", "0 30px", "0 30px", "0 30px", "0 30px", "0 50px", "0 50px"];
const columnWidths2 = ["0 50px", 1, "0 50px", "0 30px", "0 30px", "0 30px", "0 30px", "0 50px"];

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
		
		const cellStyle = (index: number, opts?: {textToRight?: boolean}, extraStyles?: any)=>{
			return E(...[
				{flex: columnWidths[index], minWidth: 0},
				extraStyles,
				opts?.textToRight != false && {justifyContent: "end"},
			].filter(a=>a));
		};
		const cellStyle2 = (index: number, opts?: {textToRight?: boolean}, extraStyles?: any)=>{
			return E(...[
				{flex: columnWidths2[index], minWidth: 0},
				extraStyles,
				opts?.textToRight != false && {justifyContent: "end"},
			].filter(a=>a));
		};

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
						<Text style={cellStyle(0, {textToRight: false})}>Name</Text>
						<Text style={cellStyle(1, {}, {fontSize: 11})}>Run-time:</Text>
						<Text style={cellStyle(2)}>Avg</Text>
						<Text style={cellStyle(3)}>1st</Text>
						<Text style={cellStyle(4)}>Min</Text>
						<Text style={cellStyle(5)}>Max</Text>
						<Text style={cellStyle(6)}>Calls</Text>
						<Text style={cellStyle(7, {}, {fontSize: 11})}>Call plans</Text>
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
									<Text style={cellStyle(0, {textToRight: false}, {overflowWrap: "anywhere"})}>{meta.name}</Text>
									<Text style={cellStyle(1)}>{meta.profilingInfo.totalRunTime.toFixed(1)}</Text>
									<Text style={cellStyle(2)}>{(meta.profilingInfo.totalRunTime / meta.profilingInfo.callCount).toFixed(1)}</Text>
									<Text style={cellStyle(3)}>{meta.profilingInfo.firstRunTime.toFixed(1)}</Text>
									<Text style={cellStyle(4)}>{meta.profilingInfo.minRunTime.toFixed(1)}</Text>
									<Text style={cellStyle(5)}>{meta.profilingInfo.maxRunTime.toFixed(1)}</Text>
									<Text style={cellStyle(6)}>{meta.profilingInfo.callCount}</Text>
									<Text style={cellStyle(7)}>{meta.callPlansStored}</Text>
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
						<Text style={cellStyle2(0, {textToRight: false})}>Index</Text>
						<Text style={cellStyle2(1, {textToRight: false})}>Call args</Text>
						<Text style={cellStyle2(2, {}, {fontSize: 11})}>Run-time:</Text>
						<Text style={cellStyle2(3)}>Avg</Text>
						<Text style={cellStyle2(4)}>1st</Text>
						<Text style={cellStyle2(5)}>Min</Text>
						<Text style={cellStyle2(6)}>Max</Text>
						<Text style={cellStyle2(7)}>Calls</Text>
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
									<Text style={cellStyle2(0, {textToRight: false})}>#{meta.index}</Text>
									<Text style={cellStyle2(1, {textToRight: false}, {overflowWrap: "anywhere"})}>{meta.argsStr}</Text>
									<Text style={cellStyle2(2)}>{meta.profilingInfo.totalRunTime.toFixed(1)}</Text>
									<Text style={cellStyle2(3)}>{(meta.profilingInfo.totalRunTime / meta.profilingInfo.callCount).toFixed(1)}</Text>
									<Text style={cellStyle2(4)}>{meta.profilingInfo.firstRunTime.toFixed(1)}</Text>
									<Text style={cellStyle2(5)}>{meta.profilingInfo.minRunTime.toFixed(1)}</Text>
									<Text style={cellStyle2(6)}>{meta.profilingInfo.maxRunTime.toFixed(1)}</Text>
									<Text style={cellStyle2(7)}>{meta.profilingInfo.callCount}</Text>
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