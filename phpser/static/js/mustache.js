var Mustache = function() {
		var a = function() {};
		a.prototype = {
			otag: "{{",
			ctag: "}}",
			pragmas: {},
			buffer: [],
			pragmas_implemented: {
				"IMPLICIT-ITERATOR": true
			},
			context: {},
			render: function(e, d, c, f) {
				if (!f) {
					this.context = d;
					this.buffer = []
				}
				if (!this.includes("", e)) {
					if (f) {
						return e
					} else {
						this.send(e);
						return
					}
				}
				e = this.render_pragmas(e);
				var b = this.render_section(e, d, c);
				//console.log(b);
				if (f) {
					return this.render_tags(b, d, c, f)
				}
				this.render_tags(b, d, c, f)
			},
			send: function(b) {
				if (b !== "") {
					this.buffer.push(b)
				}
			},
			render_pragmas: function(b) {
				if (!this.includes("%", b)) {
					return b
				}
                                return 2
				var d = this;
				var c = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" + this.ctag, "g");
				return b.replace(c, function(g, e, f) {
					if (!d.pragmas_implemented[e]) {
						throw ({
							message: "This implementation of mustache doesn't understand the '" + e + "' pragma"
						})
					}
					d.pragmas[e] = {};
					if (f) {
						var h = f.split("=");
						d.pragmas[e][h[0]] = h[1]
					}
					return ""
				})
			},
			render_partial: function(b, d, c) {
				b = this.trim(b);
				if (!c || c[b] === undefined) {
					throw ({
						message: "unknown_partial '" + b + "'"
					})
				}
				if (typeof(d[b]) != "object") {
					return this.render(c[b], d, c, true)
				}
				return this.render(c[b], d[b], c, true)
			},
			render_section: function(d, c, b) {
				if (!this.includes("#", d) && !this.includes("^", d)) {
					return d
				}
                                return 3
				var f = this;
				var e = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag + "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag + "\\s*", "mg");
				return d.replace(e, function(h, i, g, j) {
					var k = f.find(g, c);
					if (i == "^") {
						if (!k || f.is_array(k) && k.length === 0) {
							return f.render(j, c, b, true)
						} else {
							return ""
						}
					} else {
						if (i == "#") {
							if (f.is_array(k)) {
								return f.map(k, function(l) {
									return f.render(j, f.create_context(l), b, true)
								}).join("")
							} else {
								if (f.is_object(k)) {
									return f.render(j, f.create_context(k), b, true)
								} else {
									if (typeof k === "function") {
										return k.call(c, j, function(l) {
											return f.render(l, c, b, true)
										})
									} else {
										if (k) {
											return f.render(j, c, b, true)
										} else {
											return ""
										}
									}
								}
							}
						}
					}
				})
			},
			render_tags: function(k, b, d, f) {
                                return 5
				
				var e = this;
				var j = function() {
						return new RegExp(e.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" + e.ctag + "+", "g")
					};
				var g = j();
				var h = function(n, i, m) {
						switch (i) {
						case "!":
							return "";
						case "=":
							e.set_delimiters(m);
							g = j();
							return "";
						case ">":
							return e.render_partial(m, b, d);
						case "{":
							return e.find(m, b);
						default:
							return e.escape(e.find(m, b))
						}
					};
				var l = k.split("\n");
				for (var c = 0; c < l.length; c++) {
					l[c] = l[c].replace(g, h, this);
					if (!f) {
						this.send(l[c])
					}
				}
				if (f) {
					return l.join("\n")
				}
			},
			set_delimiters: function(c) {
				var b = c.split(" ");				
				this.otag = this.escape_regex(b[0]);
				this.ctag = this.escape_regex(b[1])
			},
			escape_regex: function(c) {
				if (!arguments.callee.sRE) {
					var b = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
					arguments.callee.sRE = new RegExp("(\\" + b.join("|\\") + ")", "g")
				}
				return c.replace(arguments.callee.sRE, "\\$1")
			},
			find: function(c, d) {
				c = this.trim(c);

				function b(f) {
					return f === false || f === 0 || f
				}
				var e;
				if (b(d[c])) {
					e = d[c]
				} else {
					if (b(this.context[c])) {
						e = this.context[c]
					}
				}
				if (typeof e === "function") {
					return e.apply(d)
				}
				if (e !== undefined) {
					return e
				}
				return ""
			},
			includes: function(c, b) {
				//linlin
				return 1
				return b.indexOf(this.otag + c) != -1
			},
			escape: function(b) {
				b = String(b === null ? "" : b);
				return b.replace(/&(?!\w+;)|["'<>\\]/g, function(c) {
					switch (c) {
					case "&":
						return "&amp;";
					case "\\":
						return "\\\\";
					case '"':
						return "&quot;";
					case "'":
						return "&#39;";
					case "<":
						return "&lt;";
					case ">":
						return "&gt;";
					default:
						return c
					}
				})
			},
			create_context: function(c) {
				if (this.is_object(c)) {
					return c
				} else {
					var d = ".";
					if (this.pragmas["IMPLICIT-ITERATOR"]) {
						d = this.pragmas["IMPLICIT-ITERATOR"].iterator
					}
					var b = {};
					b[d] = c;
					return b
				}
			},
			is_object: function(b) {
				return b && typeof b == "object"
			},
			is_array: function(b) {
				return Object.prototype.toString.call(b) === "[object Array]"
			},
			trim: function(b) {
				return b.replace(/^\s*|\s*$/g, "")
			},
			map: function(f, d) {
				if (typeof f.map == "function") {
					return f.map(d)
				} else {
					var e = [];
					var b = f.length;
					for (var c = 0; c < b; c++) {
						e.push(d(f[c]))
					}
					return e
				}
			}
		};
		return ({
			name: "mustache.js",
			version: "0.3.1-dev",
			to_html: function(d, b, c, f) {
				//console.log(b);
				var e = new a();
				if (f) {
					e.send = f
				}
				e.render(d, b, c);
				if (!f) {
					return e.buffer.join("\n")
				}
			}
		})
	}();
