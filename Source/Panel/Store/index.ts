import {n, O} from "@Shared/General";
import {makeObservable, observable} from "mobx";


export class AccessorMeta {
	name: string;
	totalRunTime: number;
	callCount: number;
	callPlansStored: number;
}

export class RootState {
	constructor() { makeObservable(this); }

	@O accessorMetas = [] as AccessorMeta[];
	@O selectedAccessorMeta_index: number;
}

export function GetSelectedAccessorMeta() {
	return store.accessorMetas[store.selectedAccessorMeta_index];
}

export const store = new RootState();
G({store});