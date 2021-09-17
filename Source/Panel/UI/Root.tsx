import React, {useState} from "react";
import {BaseComponent} from "react-vextensions";
import {Column, Row, Select} from "react-vcomponents";
import {ClassHooks} from "@Shared/MobX";
import {HSLA} from "@Shared/FromWVC";
import {AccessorsUI} from "./Accessors";

const tabs = ["Accessors"];
@ClassHooks
export class RootUI extends BaseComponent<{}, {}> {
	render() {
		let {} = this.props;
		let [tab, setTab] = useState("Accessors");
		return (
			<Column>
				<Row style={{padding: 5, background: HSLA(0, 0, 0, .5)}}>
					<Select displayType="button bar" options={tabs} value={tab} onChange={val=>setTab(val)}/>
				</Row>
				{tab == "Accessors" && <AccessorsUI/>}
			</Column>
		);
	}
}