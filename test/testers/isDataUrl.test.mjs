import { describe, it } from "node:test";
import assert from "node:assert";

import { isDataUrl } from "../../dist/index.js";

describe("Testers string 'isDataUrl' function", () => {
	it("basic", () => {
		assert.strictEqual(isDataUrl(""), false);
		assert.strictEqual(isDataUrl("data:"), false);
		assert.strictEqual(isDataUrl("data:/,"), false);
		assert.strictEqual(isDataUrl("data:text,"), false);
		assert.strictEqual(isDataUrl("data:text/.,"), false);
		assert.strictEqual(isDataUrl("data:text/+,"), false);
		assert.strictEqual(isDataUrl("data:text/+foo,"), false);
		assert.strictEqual(isDataUrl("data:text/.foo,"), false);
		assert.strictEqual(isDataUrl("data:text/bar+,"), false);
		assert.strictEqual(isDataUrl("data:text/bar,foo\"bar"), false);
		assert.strictEqual(isDataUrl("data:text/bar,foobar%0"), false);
		assert.strictEqual(isDataUrl("data:text/bar;attribute,foobar"), false);
		assert.strictEqual(isDataUrl("data:text/bar;attribute=,foobar"), false);
		assert.strictEqual(isDataUrl("data:text/bar;attribute=foo\"bar,foobar"), false);

		assert.strictEqual(isDataUrl("data:;base64,"), true);
		assert.strictEqual(isDataUrl("data:text/bar.foo,"), true);
		assert.strictEqual(isDataUrl("data:text/bar,foobar%00"), true);
		assert.strictEqual(isDataUrl("data:text/bar;attribute=\"foo\\\"bar\",foobar"), true);
	});
	it("'type' parameter", () => {
		assert.strictEqual(isDataUrl("data:text/plain,foo", { type: "audio" }), false);

		assert.strictEqual(isDataUrl("data:audio/mp4,foo", { type: "audio" }), true);
	});
	it("'subtype' parameter", () => {
		assert.strictEqual(isDataUrl("data:text/plain,foo", { subtype: "mp4" }), false);

		assert.strictEqual(isDataUrl("data:audio/mp4,foo", { subtype: "mp4" }), true);
	});
});