#!/usr/bin/env node
const argv = require("yargs")
	.usage("imagereport http://example.com/ [options]")
	.demandCommand(1)
	.default("min", 320)
	.default("max", 1280)
	.default("by", 80)
	.default("dpr", "1,2,3")
	.default("csv", false).argv;

const ProgressBar = require("progress");
const ImageReport = require("./ImageReport");

(async function() {
	try {
		let dprs = (argv.dpr || "").split(",").map(dpr => parseInt(dpr, 10));

		let report = new ImageReport({
			minViewportWidth: argv.min,
			maxViewportWidth: argv.max,
			increment: argv.by,
			useCsv: argv.csv,
			dpr: dprs
		});

		let bar;
		if( !process.env.DEBUG ) {
			bar = new ProgressBar(':bar :current/:total', {
				incomplete: ".",
				clear: true,
				callback: async function() {
					await report.finish();
					console.log(report.getResults());
				},
				total: ( (argv.max - argv.min) / argv.by + 1 ) * dprs.length
			});
		}

		await report.start();

		await report.iterate(argv._.pop(), function() {
			if( bar ) {
				bar.tick();
			}
		});

		if(!bar) {
			await report.finish();
			console.log(report.getResults());
		}
	} catch (e) {
		console.log("Error!", e);
	}
})();
