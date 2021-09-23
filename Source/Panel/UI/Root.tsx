import React, {useState} from "react";
import {BaseComponent} from "react-vextensions";
import {CheckBox, Column, Row, Select, Text} from "react-vcomponents";
import {ClassHooks} from "@Shared/MobX";
import {HSLA} from "@Shared/FromWVC";
import {AccessorsUI} from "./Accessors";
import {ExtrasUI} from "./Extras";
import {GetEntries} from "js-vextensions";
import {store} from "Panel/Store";
import {observer} from "mobx-react";
import {ProfilingSubmetric} from "Panel/Store/@AccessorMeta";

const tabs = ["Accessors", "Extras"];
@observer
@ClassHooks
export class RootUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		let [tab, setTab] = useState("Accessors");
		return (
			<Column style={{
				height: "100%",
				//background: "black",
			}}>
				<Row style={{height: 36, padding: 5, background: HSLA(0, 0, 0, .5)}}>
					<Select displayType="button bar" options={tabs} value={tab} onChange={val=>setTab(val)}/>
					{tab == "Accessors" &&
					<Row ml="auto">
						<Text>Profiling sub-metric:</Text>
						<Select ml={5} options={GetEntries(ProfilingSubmetric).filter(a=>a.name != "sum")}
							value={store.profilingSubmetric} onChange={val=>store.profilingSubmetric = val}/>
						<CheckBox text="Show detail panel" value={store.showDetailPanel} onChange={val=>store.showDetailPanel = val}/>
					</Row>}
				</Row>
				<div style={{flex: 1, height: "calc(100% - 36px)"}}>
					{tab == "Accessors" && <AccessorsUI/>}
					{tab == "Extras" && <ExtrasUI/>}
				</div>
			</Column>
		);
	}
}