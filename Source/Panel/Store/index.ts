import {n, O} from "@Shared/General";
import {makeObservable, observable} from "mobx";
import {AccessorMeta, ProfilingSubmetric} from "./@AccessorMeta";

export class RootState {
	constructor() { makeObservable(this); }

	@O profilingSubmetric = ProfilingSubmetric.max;
	@O showDetailPanel = false; // temporarily false

	@O accessorMetas = [] as AccessorMeta[];
	@O selectedAccessorMeta_index: number;
	@O selectedCallPlan_index: number;

	@O accessors_filter = "";
	@O callPlans_filter = "";
}

export function GetSelectedAccessorMeta() {
	return store.accessorMetas[store.selectedAccessorMeta_index];
}
export function GetSelectedCallPlan() {
	const accessorMeta = GetSelectedAccessorMeta();
	if (accessorMeta == null) return null;
	return accessorMeta.callPlanMetas[store.selectedCallPlan_index];
}

export const store = new RootState();
G({store});