import "../@Shared/PreStart_0";
import React from "react";
import ReactDOM from "react-dom";
import {RootUI} from "./UI/Root";

window.addEventListener("load", ()=>{
	const rootEl = document.getElementById("root");
	ReactDOM.render(React.createElement(RootUI), rootEl)
});