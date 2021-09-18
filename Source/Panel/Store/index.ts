import {n, O} from "@Shared/General";
import {makeObservable, observable} from "mobx";

export class AccessorMeta {
	name: string;
	profilingInfo = new ProfilingInfo();
	callPlanMetas: CallPlanMeta[];
	callPlansStored: number;
}
export class CallPlanMeta {
	index: number;
	argsStr: string;
	profilingInfo = new ProfilingInfo();
}
export class ProfilingInfo {
	calls = 0;
	calls_cached = 0;
	totalRunTime = 0;
	firstRunTime = 0;
	minRunTime = 0;
	maxRunTime = 0;
}

export class RootState {
	constructor() { makeObservable(this); }

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