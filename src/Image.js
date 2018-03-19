class Image {
	constructor() {
		this.sizes = {};
		this.html = "";
	}

	setHTML( html ) {
		this.html = html;
	}

	addStatsObject( stats ) {
		this.sizes[ parseInt( stats.viewportWidth, 10 ) ] = stats;
	}

	addStats( viewportWidth, dimensions, fileDimensions, src ) {
		let obj = {
			src: src,
			viewportWidth: viewportWidth,

			width: Array.isArray(dimensions) ? dimensions[0] : dimensions.width,
			fileWidth: Array.isArray(fileDimensions) ? fileDimensions[0] : fileDimensions.width
		};

		this.addStatsObject( obj );
	}

	getSizes() {
		return this.sizes;
	}

	getViewportSizes() {
		return Object.keys(this.sizes).map(size => parseInt(size, 10));
	}

	getStatsAtViewportWidth(viewportWidth) {
		return this.sizes[parseInt(viewportWidth, 10)];
	}

	// images are assumed to have the same aspect ratio
	getEfficiencyAtViewportWidth(viewportWidth) {
		let stats = this.getStatsAtViewportWidth(viewportWidth);
		return this.getEfficiencyFromStats(stats);
	}

	getEfficiencyFromStats(stats) {
		return stats.fileWidth / stats.width;
	}

	getStats() {
		return this.getViewportSizes().map(vw => {
			let stats = this.getStatsAtViewportWidth(vw);
			let eff = this.getEfficiencyFromStats(stats);

			return {
				html: stats.html,
				src: stats.src,
				viewportWidth: vw,
				fileWidth: stats.fileWidth,
				width: stats.width,
				efficiency: eff
			};
		});
	}
}

module.exports = Image;