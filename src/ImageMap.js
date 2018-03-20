const Image = require("./Image");
const { table } = require("table");
const chalk = require("chalk");

class ImageMap {
	constructor() {
		this.map = {};
	}

	setMinimumImageWidth(width) {
		this.minImageWidth = width;
	}

	addImage(identifier, dpr, stats) {
		if( !this.map[identifier] ) {
			this.map[identifier] = {};
		}

		let img = this.map[identifier][dpr];

		if(!img) {
			img = new Image();
			this.map[identifier][dpr] = img;
		}

		img.addStatsObject(stats);
	}

	getMap() {
		return this.map;
	}

	getNumberOfImages() {
		return Object.keys(this.map).length;
	}

	truncateUrl(url) {
		// let urlMaxLength = 20;
		// return (url.length > urlMaxLength ? "…" : "") + url.substr(-1 * urlMaxLength);
		return url.split("/").pop();
	}

	_getOutputObj() {
		let output = {};
		for( let identifier in this.map ) {
			let map = this.map[identifier];
			let tableHeaders = ["Viewport", "Width in"];
			let tableHeadersRow2 = ["", "Layout"];
			let tableRows = {};
			let htmlOutput = "";
			let includeInOutput = false;

			for( let dpr in map ) {
				tableHeaders.push(`Match`);
				tableHeadersRow2.push(`to ${dpr}x`);
				// tableHeaders.push("currentSrc");
				tableHeaders.push(`File`);
				tableHeadersRow2.push(`Width`);

				let stats = map[dpr].getStats();
				for( let vwStats of stats ) {
					if( !htmlOutput ) {
						htmlOutput = `${vwStats.html}`;
					}
					let dprNum = parseInt(dpr);
					let efficiencyValue = vwStats.efficiency.toFixed(2);

					let compare = efficiencyValue - dprNum;
					let efficiencyOutput;
					if( dprNum === 1 && compare < 0 ) {
						efficiencyOutput = chalk.red(`${efficiencyValue}x`);
					} else if( compare < -.25 ) {
						efficiencyOutput = chalk.yellow(`${efficiencyValue}x`);
					} else if( compare >= -.25 && compare <= .25 ) { // relies on < 0 && dpr === 1 above
						efficiencyOutput = chalk.green(`${efficiencyValue}x`);
					} else {
						efficiencyOutput = `${efficiencyValue}x`;
					}

					let vw = `${vwStats.viewportWidth}px`;
					if(!tableRows[vw]) {
						if(vwStats.width && (!this.minImageWidth || vwStats.width > this.minImageWidth)) {
							includeInOutput = true;
						}
						tableRows[vw] = [`${vwStats.width}px`];
					}
					tableRows[vw].push(efficiencyOutput);
					// tableRows[vw].push(this.truncateUrl(vwStats.src));
					tableRows[vw].push(`${vwStats.fileWidth}px`);
				}
			}

			if( includeInOutput ) {
				let tableContent = [tableHeaders, tableHeadersRow2];
				for(let row in tableRows) {
					tableContent.push([].concat(row, tableRows[row]));
				}

				output[htmlOutput] = tableContent;
			}
		}

		return output;
	}

	getCsvOutput() {
		let DELIMITER = ",";
		let obj = this._getOutputObj();
		let output = [];
		for( let html in obj ) {
			output.push(html);
			for( let row of obj[html]) {
				output.push(row.join(DELIMITER));
			}
			output.push("");
		}

		return output.join("\n");
	}

	getOutput() {
		let obj = this._getOutputObj();
		let output = [];

		for( let html in obj ) {
			output.push(html);
			output.push(table(obj[html], {
				drawHorizontalLine: (index, size) => {
					return index === 0 || index === 2 || index === size;
				}
			}));
		}

		// output.push();
		// output.push("Match > 1 means the image is too big (wasted detail).");
		// output.push("Match < 1 means the image is too small (blurry render).");

		return output.join("\n");
	}
}

module.exports = ImageMap;