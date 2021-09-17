// some libraries try to read from `process.env`, even when not in a NodeJS environment
globalThis.process ??= {
	env: {},
} as any;