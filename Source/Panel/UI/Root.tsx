import React, {useState} from "react";
import {BaseComponent} from "react-vextensions";
import {Column, Row, Select} from "react-vcomponents";
import {ClassHooks} from "@Shared/MobX";
import {HSLA} from "@Shared/FromWVC";
import {AccessorsUI} from "./Accessors";
import {ExtrasUI} from "./Extras";

const tabs = ["Accessors", "Extras"];
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
				</Row>
				<div style={{flex: 1, height: "calc(100% - 36px)"}}>
					{tab == "Accessors" && <AccessorsUI/>}
					{tab == "Extras" && <ExtrasUI/>}
				</div>
			</Column>
		);
	}
}