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

	_getTableHeadersForIdentifier(identifier, showCurrentSrc) {
		let tableHeaders = [
			["", "Image"],
			["", "Width in"],
			["Viewport", "Layout"]
		];
		let map = this.map[identifier];

		for( let dpr in map ) {
			tableHeaders[0].push(`@${dpr}x`);
			tableHeaders[1].push(`File`);
			tableHeaders[2].push(`Width`);
			tableHeaders[0].push(`@${dpr}x`);
			tableHeaders[1].push(`Ratio`);
			tableHeaders[2].push(``);

			if(showCurrentSrc) {
				tableHeaders[0].push(``);
				tableHeaders[1].push(`@${dpr}x`);
				tableHeaders[2].push(`currentSrc`);
			}
		}

		return tableHeaders;
	}

	_convertTableHeadersToString(headers) {
		let ret = [];
		let firstRow = true;
		for( let row of headers ) {
			for( let colKey = 0, k = row.length; colKey < k; colKey++ ) {
				if( firstRow ) {
					ret.push([]);
				}

				if( row[colKey] ) {
					ret[colKey].push(row[colKey]);
				}
			}

			firstRow = false;
		}
		return ret.map(header => header.join(" "));
	}

	_getOutputObj(showCurrentSrc) {
		let output = {};
		for( let identifier in this.map ) {
			let map = this.map[identifier];
			
			let tableRows = {};
			let htmlOutput = "";
			let includeInOutput = false;

			for( let dpr in map ) {
				let stats = map[dpr].getStats();
				for( let vwStats of stats ) {
					if( !htmlOutput ) {
						htmlOutput = `${vwStats.html}`;
					}
					let dprNum = parseInt(dpr);
					let widthRatio = vwStats.efficiency.toFixed(2);

					let compare = widthRatio - dprNum;
					let efficiencyOutput;
					if( widthRatio < 1 || compare < -.4 ) {
						efficiencyOutput = chalk.red(`${widthRatio}x`);
					} else if( compare < -.25 ) {
						efficiencyOutput = chalk.yellow(`${widthRatio}x`);
					} else {
						efficiencyOutput = `${widthRatio}x`;
					}

					let vw = `${vwStats.viewportWidth}px`;
					if(!tableRows[vw]) {
						if(vwStats.width && (!this.minImageWidth || vwStats.width > this.minImageWidth)) {
							includeInOutput = true;
						}
						tableRows[vw] = [`${vwStats.width}px`];
					}
					tableRows[vw].push(`${vwStats.fileWidth}px`);
					tableRows[vw].push(efficiencyOutput);

					if( showCurrentSrc ) {
						tableRows[vw].push(vwStats.src);
					}
				}
			}

			if( includeInOutput ) {
				let tableContent = [];
				for(let row in tableRows) {
					tableContent.push([].concat(row, tableRows[row]));
				}

				output[htmlOutput] = {
					headers: this._getTableHeadersForIdentifier(identifier, showCurrentSrc),
					content: tableContent
				};
			}
		}

		return output;
	}

	getCsvOutput() {
		let DELIMITER = ",";
		let obj = this._getOutputObj(true);
		let output = [];
		for( let html in obj ) {
			output.push(this._convertTableHeadersToString(obj[html].headers));
			for( let row of obj[html].content) {
				output.push(row.join(DELIMITER));
			}
			output.push("# ---"); // DELIMIT CSV FILES
		}

		return output.join("\n");
	}

	_getOutput() {
		let obj = this._getOutputObj();
		let output = [];

		for( let html in obj ) {
			output.push(html);

			let rows = [].concat(obj[html].headers, obj[html].content);
			output.push(table(rows, {
				drawHorizontalLine: (index, size) => {
					return index === 0 || index === 3 || index === size;
				}
			}) +
			chalk.underline("Legend") +
			": " + 
			chalk.red("Too blurry—need a bigger image!") +
			" " +
			chalk.yellow("Close but room for improvement!") + "\n");
		}

		let size = this.getNumberOfImages();
		output.push(size + " bitmap image" + (size !== 1 ? "s" : "") + " found.");

		return output.join("\n");
	}

	getOutput(useCsv) {
		if(useCsv) {
			chalk.enabled = false;

			return this.getCsvOutput();
		}

		return this._getOutput();
	}
}

module.exports = ImageMap;