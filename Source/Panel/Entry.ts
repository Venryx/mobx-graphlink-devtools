import "../@Shared/PreStart_0";
import React from "react";
import ReactDOM from "react-dom";
import {RootUI} from "./UI/Root";

//document.onload = ()=>{
window.addEventListener("load", ()=>{
	//document.body.append("Test123");
	const rootEl = document.getElementById("root");
	ReactDOM.render(React.createElement(RootUI), rootEl)
});