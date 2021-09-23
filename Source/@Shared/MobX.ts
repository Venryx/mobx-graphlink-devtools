import "react-universal-hooks";
import React, {Component, useRef} from "react";
import {EnsureClassProtoRenderFunctionIsWrapped} from "react-vextensions";
import {observer} from "mobx-react";
import {E} from "js-vextensions";
import {configure} from "mobx";

configure({
	enforceActions: "never",
});

// variant of observer(...) wrapper-func, which returns a simple function result, instead of a ReactJS element-info entry (needed for ShowMessageBox.message)
type IReactComponent = any; // temp
export function observer_simple<T extends IReactComponent>(target: T): T {
	return observer(target as any)["type"];
}

// variant of @observer decorator, which also adds (and is compatible with) class-hooks (similar to mobx-graphlink's @MGLObserver, but with more options)
export class Observer_Options {
	classHooks = true;
}
export function Observer(targetClass: Function);
export function Observer(options: Partial<Observer_Options>);
export function Observer(...args) {
	let opts = new Observer_Options();
	if (typeof args[0] == "function") {
		ApplyToClass(args[0]);
	} else {
		opts = E(opts, args[0]);
		return ApplyToClass;
	}

	function ApplyToClass(targetClass: Function) {
		if (opts.classHooks) ClassHooks(targetClass);
		//if (targetClass instanceof (BaseComponent.prototype as any)) {
		if (targetClass.prototype.PreRender) {
			EnsureClassProtoRenderFunctionIsWrapped(targetClass.prototype);
		}
		/*if (opts.mglObserver) {
			MGLObserver(opts.mglObserver_opts)(targetClass);
		} else {
			observer(targetClass as any);
		}*/
		observer(targetClass as any);
	}
}


export function ClassHooks(targetClass: Function) {
	const componentWillMount_orig = targetClass.prototype.componentWillMount;
	targetClass.prototype.componentWillMount = function() {
		const MAGIC_STACKS = GetMagicStackSymbol(this);
		if (!this[MAGIC_STACKS]) {
			// by initializing comp[MAGIC_STACKS] ahead of time, we keep react-universal-hooks from patching this.render
			this[MAGIC_STACKS] = {};
		}
		if (componentWillMount_orig) return componentWillMount_orig.apply(this, arguments);
	};

	const render_orig = targetClass.prototype.render;
	// note our patching Class.render, not instance.render -- this is compatible with mobx-react
	targetClass.prototype.render = function() {
		const MAGIC_STACKS = GetMagicStackSymbol(this);
		if (this[MAGIC_STACKS]) {
			// apply the stack-resetting functionality normally done in the on-instance patched this.render
			Object.getOwnPropertySymbols(this[MAGIC_STACKS]).forEach(k=>{
				this[MAGIC_STACKS][k] = 0;
			});
		}
		return render_orig.apply(this, arguments);
	};
}
let magicStackSymbol_cached: Symbol|undefined;
export function GetMagicStackSymbol(comp: Component) {
	if (magicStackSymbol_cached == null) {
		const instanceKey = React.version.indexOf("15") === 0 ? "_instance" : "stateNode";
		const ReactInternals = React["__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"];
		const compBeingRendered_real = ReactInternals.ReactCurrentOwner.current;

		const compBeingRendered_fake = {render: ()=>({})};
		ReactInternals.ReactCurrentOwner.current = {[instanceKey]: compBeingRendered_fake};
		// eslint-disable-next-line
		{
			//useClassRef(); // more straight-forward, but involves `require("react-universal-hooks")` from web-vcore, which is nice to be able to avoid
			/*const useRefIsModified = useRef["isModified"] ?? (useRef["isModified"] = useRef.toString().includes("useClassRef"));
			if (!useRefIsModified) throw new Error("Cannot get magic-stack symbol, because react-universal-hooks has not overridden the React.useRef function.");*/
			useRef(); // this triggers react-universal-hooks to attach data to the "comp being rendered" (fake object above)
		}
		ReactInternals.ReactCurrentOwner.current = compBeingRendered_real;

		// now we can obtain the secret magic-stacks symbol, by iterating the symbols on compBeingRendered_fake
		const symbols = Object.getOwnPropertySymbols(compBeingRendered_fake);
		const magicStackSymbol = symbols.find(a=>a.toString() == "Symbol(magicStacks)");
		magicStackSymbol_cached = magicStackSymbol;
	}
	return magicStackSymbol_cached as any; // needed for ts to allow as index
}