import {HSLA} from "@Shared/FromWVC";
import {vScrollBar_width} from "@Shared/General";
import {Assert, CE, E} from "js-vextensions";
import {runInAction} from "mobx";
import {observer} from "mobx-react";
import {GetSelectedAccessorMeta, store} from "Panel/Store";
import {AccessorMeta, GetMetricStr} from "Panel/Store/@AccessorMeta";
import React, {useState} from "react";
import {Button, Column, Row, Text, TextInput} from "react-vcomponents";
import {BaseComponent} from "react-vextensions";

const columnWidths = [1, "0 50px", "0 50px", "0 50px", "0 50px", "0 50px", "0 50px", "0 45px", "0 45px", "0 45px"];
const columnWidths2 = ["0 40px", 1, "0 45px", "0 45px", "0 45px", "0 45px", "0 45px", "0 45px", "0 40px", "0 40px"];

function RefreshAccessorMetas() {
	chrome.devtools.inspectedWindow.eval("globalThis.mglDevTools_hook.GetAccessorMetadatas()", (result: AccessorMeta[], exceptionInfo)=>{
		Assert(Array.isArray(result), `Got invalid result:${result}`);
		/*if (result.length) {
			Assert(typeof result[0] == "string", `Invalid entry:${JSON.stringify(result[0])}`);
		}*/

		// sort the results (note: in-page function should already have sorted the result descendingly by runTime_sum+waitTime_sum)
		result = CE(result).OrderByDescending(a=>a.profilingInfo.runTime_sum + a.profilingInfo.waitTime_sum);
		for (const meta of result) {
			meta.callPlanMetas = CE(meta.callPlanMetas).OrderByDescending(a=>a.profilingInfo.runTime_sum + a.profilingInfo.waitTime_sum);
		}

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
			<Row style={{height: "100%", columnGap: 7}}>
				<Column style={{flex: 27.5}}>
					<Row>
						<Text>Accessors</Text>
						<Row ml="auto">
							<Text>Filter:</Text>
							<TextInput ml={5} instant={true} value={store.accessors_filter} onChange={val=>store.accessors_filter = val}/>
							<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
							<Button ml={5} text="Info" onClick={()=>{
								alert(CE(`
									Notes:
									* Yellow background means the custom-accessor made a direct/raw database query/access.
								`).AsMultiline(0));
							}}/>
						</Row>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={cellStyle(0, {textToRight: false})}>Name</Text>
						<Text style={cellStyle(1, {}, {fontSize: 11})}>Run+wait</Text>
						<Text style={cellStyle(2, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle(3)}>Run</Text>
						<Text style={cellStyle(4, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle(5)}>Wait</Text>
						<Text style={cellStyle(6, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle(7)}>Calls</Text>
						<Text style={cellStyle(8, {}, {fontSize: 9})}>(no-cache)</Text>
						<Text style={cellStyle(9, {}, {fontSize: 10})}>Call plans</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{store.accessorMetas
						.filter(meta=>store.accessors_filter == "" || JSON.stringify(meta).includes(store.accessors_filter))
						.map((meta, index)=>{
							const selected = store.selectedAccessorMeta_index == index;
							const dbAccessStyle = meta.madeRawDBAccess ? {background: "rgba(200,200,0,.5)"} : {};
							return (
								<Row key={index}
										style={E(
											{cursor: "pointer"},
											selected && {background: HSLA(0, 0, .5, .5)}
										)}
										onClick={()=>store.selectedAccessorMeta_index = index}>
									<Text style={cellStyle(0, {textToRight: false}, {overflowWrap: "anywhere"})}>{meta.name}</Text>
									<Text style={cellStyle(1, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "runTime+waitTime", "sum")}</Text>
									<Text style={cellStyle(2, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "runTime+waitTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle(3)}>{GetMetricStr(meta.profilingInfo, "runTime", "sum")}</Text>
									<Text style={cellStyle(4)}>{GetMetricStr(meta.profilingInfo, "runTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle(5, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "waitTime", "sum")}</Text>
									<Text style={cellStyle(6, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "waitTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle(7)}>{meta.profilingInfo.calls}</Text>
									<Text style={cellStyle(8)}>{meta.profilingInfo.calls - meta.profilingInfo.calls_cached}</Text>
									<Text style={cellStyle(9)}>{meta.callPlansStored}</Text>
								</Row>
							);
						})}
					</div>
				</Column>
				<Column style={{flex: 37.5}}>
					<Row>
						<Text>Call plans (for: {GetSelectedAccessorMeta()?.name})</Text>
						<Row ml="auto">
							<Text>Filter:</Text>
							<TextInput ml={5} instant={true} value={store.callPlans_filter} onChange={val=>store.callPlans_filter = val}/>
							<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
							<Button ml={5} text="Info" onClick={()=>{
								alert(CE(`
									Notes:
									* Yellow background means the custom-accessor made a direct/raw database query/access.
								`).AsMultiline(0));
							}}/>
						</Row>
					</Row>
					<Row style={{paddingRight: vScrollBar_width}}>
						<Text style={cellStyle2(0, {textToRight: false})}>Index</Text>
						<Text style={cellStyle2(1, {textToRight: false})}>Call args</Text>
						<Text style={cellStyle2(2, {}, {fontSize: 11})}>Run+wait</Text>
						<Text style={cellStyle2(3, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle2(4)}>Run</Text>
						<Text style={cellStyle2(5, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle2(6)}>Wait</Text>
						<Text style={cellStyle2(7, {}, {fontSize: 10})}>({store.profilingSubmetric})</Text>
						<Text style={cellStyle2(8)}>Calls</Text>
						<Text style={cellStyle2(9, {}, {fontSize: 8})}>(no-cache)</Text>
					</Row>
					<div style={{overflowY: "scroll"}}>
						{(GetSelectedAccessorMeta()?.callPlanMetas ?? [])
						.filter(meta=>store.callPlans_filter == "" || JSON.stringify(meta).includes(store.callPlans_filter))
						.map((meta, index)=>{
							const selected = store.selectedCallPlan_index == index;
							const dbAccessStyle = meta.madeRawDBAccess ? {background: "rgba(200,200,0,.5)"} : {};
							return (
								<Row key={index}
										style={E(
											{cursor: "pointer"},
											selected && {background: HSLA(0, 0, .5, .5)}
										)}
										onClick={()=>store.selectedCallPlan_index = index}>
									<Text style={cellStyle2(0, {textToRight: false})}>#{meta.index}</Text>
									<Text style={cellStyle2(1, {textToRight: false}, {overflowWrap: "anywhere"})}>{meta.argsStr}</Text>
									<Text style={cellStyle2(2, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "runTime+waitTime", "sum")}</Text>
									<Text style={cellStyle2(3, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "runTime+waitTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle2(4)}>{GetMetricStr(meta.profilingInfo, "runTime", "sum")}</Text>
									<Text style={cellStyle2(5)}>{GetMetricStr(meta.profilingInfo, "runTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle2(6, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "waitTime", "sum")}</Text>
									<Text style={cellStyle2(7, {}, dbAccessStyle)}>{GetMetricStr(meta.profilingInfo, "waitTime", store.profilingSubmetric)}</Text>
									<Text style={cellStyle2(8)}>{meta.profilingInfo.calls}</Text>
									<Text style={cellStyle2(9)}>{meta.profilingInfo.calls - meta.profilingInfo.calls_cached}</Text>
								</Row>
							);
						})}
					</div>
				</Column>
				{store.showDetailPanel &&
				<Column style={{flex: 35}}>
					<Row>
						<Text>Call plan</Text>
						<Button ml={5} text="Refresh" onClick={()=>RefreshAccessorMetas()}/>
					</Row>
				</Column>}
			</Row>
		);
	}
}