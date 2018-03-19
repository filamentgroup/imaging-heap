import test from "ava";
import Image from "../src/Image";

test("getStatsAtViewportWidth", t => {
	let img = new Image();
	t.deepEqual(img.getViewportSizes(), []);
	img.addStats( 320, [200,100], [100,50]);
	t.deepEqual(img.getViewportSizes(), [320]);
	t.truthy(img.getStatsAtViewportWidth(320));
	t.falsy(img.getStatsAtViewportWidth(340));

	img.addStats( 340, [200,100], [100,50]);
	t.deepEqual(img.getViewportSizes(), [320, 340]);
	t.truthy(img.getStatsAtViewportWidth(340));
});

test("getEfficiencyAtViewportWidth", t => {
	let img = new Image();
	img.addStats( 320, [100,50], [200,100]);
	t.is(img.getEfficiencyAtViewportWidth(320), 2);

	img.addStats( 340, [200,100], [100,50]);
	t.is(img.getEfficiencyAtViewportWidth(340), 0.5);
});

test("getEfficiency", t => {
	let img = new Image();
	img.addStats( 320, [100,50], [200,100]);
	let efficiency = img.getStats();
	t.is(efficiency.length, 1);

	t.is(efficiency[0].efficiency, 2);

	img.addStats( 340, [100,50], [200,100]);
	efficiency = img.getStats();

	t.is(efficiency.length, 2);
	t.is(efficiency[0].efficiency, 2);
	t.is(efficiency[1].efficiency, 2);
});