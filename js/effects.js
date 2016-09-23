var F = {
	/**
	 * [gray 灰度算法]
	 */
	gray: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var gray = .299 * r + .587 * g + .114 * b
			return {
				r: gray,
				g: gray,
				b: gray,
				a: 255
			}
		});

	},
	/**
	 * [old 复古效果算法]
	 */
	old: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var dr = .393 * r + .769 * g + .189 * b,
				dg = .349 * r + .686 * g + .168 * b,
				db = .272 * r + .534 * g + .131 * b;

			var fr = getv(dr, r),
				fg = getv(dg, g),
				fb = getv(db, b);


			function getv(v1, v2) {
				var scale = Math.random() * 0.5 + 0.1;
				return scale * v2 + (1 - scale) * v1;
			}

			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},
	/**
	 * [black 黑白]
	 * 做极端处理，255 或者 0，参考点是 平均值
	 */
	black: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var fr = 0,
				fg = 0,
				fb = 0;
			if ((r + g + b) >= 380) {
				fr = fg = fb = 255;
			}
			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},
	/**
	 * [negatives 底片，反色]
	 */
	negatives: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var fr = 255 - r,
				fg = 255 - g,
				fb = 255 - b;
			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},
	/**
	 * [cameo 浮雕效果]
	 */
	cameo: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a, key, canvasData) {
			var key2 = key + canvasData.width * 4;
			var r2 = canvasData.data[key2 + 0];
			g2 = canvasData.data[key2 + 1],
				b2 = canvasData.data[key2 + 2],
				fr = r2 - r + 128,
				fg = g2 - g + 128,
				fb = b2 - b + 128,
				gray = .299 * fr + .587 * fg + .114 * fb;
			return {
				r: gray,
				g: gray,
				b: gray,
				a: 255
			}
		});

	},
	/**
	 * [comic 连环画效果]
	 * 连环画的效果与图像灰度化后的效果相似,它们都是灰度图,但连环画增大了图像的对比度,使整体明暗效果更强.
	 */
	comic: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var fr = Math.abs((g - r + g + b)) * r / 256,
				fg = Math.abs((b - r + g + b)) * r / 256,
				fb = Math.abs((b - r + g + b)) * g / 256;
			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},
	/**
	 * [casting 熔铸效果]
	 */
	casting: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a) {
			var fr = r * 128 / (g + b + 1),
				fg = g * 128 / (r + b + 1),
				fb = b * 128 / (g + r + 1);
			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},
	/**
	 * [spread 扩散]
	 */
	spread: function(canvasData) {

		return loopData(canvasData, function(r, g, b, a, key, canvasData) {
			var rand = Math.floor(Math.random() * 20) % 3,
				key2 = key + (rand * 4) * (canvasData.width + 1);
			r2 = canvasData.data[key2 + 0],
				g2 = canvasData.data[key2 + 1],
				b2 = canvasData.data[key2 + 2],
				fr = r2,
				fg = g2,
				fb = b2;
			return {
				r: fr,
				g: fg,
				b: fb,
				a: 255
			}
		});

	},

	gauss: function(canvasData, tempData) {

		var blur = 6;
		for (var y = 0; y < canvasData.height; y++) {
			for (var x = 0; x < canvasData.width; x++) {
				var _p = (x + y * canvasData.width) * 4;

				if (x < blur || y < blur || x > (canvasData.width - blur) || y > (canvasData.height - blur)) {
					canvasData.data[_p + 0] = 0;
					canvasData.data[_p + 1] = 0;
					canvasData.data[_p + 2] = 0;
				} else {
					var r = 0,
						g = 0,
						b = 0;
					for (var j = -blur; j < blur; j++) {
						for (var i = -blur; i < blur; i++) {
							var dx = x + i,
								dy = y + j,
								p = (dy * canvasData.width + dx) * 4;
							r += tempData.data[p];
							g += tempData.data[p + 1];
							b += tempData.data[p + 2];
						}
					}
					var sum = Math.pow(blur * 2 + 1, 2);
					canvasData.data[_p + 0] = Math.floor(r / sum);
					canvasData.data[_p + 1] = Math.floor(g / sum);
					canvasData.data[_p + 2] = Math.floor(b / sum);
				}

			}
		}
		return canvasData;

	}
}



function getType(o) {
	var _t;
	return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}


function extend(destination, source) {
	for (var p in source) {
		if (getType(source[p]) == "array" || getType(source[p]) == "object") {
			destination[p] = getType(source[p]) == "array" ? [] : {};
			arguments.callee(destination[p], source[p]);
		} else {
			destination[p] = source[p];
		}
	}
}

function loopData(canvasData, cb) {
	for (var y = 0; y < canvasData.height; y++) {
		for (var x = 0; x < canvasData.width; x++) {
			var key = (x + y * canvasData.width) * 4;

			var r = canvasData.data[key + 0],
				g = canvasData.data[key + 1],
				b = canvasData.data[key + 2],
				a = canvasData.data[key + 3];

			var D = cb(r, g, b, a, key, canvasData);

			canvasData.data[key + 0] = D.r; // Red channel
			canvasData.data[key + 1] = D.g; // Green channel
			canvasData.data[key + 2] = D.b; // Blue channel
			canvasData.data[key + 3] = D.a; // Alpha channel

			if (x < p || y < p || x > (canvasData.width - p) || y > (canvasData.height - p)) {
				canvasData.data[key + 0] = 0;
				canvasData.data[key + 1] = 0;
				canvasData.data[key + 2] = 0;
			}

		}
	}
	return canvasData;
}