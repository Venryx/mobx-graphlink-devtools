import {Assert} from "js-vextensions";

export type CSSColorStringType = "hsl" | "hsla";
/** Converts color-props into a css color-string of the specified format. */
export function CSSColor(
	/** [0-360] RefPoints: {red: 0, orange: 38, yellow: 60, green: 120, blue: 240, violet: 300, indigo: 274[?]} */
	hue: number,
	/** [0-1] */ saturation: number, /** [0-1] */ brightness: number, /** [0-1] */ alpha = 1,
	cssType: CSSColorStringType = "hsla",
) {
	if (cssType == "hsl") return `hsl(${hue}, ${saturation * 100}%, ${brightness * 100}%)`;
	if (cssType == "hsla") return `hsla(${hue}, ${saturation * 100}%, ${brightness * 100}%, ${alpha})`;
	Assert(false);
}
export function HSL(
	/** [0-360] RefPoints: {red: 0, orange: 38, yellow: 60, green: 120, blue: 240, violet: 300, indigo: 274[?]} */ hue: number,
	/** [0-1] */ saturation: number, /** [0-1] */ brightness: number,
) {
	return CSSColor(hue, saturation, brightness, undefined, "hsl");
}
export function HSLA(
	/** [0-360] RefPoints: {red: 0, orange: 38, yellow: 60, green: 120, blue: 240, violet: 300, indigo: 274[?]} */ hue: number,
	/** [0-1] */ saturation: number, /** [0-1] */ brightness: number, /** [0-1] */ alpha = 1,
) {
	return CSSColor(hue, saturation, brightness, alpha, "hsla");
}