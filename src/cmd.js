#!/usr/bin/env node
const ImagingHeap = require("./ImagingHeap");
let defaults = ImagingHeap.defaultOptions;

const argv = require("yargs")
	.usage("imagingheap http://example.com/ [options]")
	.demandCommand(1)
	.options({
		min: {
			describe: "Minimum viewport width",
			default: defaults.minViewportWidth
		},
		max: {
			describe: "Maximum viewport width",
			default: defaults.maxViewportWidth
		},
		by: {
			describe: "Increment viewport by",
			default: defaults.increment
		},
		dpr: {
			describe: "List of Device Pixel Ratios",
			default: defaults.dpr,
			type: "string"
		},
		minimagewidth: { // tracking pixels
			describe: "Ignore images smaller than image width",
			default: defaults.minImageWidth
		},
		csv: {
			describe: "Output CSV",
			default: defaults.useCsv,
			type: "boolean"
		}
	})
	.help()
	.argv;

const ProgressBar = require("progress");

(async function() {
	try {
		let report = new ImagingHeap({
			minViewportWidth: argv.min,
			maxViewportWidth: argv.max,
			increment: argv.by,
			useCsv: argv.csv,
			dpr: argv.dpr,
			minImageWidth: argv.minimagewidth
		});

		let bar;
		if (!process.env.DEBUG) {
			bar = new ProgressBar(":bar :current/:total", {
				incomplete: ".",
				clear: true,
				callback: async function() {
					await report.finish();
					console.log(report.getResults());
				},
				total: ((argv.max - argv.min) / argv.by + 1) * report.getDprArraySize()
			});
		}

		await report.start();

		await report.iterate(argv._.pop(), function() {
			if (bar) {
				bar.tick();
			}
		});

		if (!bar) {
			await report.finish();
			console.log(report.getResults());
		}
	} catch (e) {
		console.log("Error!", e);
	}
})();
