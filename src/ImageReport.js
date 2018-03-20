const puppeteer = require("puppeteer");
const ImageMap = require("./ImageMap");
const debug = require("debug")("imagereport");

class ImageReport {
	constructor(options) {
		this.options = Object.assign({}, this.defaultOptions, options || {});

		this.dprArray = (this.options.dpr || "").split(",").map(dpr => parseInt(dpr, 10));

		debug("Options: %o", this.options);

		this.map = {};
	}

	static get defaultOptions() {
		return {
			minViewportWidth: 320,
			maxViewportWidth: 1280,
			increment: 80,
			useCsv: false,
			dpr: "1,2,3",
			minImageWidth: 5
		};
	}

	getDprArraySize() {
		return this.dprArray.length;
	}

	async start() {
		this.browser = await puppeteer.launch();
	}

	async getPage(url, dpr) {
		let page = await this.browser.newPage();

		// page.setCacheEnabled(false);
		let defaultPageOptions = {
			width: this.options.minViewportWidth,
			height: 768,
			deviceScaleFactor: dpr
		};

		debug("Setting default page options %o", defaultPageOptions);
		await page.setViewport(defaultPageOptions);

		await page.goto(url, {
			waitUntil: ["load", "networkidle0"]
		});

		page.on("console", function(msg) {
			debug("(browser console): %o", msg.text());
		});

		return page;
	}

	async iterate(url, callback) {
		this.map[url] = new ImageMap();
		this.map[url].setMinimumImageWidth(this.options.minImageWidth);

		for( let j = 0, k = this.dprArray.length; j < k; j++ ) {
			let dpr = this.dprArray[j];
			await this.iterateViewports(url, dpr, callback);
		}
	}

	async iterateViewports(url, dpr, callback) {
		let page = await this.getPage(url, dpr);
		for(let width = this.options.minViewportWidth, end = this.options.maxViewportWidth; width <= end; width += this.options.increment) {
			let viewportOptions = {
				width: width,
				height: 768,
				deviceScaleFactor: dpr
			};
			debug("Setting viewport options: %o", viewportOptions);
			await page.setViewport(viewportOptions);

			// await page.reload({
			// 	waitUntil: ["load", "networkidle0"]
			// });

			for( let stats of await this.getImagesStats(page) ) {
				this.map[url].addImage(stats.id, dpr, stats);
			}

			callback();
		}
	}

	async getImagesStats(page) {
		return await page.evaluate(function() {
			function findNaturalWidth(src, stats, resolve, reject) {
				var naturalImg = document.createElement("img");
				naturalImg.src = src;
				naturalImg.onload = function() {
					resolve(Object.assign(stats, {
						fileWidth: naturalImg.naturalWidth,
						src: src,
					}));

					this.parentNode.removeChild(this);
				};

				naturalImg.onerror = function() {
					reject(`Could not load ${src}`);
				};

				document.body.appendChild(naturalImg);
			}

			let viewportWidth = document.documentElement.clientWidth;
			console.log(`New viewportWidth: ${viewportWidth}`);

			let imgNodes = document.querySelectorAll("img");
			let imgArray = Array.from(imgNodes);

			return Promise.all(
				imgArray.filter(function(img) {
					let src = img.currentSrc;
					if( !src ) {
						return true;
					}
					let split = (new URL(src)).pathname.split(".");
					if( !split.length ) {
						return true;
					}

					return split.pop().toLowerCase() !== "svg";
				}).map(function(img) {
					let key = "data-image-report-index";
					let id = img.getAttribute(key);
					if(!id) {
						id = img.getAttribute("src");
						console.log("Creating new img id", id);
						img.setAttribute(key, id);
					} else {
						console.log("Re-use existing img id", id);
					}

					let picture = img.closest("picture");
					img.removeAttribute(key);
					let html = (picture || img).outerHTML.replace(/\t/g, "");
					img.setAttribute(key, id);

					console.log(`width: ${img.clientWidth}`);

					// this is wrong in chrome when used with srcset
					// console.log(`natural width: ${img.naturalWidth}`);
					console.log(`currentSrc: ${img.currentSrc}`);

					let stats = {
						id: id,
						width: img.clientWidth,
						viewportWidth: viewportWidth,
						html: html
					};

					return new Promise(function(resolve, reject) {
						try {
							if( !img.currentSrc ) {
								img.onload = function() {
									img.onload = null;

									findNaturalWidth(img.currentSrc, stats, resolve, reject);
								};
							} else {
								findNaturalWidth(img.currentSrc, stats, resolve, reject);
							}

						} catch(e) {
							console.log("Error: ", e);
						}
					});
				})
			);
		});
	}
	
	getResults() {
		let output = [];
		for( let url in this.map ) {
			let str = this.map[url].getOutput(this.options.useCsv);
			output.push(str);
		}

		return output.join( "\n" );
	}

	async finish() {
		if( !this.browser ) {
			throw new Error("this.browser doesn’t exist, did you run .start()?");
		}
		await this.browser.close();
	}
}

module.exports = ImageReport;