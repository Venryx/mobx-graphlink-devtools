export class AccessorMeta {
	name: string;
	profilingInfo = new ProfilingInfo();
	madeRawDBAccess = false;
	callPlanMetas: CallPlanMeta[];
	callPlansStored: number;
}
export class CallPlanMeta {
	index: number;
	argsStr: string;
	profilingInfo = new ProfilingInfo();
	madeRawDBAccess = false;
}
export class ProfilingInfo {
	calls = 0;
	calls_cached = 0;
	calls_waited = 0;

	runTime_sum = 0;
	runTime_first = 0;
	runTime_min = 0;
	runTime_max = 0;

	waitTime_sum = 0;
	waitTime_first = 0;
	waitTime_min = 0;
	waitTime_max = 0;
	
	currentWaitTime_startedAt: number|undefined;
}

export type MetricType = "runTime" | "waitTime" | "runTime+waitTime";
export enum ProfilingSubmetric {
	sum = "sum",
	"1st" = "1st",
	min = "min",
	max = "max",
	avg = "avg",
}
export type ProfilingSubmetric_Value = `${ProfilingSubmetric}`;

export function GetMetricStr(profilingInfo: ProfilingInfo, metricType: MetricType, submetric: ProfilingSubmetric_Value, decimals = 1) {
	return GetMetric(profilingInfo, metricType, submetric).toFixed(decimals);
}
export function GetMetric(profilingInfo: ProfilingInfo, metricType: MetricType, submetric: ProfilingSubmetric_Value) {
	const p = profilingInfo, r = metricType.includes("runTime"), w = metricType.includes("waitTime");
	//console.log("Test1:", p, r, w);
	if (submetric == "sum") return (r ? p.runTime_sum : 0) + (w ? p.waitTime_sum : 0);
	if (submetric == "1st") return (r ? p.runTime_first : 0) + (w ? p.waitTime_first : 0);
	if (submetric == "min") return (r ? p.runTime_min : 0) + (w ? p.waitTime_min : 0);
	if (submetric == "max") return (r ? p.runTime_max : 0) + (w ? p.waitTime_max : 0);
	if (submetric == "avg") return ((r ? p.runTime_sum : 0) + (w ? p.waitTime_sum : 0)) / profilingInfo.calls;
	throw new Error("Invalid metric/submetric.");
}