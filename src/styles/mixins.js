// Mixins by Josh Dronsfield @dronz_

import { css, } from "styled-components";
import theme from "./theme";

// --------------------------------------------------

const objMap = (obj, cb) => Object.keys(obj).reduce((acc, key) => ({
	...acc,
	[key]: cb(key, obj[key]),
}), {});

// --------------------------------------------------
// Breakpoints

export const bp = objMap(theme.bps, (key, val) => ({
	min: (...cont) => css`
		@media (min-width: ${val.min}px) {
			${css(...cont)}
		}
	`,
	max: (...cont) => css`
		@media (max-width: ${val.max}px) {
			${css(...cont)}
		}
	`,
	only: (...cont) => css`
		@media (min-width: ${val.min}px) and (max-width: ${val.max}px) {
			${css(...cont)}
		}
	`,
}));

export const xs = bp.xs.only;
export const sm = bp.sm.only;
export const md = bp.md.only;
export const lg = bp.lg.only;

export const bpEach = (prop, vals) => css`
	${Object.keys(vals).map((key) => bp[key].only`${prop}: ${vals[key]};`)}
`;

export const bpEither = (prop, vals) => css`
	${xs`${prop}: ${vals.xs};`}
	${bp.sm.min`${prop}: ${vals.other};`}
`;

// --------------------------------------------------

export const shadow = (elevation = 1) => ({
	"1": "box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);",
	"2": "box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);",
	"3": "box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);",
	"4": "box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);",
	"5": "box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
	"-1": "box-shadow: inset 0 -1px 3px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(0,0,0,0.24);",
}[elevation]);
