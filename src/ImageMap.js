const Image = require("./Image");
const { table } = require("table");
const chalk = require("chalk");

class ImageMap {
	constructor() {
		this.map = {};
		this.showCurrentSrc = false;
		this.showPercentages = true;
	}

	setMinimumImageWidth(width) {
		this.minImageWidth = width;
	}

	setShowCurrentSrc(showCurrentSrc) {
		this.showCurrentSrc = !!showCurrentSrc;
	}

	setShowPercentages(showPercentages) {
		this.showPercentages = !!showPercentages;
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

	_getTableHeadersForIdentifier(identifier) {
		let tableHeaders = [
			["", "Image"],
			["", "Width in"],
			["Viewport", "Layout"]
		];
		let map = this.map[identifier];

		for( let dpr in map ) {
			tableHeaders[0].push(`@${dpr}x`);
			tableHeaders[1].push(`Image`);
			tableHeaders[2].push(`Width`);
			tableHeaders[0].push(`@${dpr}x`);
			if( this.showPercentages ) {
				tableHeaders[1].push(`Percentage`);
				tableHeaders[2].push(`Match`);
			} else {
				tableHeaders[1].push(`Ratio`);
				tableHeaders[2].push(``);
			}

			if(this.showCurrentSrc) {
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

	_getOutputObj() {
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
					let widthRatio = vwStats.efficiency;

					let percentage = (widthRatio * 100 / dprNum).toFixed(1);
					let str = `${widthRatio.toFixed(2)}x`;

					if( this.showPercentages ) {
						str = `${percentage}%`;
					}

					let efficiencyOutput;
					if( widthRatio < 1 || percentage < 75 ) {
						efficiencyOutput = chalk.red(str);
					} else if( percentage < 92 || percentage > 150 ) {
						efficiencyOutput = chalk.yellow(str);
					} else {
						efficiencyOutput = str;
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

					if( this.showCurrentSrc ) {
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
					headers: this._getTableHeadersForIdentifier(identifier, this.showCurrentSrc),
					content: tableContent
				};
			}
		}

		return output;
	}

	getCsvOutput() {
		this.setShowCurrentSrc(true);

		let DELIMITER = ",";
		let obj = this._getOutputObj();
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
			`${chalk.underline("Legend")}:  @1x ${chalk.red("<100%")} ${chalk.yellow(">150%")}    Above @1x ${chalk.red("<75%")} ${chalk.yellow("75%–92%, >150%")}\n`);
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