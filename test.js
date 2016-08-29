/*Base64:encode | decode*/
Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(input) {
		if (input === undefined) {
			return "";
		}
		input = (input + " ").trim();
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = this._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64
			} else if (isNaN(chr3)) {
				enc4 = 64
			}
			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
		}
		return output
	},
	decode: function(input) {
		if (input === undefined) {
			return "";
		}
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2)
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3)
			}
		}
		output = this._utf8_decode(output);
		return output
	},
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c)
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128)
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128)
			}
		}
		return utftext
	},
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3
			}
		}
		return string
	}
};
/*Md5:run | short*/
Md5 = {
	hexcase: 0,
	short: function(a) {
		return this.run(a).substr(8, 16);
	},
	run: function(a) {
		if (a == "") return a;
		return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(a)))
	},
	hex_hmac_md5: function(a, b) {
		return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(a), this.str2rstr_utf8(b)))
	},
	md5_vm_test: function() {
		return this.run("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
	},
	rstr_md5: function(a) {
		return this.binl2rstr(this.binl_md5(this.rstr2binl(a), a.length * 8))
	},
	rstr_hmac_md5: function(c, f) {
		var e = this.rstr2binl(c);
		if (e.length > 16) {
			e = this.binl_md5(e, c.length * 8)
		}
		var a = Array(16),
		d = Array(16);
		for (var b = 0; b < 16; b++) {
			a[b] = e[b] ^ 909522486;
			d[b] = e[b] ^ 1549556828
		}
		var g = this.binl_md5(a.concat(this.rstr2binl(f)), 512 + f.length * 8);
		return this.binl2rstr(this.binl_md5(d.concat(g), 512 + 128))
	},
	rstr2hex: function(c) {
		try {
			this.hexcase
		} catch(g) {
			this.hexcase = 0
		}
		var f = this.hexcase ? "0123456789ABCDEF": "0123456789abcdef";
		var b = "";
		var a;
		for (var d = 0; d < c.length; d++) {
			a = c.charCodeAt(d);
			b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
		}
		return b
	},
	str2rstr_utf8: function(c) {
		var b = "";
		var d = -1;
		var a, e;
		while (++d < c.length) {
			a = c.charCodeAt(d);
			e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
			if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
				a = 65536 + ((a & 1023) << 10) + (e & 1023);
				d++
			}
			if (a <= 127) {
				b += String.fromCharCode(a)
			} else {
				if (a <= 2047) {
					b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
				} else {
					if (a <= 65535) {
						b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
					} else {
						if (a <= 2097151) {
							b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
						}
					}
				}
			}
		}
		return b
	},
	rstr2binl: function(b) {
		var a = Array(b.length >> 2);
		for (var c = 0; c < a.length; c++) {
			a[c] = 0
		}
		for (var c = 0; c < b.length * 8; c += 8) {
			a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
		}
		return a
	},
	binl2rstr: function(b) {
		var a = "";
		for (var c = 0; c < b.length * 32; c += 8) {
			a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
		}
		return a
	},
	binl_md5: function(p, k) {
		p[k >> 5] |= 128 << ((k) % 32);
		p[(((k + 64) >>> 9) << 4) + 14] = k;
		var o = 1732584193;
		var n = -271733879;
		var m = -1732584194;
		var l = 271733878;
		for (var g = 0; g < p.length; g += 16) {
			var j = o;
			var h = n;
			var f = m;
			var e = l;
			o = this.md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
			l = this.md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
			m = this.md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
			n = this.md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
			o = this.md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
			l = this.md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
			m = this.md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
			n = this.md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
			o = this.md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
			l = this.md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
			m = this.md5_ff(m, l, o, n, p[g + 10], 17, -42063);
			n = this.md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
			o = this.md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
			l = this.md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
			m = this.md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
			n = this.md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
			o = this.md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
			l = this.md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
			m = this.md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
			n = this.md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
			o = this.md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
			l = this.md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
			m = this.md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
			n = this.md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
			o = this.md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
			l = this.md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
			m = this.md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
			n = this.md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
			o = this.md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
			l = this.md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
			m = this.md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
			n = this.md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
			o = this.md5_hh(o, n, m, l, p[g + 5], 4, -378558);
			l = this.md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
			m = this.md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
			n = this.md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
			o = this.md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
			l = this.md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
			m = this.md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
			n = this.md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
			o = this.md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
			l = this.md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
			m = this.md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
			n = this.md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
			o = this.md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
			l = this.md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
			m = this.md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
			n = this.md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
			o = this.md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
			l = this.md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
			m = this.md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
			n = this.md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
			o = this.md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
			l = this.md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
			m = this.md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
			n = this.md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
			o = this.md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
			l = this.md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
			m = this.md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
			n = this.md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
			o = this.md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
			l = this.md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
			m = this.md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
			n = this.md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
			o = this.safe_add(o, j);
			n = this.safe_add(n, h);
			m = this.safe_add(m, f);
			l = this.safe_add(l, e)
		}
		return Array(o, n, m, l)
	},
	md5_cmn: function(h, e, d, c, g, f) {
		return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(e, h), this.safe_add(c, f)), g), d)
	},
	md5_ff: function(g, f, k, j, e, i, h) {
		return this.md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
	},
	md5_gg: function(g, f, k, j, e, i, h) {
		return this.md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
	},
	md5_hh: function(g, f, k, j, e, i, h) {
		return this.md5_cmn(f ^ k ^ j, g, f, e, i, h)
	},
	md5_ii: function(g, f, k, j, e, i, h) {
		return this.md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
	},
	safe_add: function(a, d) {
		var c = (a & 65535) + (d & 65535);
		var b = (a >> 16) + (d >> 16) + (c >> 16);
		return (b << 16) | (c & 65535)
	},
	bit_rol: function(a, b) {
		return (a << b) | (a >>> (32 - b))
	}
};
/*Urls:urlencode | urldecode | 
getQueryString 获取QueryString的数组 | 
getQueryStringByName 根据QueryString参数名称获取值 | 
getQueryStringByIndex 根据QueryString参数索引获取值*/
Urls = {
	urlencode: function(string) {
		return escape(this._utf8_encode(string)).replace(/\//ig, "%2F")
	},
	urldecode: function(string) {
		return this._utf8_decode(unescape(string))
	},
	_utf8_encode: function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c)
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128)
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128)
			}
		}
		return utftext
	},
	_utf8_decode: function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3
			}
		}
		return string
	},
	getQueryString: function() {
		var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
		for (var i = 0; i < result.length; i++) {
			result[i] = result[i].substring(1)
		}
		return result
	},
	getQueryStringByName: function(name) {
		var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
		if (result == null || result.length < 1) {
			return ""
		}
		return result[1]
	},
	getQueryStringByIndex: function(index) {
		if (index == null) {
			return ""
		}
		var queryStringList = this.getQueryString();
		if (index >= queryStringList.length) {
			return ""
		}
		var result = queryStringList[index];
		var startIndex = result.indexOf("=") + 1;
		result = result.substring(startIndex);
		return result
	}
};
/*Cookies:getCookie | setCookie | delCookie*/
Cookies = {
	getCookie: function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) {
			return unescape(arr[2])
		}
		return ''
	},
	setCookie: function(name, value, n) {
		var expdate = new Date;
		expdate.setTime(expdate.getTime() + n * 1000);
		document.cookie = name + ("=" + escape(value) + ";expires=" + expdate.toGMTString() + ";path=/;")
	},
	delCookie: function(name) {
		var expdate = new Date;
		expdate.setTime(expdate.getTime() - (3600 * 24 * 1000));
		document.cookie = name + ("=" + escape('') + ";expires=" + expdate.toGMTString() + ";path=/;")
	}
};
/*Storages:clearStorage | getStorage | setStorage*/
Storages = {
	clearStorage: function(name, type) {
		var sg = (type == "session" ? window.sessionStorage: window.localStorage);
		if (name) {
			sg.removeItem(name)
		} else {
			sg.clear()
		}
	},
	getStorage: function(name, all, type) {
		try {
			var sg = (type == "session" ? window.sessionStorage: window.localStorage);
			if (sg.getItem(name)) {
				if (all) {
					return sg.getItem(name)
				}
				var t = sg.getItem(name).split('\|');
				if (t[0] > ((new Date).valueOf())) {
					return Base64.decode(t[1])
				} else {
					sg.removeItem(name);
					return ''
				}
			} else {
				return ''
			}
		} catch(e) {}
	},
	setStorage: function(name, value, time, init, type) {
		try {
			var sg = (type == "session" ? window.sessionStorage: window.localStorage);
			if (sg) {
				try {
					if (init) {
						sg.clear()
					}
					sg.setItem(name, (((new Date).valueOf()) + (time * 1000)) + '|' + Base64.encode(value))
				} catch(e) {}
				return true
			} else {
				return false
			}
		} catch(e) {}
	}
};
/*Workers:start | stop | send*/
Workers = {
/*
-->worker.js
onmessage =function (evt){
  var d = evt.data;//通过evt.data获得发送来的数据
  postMessage( d );//将获取到的数据发送会主线程
}
web worker看起来很美好，但处处是魔鬼。
我们可以做什么：
1.可以加载一个JS进行大量的复杂计算而不挂起主进程，并通过postMessage，onmessage进行通信
2.可以在worker中通过importScripts(url)加载另外的脚本文件
3.可以使用 setTimeout(), clearTimeout(), setInterval(), and clearInterval()
4.可以使用XMLHttpRequest来发送请求
5.可以访问navigator的部分属性
有那些局限性：
1.不能跨域加载JS
2.worker内代码不能访问DOM
3.各个浏览器对Worker的实现不大一致，例如FF里允许worker中创建新的worker,而Chrome中就不行
4.不是每个浏览器都支持这个新特性
*/
	start: function(url, fn) {
		var w = new Worker(url);
		w.onmessage = function(e) {
			if (fn) {
				fn && fn(e.data, w)
			}
		};
		return w;
	},
	stop: function(worker) {
		worker.terminate();
	},
	send: function(worker, data) {
		worker.postMessage(data);
	}
};
/*EventSources:start | stop*/
EventSources = {
/*
-->serverfile.php
<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
$time = date('r');
echo "data: The server time is: {$time}\n\n";
flush();
?>
*/
	start: function(serverurl, fn) {
		var s = new EventSource(serverurl);
		s.onmessage = function(e) {
			fn && fn(e.data, s);
		};
		return s;
	},
	stop: function(event) {
		event.close();
	}
}
/*Nods:query | create | insert | append | remove | replace | parent | child | first | last | show | hide | getattr | setattr | name| value | type*/
Nods = {
	query: function(v, type) {
		return type ? (document.querySelectorAll(v)) : (document.querySelector(v));
	},
	create: function(name, content, istext) {
		if (istext) {
			return document.createTextNode(name);
		} else {
			var s = document.createElement(name);
			if (content) {
				s.innerHTML = content;
			}
			return s;
		}
	},
	insert: function(container, inod) {
		//	container.parentNode.insertBefore(inod,container);
		var s = container.parentNode;
		var i = Array.prototype.indexOf.call(s.childNodes, container);
		s.insertBefore(inod, container);
		return s.childNodes[i];
	},
	append: function(container, name, html, type) {

		switch (type) {
		case 0:
			var c = document.createElement(name);
			c.innerHTML = html;
			break;
		case 1:
			var c = document.createElement(name);
			c.innerText = html;
			break;
		case 2:
			container.appendChild(name);
			return container.lastChild;
			break;
		default:
			c.innerHTML = html;
			break;
		}
		container.appendChild(c);
		return container.lastChild;
	},
	remove: function(container) {
		var s = container.parentNode;
		s.removeChild(container);
		return s;
	},
	replace: function(container, newnod) {
		var s = container.parentNode;
		var i = Array.prototype.indexOf.call(s.childNodes, container);
		s.replaceChild(newnod, container);
		return s.childNodes[i];
	},
	parent: function(container) {
		return container.parentNode;
	},
	child: function(container, num) {
		return container.childNodes[num];
	},
	first: function(container) {
		return container.firstChild;
	},
	last: function(container) {
		return container.lastChild;
	},
	show: function(container, takein) {
		if (takein) {
			container.style.visibility = "visible";
		} else {
			container.style.display = "block";
		}
	},
	hide: function(container, takein) {
		if (takein) {
			container.style.visibility = "hidden";
		} else {
			container.style.display = "none";
		}
	},
	getattr: function(container, attrname) {
		return container.getAttribute(attrname);
	},
	setattr: function(container, attrname, value) {
		container.setAttribute(attrname, value);
	},
	name: function(container) {
		return container.nodeName;
	},
	value: function(container, value) {
		if (value) {
			container.nodeValue = value;
		} else {
			return container.nodeValue;
		}
	},
	type: function(container) {
		return container.nodeType;
	}
}
/*IDBs[IndexedDB]:openDB | closeDB | deleteDB | addData | getDataByKey | updateDataByKey | deleteDataByKey | clearObjectStore | deleteObjectStore | 
fetchStoreByCursor | getDataByIndex | getMultipleData*/
IDBs = {
	openDB: function(name, version, onsuccess, predatas, onupgradeneeded) {
		//predatas:[{"table":"students","key":"id","indexs":[{"index":"nameIndex",name:"name","unique":true},{"index":"ageIndex","name":"age","unique":false}]}]
		var version = version || 1;
		var request = window.indexedDB.open(name, version);
		request.onerror = function(e) {
			console.log(e.currentTarget.error.message);
		};
		request.onsuccess = function(e) {
			onsuccess && onsuccess(e.target.result)
		};
		request.onupgradeneeded = function(e) {
			var db = e.target.result;
			for (var z = 0; z < predatas.length; z++) {
				var predata = predatas[z];
				var table = predata["table"];
				var key = predata["key"]; //'id'
				var indexs = predata["indexs"];
				if (table) {
					if (!db.objectStoreNames.contains(table)) {
						var store = db.createObjectStore(table, {
							keyPath: key
						});
						for (var i = 0; i < indexs.length; i++) {
							store.createIndex(indexs[i]['index'], indexs[i]['name'], {
								unique: indexs[i]['unique']
							});
						}
					}
				}
			}
			onupgradeneeded && onupgradeneeded(db);
			console.log('DB version changed to ' + version);
		};
	},
	closeDB: function(db) {
		db.close();
	},
	deleteDB: function(name) {
		indexedDB.deleteDatabase(name);
	},
	addData: function(db, storeName, arrdata, callback) {
		//arrdata:[{id:1001,name:"Byron",age:24},{id:1002,name:"Frank",age:30},{id:1003,name:"Aaron",age:26},{id:1004,name:"Casper",age:26}]
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		for (var i = 0; i < arrdata.length; i++) {
			store.add(arrdata[i]);
		}
		callback && callback()
	},
	getDataByKey: function(db, storeName, key, callback) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var request = store.get(key);
		request.onsuccess = function(e) {
			callback && callback(e.target.result)
		};
	},
	updateDataByKey: function(db, storeName, key, value, callback) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var request = store.get(key);
		request.onsuccess = function(e) {
			store.put(value);
			callback && callback(e.target.result)
		};
	},
	deleteDataByKey: function(db, storeName, key) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		store.delete(key);
	},
	clearObjectStore: function(db, storeName) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		store.clear();
	},
	deleteObjectStore: function(db, storeName) {
		var transaction = db.transaction(storeName, 'versionchange');
		db.deleteObjectStore(storeName);
	},
	fetchStoreByCursor: function(db, storeName, callback) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var request = store.openCursor();
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				callback && callback(cursor.key, cursor.value); //key,value
				cursor.
				continue ();
			}
		};
	},
	getDataByIndex: function(db, storeName, indexName, indexId, callback) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var index = store.index(indexName);
		index.get(indexId).onsuccess = function(e) {
			callback && callback(e.target.result)
		}
	},
	getMultipleData: function(db, storeName, indexName, indexId, callback) {
		var transaction = db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var index = store.index(indexName);
		var request = index.openCursor(null, IDBCursor.prev);
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				callback && callback(cursor.key, cursor.value); //key,value
				cursor.
				continue ();
			}
		}
	}
};
/*MDBs[MySQL]:createDB | checkDB | delDB | createTable | readTable | delTable | writeValue | updateValue | readValue | delValue | query*/
MDBs = {
	sql_host: "",
	sql_user: "",
	sql_pw: "",
	sql_db: "",
	setConnectInfo: function(sql_host, sql_user, sql_pw, sql_db, fn) {
		if (sql_host && sql_user && sql_pw && sql_db) {
			this.sql_host = sql_host;
			this.sql_user = sql_user;
			this.sql_pw = sql_pw;
			this.sql_db = sql_db;
			fn && fn(this);
		} else {
			if (this.sql_host && this.sql_user && this.sql_pw && this.sql_db) {
				return true;
			} else {
				return false;
			}
		}
	},
	createDB: function(fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->createDB("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '"));', fn, null, method, params, ajaxurl);
	},
	checkDB: function(fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->checkDB("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '"));', fn, null, method, params, ajaxurl);
	},
	delDB: function(fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->delDB("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '"));', fn, null, method, params, ajaxurl);
	},
	createTable: function(sql_table, sql_indexs, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->createTable("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '",\'' + sql_indexs + '\'));', fn, null, method, params, ajaxurl);
	},
	readTable: function(sql_table, sql_fn, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->readTable("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '","' + sql_fn + '"));', fn, null, method, params, ajaxurl);
	},
	delTable: function(sql_table, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->delTable("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '"));', fn, null, method, params, ajaxurl);
	},
	writeValue: function(sql_table, sql_params, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->writeValue("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '",\'' + sql_params + '\'));', fn, null, method, params, ajaxurl);
	},
	updateValue: function(sql_table, sql_findkey, sql_setkey, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->updateValue("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '","' + sql_findkey + '","' + sql_setkey + '"));', fn, null, method, params, ajaxurl);
	},
	readValue: function(sql_table, sql_fn, sql_findkey, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->readValue("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '","' + sql_fn + '","' + sql_findkey + '"));', fn, null, method, params, ajaxurl);
	},
	delValue: function(sql_table, sql_findkey, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->delValue("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '","' + sql_findkey + '"));', fn, null, method, params, ajaxurl);
	},
	query: function(sql_table, sql_command, fn, method, params, ajaxurl) {
		if (!this.setConnectInfo()) {
			var r = "setConnectInfo Is Not Setted!";
			fn && fn(r);
			return r;
		}
		Ajaxs.code('return json_encode($MDB->delValue("' + this.sql_host + '","' + this.sql_user + '","' + this.sql_pw + '","' + this.sql_db + '","' + sql_table + '","' + sql_command + '"));', fn, null, method, params, ajaxurl);
	}
};
/*Tools: Curl | DropWindow | Lazyload | IncludeJS | LoadJS | Query | HTMLEncode | HTMLDecode | ReadXML | Xml2Json | stringToliteHex | liteHexToUrl | liteHexTostring | addels | getUA | getAbsPoint | getRandomNum | getimgsrc | screensnpt | arrayToJson | getels | getdate | in_array
bindEnterEvent 绑定当控件高亮选中时，点击“回车键”时执行的操作//control：要绑定事件的控件[//func：要执行的方法//key: 触发键]*/
Tools = {
	Curl: function(url, type, data, code, errorcode, encoding, setting, timeout, timeoutcode, jsback) {
		var xmlhttp = null;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			if (window.ActiveXObject) {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		if (xmlhttp != null) {
			xmlhttp.onreadystatechange = function() {
				try {
					if (xmlhttp.readyState == 4) {
						//alert(xmlhttp.status);
						if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status == 304) {
							code && code(this.response, jsback);
						} else {
							errorcode && errorcode(xmlhttp.statusText, jsback);
							//alert('Problem retrieving XML data:' + xmlhttp.statusText);
						}
					}
				} catch(e) {}
			}
			xmlhttp.open(type, url, true);
			timeout && (xmlhttp.timeout = timeout);
			timeoutcode && (xmlhttp.ontimeout = function() {
				timeoutcode && timeoutcode(this, jsback);
			});
			encoding && xmlhttp.overrideMimeType("text/html;charset=" + encoding);
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			if (setting) {
				setting && setting(xmlhttp);
			}
			xmlhttp.send(data);
		} else {
			errorcode && errorcode("Your browser does not support XMLHTTP.");
			//alert('Your browser does not support XMLHTTP.');
		}
	},
	DropWindow: function(title, content, style) {
		document.writeln("<div id=\"dlgTest\"class=\"dialog\"style=\"left:0;top:0;min-width:250px;min-height:250px;position:absolute;background-color:#ccc;-webkit-box-shadow:1px 1px 3px#292929;-moz-box-shadow:1px 1px 3px#292929;box-shadow:1px 1px 3px#292929;margin:10px;" + style + "\"><div oncontextmenu=\"return false\"class=\"dialog-title\"style=\"color:#fff;background-color:#404040;font-size:12pt;font-weight:bold;padding:4px 6px;cursor:move;\">" + title + "<a title=\"关闭\"style=\"color:white\"href=\"javascript:void(0);\"onclick=\"dlgTest.style.display='none';\"><span style=\"float:right;right:0\">×</span></a></div><div class=\"dialog-content\">" + content + "</div></div>");
		var Dragging = function(validateHandler) {
			var draggingObj = null;
			var diffX = 0;
			var diffY = 0;
			function mouseHandler(e) {
				switch (e.type) {
				case 'mousedown':
					draggingObj = validateHandler(e);
					if (draggingObj != null) {
						diffX = e.clientX - draggingObj.offsetLeft;
						diffY = e.clientY - draggingObj.offsetTop;
					}
					break;
				case 'mousemove':
					if (draggingObj) {
						draggingObj.style.left = (e.clientX - diffX) + 'px';
						draggingObj.style.top = (e.clientY - diffY) + 'px';
					}
					break;
				case 'mouseup':
					draggingObj = null;
					diffX = 0;
					diffY = 0;
					break;
				}
			};
			return {
				enable: function() {
					document.addEventListener('mousedown', mouseHandler);
					document.addEventListener('mousemove', mouseHandler);
					document.addEventListener('mouseup', mouseHandler);
				},
				disable: function() {
					document.removeEventListener('mousedown', mouseHandler);
					document.removeEventListener('mousemove', mouseHandler);
					document.removeEventListener('mouseup', mouseHandler);
				}
			}
		}
		function getDraggingDialog(e) {
			var target = e.target;
			while (target && target.className.indexOf('dialog-title') == -1) {
				target = target.offsetParent;
			}
			if (target != null) {
				return target.offsetParent;
			} else {
				return null;
			}
		}
		Dragging(getDraggingDialog).enable();
	},
	Lazyload: function(classname, destclassname, lazytime) {
		setTimeout(
		function() {
			try {
				clearInterval(lazyloadser);
			} catch(e) {}
			lazyloadser = setInterval(
			function() {
				var c = document.getElementsByClassName(classname);
				if (c.length) {
					if (window.pageYOffset + (document.documentElement.clientHeight?document.documentElement.clientHeight:window.screen.availHeight) > c[0].offsetTop) {
						lazyloadhoder = 1;
						if (c[0].getAttribute("data-src")) {
							c[0].src = c[0].getAttribute("data-src");
							c[0].setAttribute("data-src", "");
							c[0].parentNode.style.visibility = "visible";
							c[0].className = destclassname;
							lazyloadhoder = 0;
						}
					} else {
						lazyloadhoder = 0;
					}
				} else {
					lazyloadhoder = 0;
				}
			},
			300);
		},
		lazytime);
	},
	IncludeJS: function(sId, source) { //source:(function(){alert("123")})()
		if ((source != null) && (!document.getElementById(sId))) {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement("script");
			oScript.language = "javascript";
			oScript.type = "text/javascript";
			oScript.id = sId;
			oScript.defer = true;
			oScript.text = source;
			oHead.appendChild(oScript);
		}
	},
	LoadJS: function(jspath, id, callback) {
		var scriptTag = document.getElementById(id);
		var oHead = document.getElementsByTagName('HEAD').item(0);
		var oScript = document.createElement("script");
		if (scriptTag) oHead.removeChild(scriptTag);
		if (id) {
			oScript.id = id;
		}
		oScript.type = "text/javascript";
		oScript.src = jspath;
		oHead.appendChild(oScript);
		oScript.onload = function() {
			callback && callback();
		}
	},
	Query: function(type) {
		$ = function(v) {
			return type ? (document.querySelectorAll(v)) : (document.querySelector(v))
		};
	},
	HTMLEncode: function(html) {
		var temp = document.createElement('div');
		(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
		var output = temp.innerHTML;
		temp = null;
		return output;
	},
	HTMLDecode: function(text) {
		var temp = document.createElement('div');
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	},
	ReadXML: function(nod, cs, type) {
		/*
XML
0 s s
1 n n
2 n s
3 s n
*/
		try {
			if ((type == 1 || type == 2) && (type)) {
				var xnod = nod;
			} else {
				var xnod = (new DOMParser()).parseFromString(nod, "text/xml");
			}
			var s = cs.split('\.');
			for (var i = 0; i < s.length; i++) {
				if ((type == 1 || type == 3) && (i == s.length - 1)) {
					return xnod.getElementsByTagName(s[i]);
				} else {
					xnod = xnod.getElementsByTagName(s[i])[0];
				}
			}
			return xnod.childNodes[0].nodeValue;
		} catch(e) {
			return '';
		}
	},
	/* A simple call - myXML is a string containing your XML:  myJsonObject=Tools.Xml2Json.parser(myXML);    
// A 2:nd, optional, parameter is "tags not to convert" - for example <b> and <i>:  myJsonObject=xml2json.parser(myXML,'b,i');    
// A 3:rd, optional, parameter gives us a string showing us the JSON structure   
// instead of the actual JSON object: 
myString=Tools.Xml2Json.parser(myXML,'','html');    
// - use "compact" for output without linebreaks or tabbing  
// - use "normal" for output with linebreaks and tabbing  
// - use "html" for a html representation*/
	Xml2Json: {
		parser: function(xmlcode, ignoretags, debug) {
			if (!ignoretags) {
				ignoretags = ""
			};
			xmlcode = xmlcode.replace(/\s*\/>/g, '/>');
			xmlcode = xmlcode.replace(/<\?[^>]*>/g, "").replace(/<\![^>]*>/g, "");
			if (!ignoretags.sort) {
				ignoretags = ignoretags.split(",")
			};
			var x = this.no_fast_endings(xmlcode);
			x = this.attris_to_tags(x);
			x = escape(x);
			x = x.split("%3C").join("<").split("%3E").join(">").split("%3D").join("=").split("%22").join("\"");
			for (var i = 0; i < ignoretags.length; i++) {
				x = x.replace(new RegExp("<" + ignoretags[i] + ">", "g"), "*$**" + ignoretags[i] + "**$*");
				x = x.replace(new RegExp("</" + ignoretags[i] + ">", "g"), "*$***" + ignoretags[i] + "**$*")
			};
			x = '<JSONTAGWRAPPER>' + x + '</JSONTAGWRAPPER>';
			this.xmlobject = {};
			var y = this.xml_to_object(x).jsontagwrapper;
			if (debug) {
				y = this.show_json_structure(y, debug)
			};
			return y
		},
		xml_to_object: function(xmlcode) {
			var x = xmlcode.replace(/<\//g, "?");
			x = x.split("<");
			var y = [];
			var level = 0;
			var opentags = [];
			for (var i = 1; i < x.length; i++) {
				var tagname = x[i].split(">")[0];
				opentags.push(tagname);
				level++;
				y.push(level + "<" + x[i].split("?")[0]);
				while (x[i].indexOf("?" + opentags[opentags.length - 1] + ">") >= 0) {
					level--;
					opentags.pop()
				}
			};
			var oldniva = -1;
			var objname = "this.xmlobject";
			for (var i = 0; i < y.length; i++) {
				var preeval = "";
				var niva = y[i].split("<")[0];
				var tagnamn = y[i].split("<")[1].split(">")[0];
				tagnamn = tagnamn.toLowerCase();
				var rest = y[i].split(">")[1];
				if (niva <= oldniva) {
					var tabort = oldniva - niva + 1;
					for (var j = 0; j < tabort; j++) {
						objname = objname.substring(0, objname.lastIndexOf("."))
					}
				};
				objname += "." + tagnamn;
				var pobject = objname.substring(0, objname.lastIndexOf("."));
				if (eval("typeof " + pobject) != "object") {
					preeval += pobject + "={value:" + pobject + "};\n"
				};
				var objlast = objname.substring(objname.lastIndexOf(".") + 1);
				var already = false;
				for (k in eval(pobject)) {
					if (k == objlast) {
						already = true
					}
				};
				var onlywhites = true;
				for (var s = 0; s < rest.length; s += 3) {
					if (rest.charAt(s) != "%") {
						onlywhites = false
					}
				};
				if (rest != "" && !onlywhites) {
					if (rest / 1 != rest) {
						rest = "'" + rest.replace(/\'/g, "\\'") + "'";
						rest = rest.replace(/\*\$\*\*\*/g, "</");
						rest = rest.replace(/\*\$\*\*/g, "<");
						rest = rest.replace(/\*\*\$\*/g, ">")
					}
				} else {
					rest = "{}"
				};
				if (rest.charAt(0) == "'") {
					rest = 'unescape(' + rest + ')'
				};
				if (already && !eval(objname + ".sort")) {
					preeval += objname + "=[" + objname + "];\n"
				};
				var before = "=";
				after = "";
				if (already) {
					before = ".push(";
					after = ")"
				};
				var toeval = preeval + objname + before + rest + after;
				eval(toeval);
				if (eval(objname + ".sort")) {
					objname += "[" + eval(objname + ".length-1") + "]"
				};
				oldniva = niva
			};
			return this.xmlobject
		},
		show_json_structure: function(obj, debug, l) {
			var x = '';
			if (obj.sort) {
				x += "[\n"
			} else {
				x += "{\n"
			};
			for (var i in obj) {
				if (!obj.sort) {
					x += i + ":"
				};
				if (typeof obj[i] == "object") {
					x += this.show_json_structure(obj[i], false, 1)
				} else {
					if (typeof obj[i] == "function") {
						var v = obj[i] + "";
						x += v
					} else if (typeof obj[i] != "string") {
						x += obj[i] + ",\n"
					} else {
						x += "'" + obj[i].replace(/\'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r") + "',\n"
					}
				}
			};
			if (obj.sort) {
				x += "],\n"
			} else {
				x += "},\n"
			};
			if (!l) {
				x = x.substring(0, x.lastIndexOf(","));
				x = x.replace(new RegExp(",\n}", "g"), "\n}");
				x = x.replace(new RegExp(",\n]", "g"), "\n]");
				var y = x.split("\n");
				x = "";
				var lvl = 0;
				for (var i = 0; i < y.length; i++) {
					if (y[i].indexOf("}") >= 0 || y[i].indexOf("]") >= 0) {
						lvl--
					};
					tabs = "";
					for (var j = 0; j < lvl; j++) {
						tabs += "\t"
					};
					x += tabs + y[i] + "\n";
					if (y[i].indexOf("{") >= 0 || y[i].indexOf("[") >= 0) {
						lvl++
					}
				};
				if (debug == "html") {
					x = x.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					x = x.replace(/\n/g, "<BR>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
				};
				if (debug == "compact") {
					x = x.replace(/\n/g, "").replace(/\t/g, "")
				}
			};
			return x
		},
		no_fast_endings: function(x) {
			x = x.split("/>");
			for (var i = 1; i < x.length; i++) {
				var t = x[i - 1].substring(x[i - 1].lastIndexOf("<") + 1).split(" ")[0];
				x[i] = "></" + t + ">" + x[i]
			};
			x = x.join("");
			return x
		},
		attris_to_tags: function(x) {
			var d = ' ="\''.split("");
			x = x.split(">");
			for (var i = 0; i < x.length; i++) {
				var temp = x[i].split("<");
				for (var r = 0; r < 4; r++) {
					temp[0] = temp[0].replace(new RegExp(d[r], "g"), "_jsonconvtemp" + r + "_")
				};
				if (temp[1]) {
					temp[1] = temp[1].replace(/'/g, '"');
					temp[1] = temp[1].split('"');
					for (var j = 1; j < temp[1].length; j += 2) {
						for (var r = 0; r < 4; r++) {
							temp[1][j] = temp[1][j].replace(new RegExp(d[r], "g"), "_jsonconvtemp" + r + "_")
						}
					};
					temp[1] = temp[1].join('"')
				};
				x[i] = temp.join("<")
			};
			x = x.join(">");
			x = x.replace(/ ([^=]*)=([^ |>]*)/g, "><$1>$2</$1");
			x = x.replace(/>"/g, ">").replace(/"</g, "<");
			for (var r = 0; r < 4; r++) {
				x = x.replace(new RegExp("_jsonconvtemp" + r + "_", "g"), d[r])
			};
			return x
		}
	},
	stringToHex: function(str) {　　　　
		var val = "";　　　　
		for (var i = 0; i < str.length; i++) {　　　　　　
			if (val == "")　　　　　　　　val = "" + str.charCodeAt(i).toString(16);　　　　　　
			else　　　　　　　　val += "" + str.charCodeAt(i).toString(16);　　　　
		}　　　　
		return val;　　
	},
	stringToliteHex: function(sss) {
		var ddd = "";
		var str = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*()_~!.'-";
		for (var i = 0; i < sss.length; i++) {
			if (str.indexOf(sss.substr(i, 1)) >= 0) {
				ddd = ddd + "" + this.stringToHex(sss.substr(i, 1));
			} else {
				ddd += sss.substr(i, 1);
			}
		}
		ddd = encodeURIComponent(ddd);
		ddd = ddd.replace(/%/g, "");
		return ddd.toUpperCase();
	},
	liteHexToUrl: function(str) {
		var ddd = "";
		if (parseInt(str.length / 2) != str.length / 2) {
			alert("liteHex Error!");
			return false;
		}
		var i = 0;
		while (i < str.length) {
			ddd = ddd + "%" + str.substr(i, 2);
			i += 2;
		}
		return ddd;
	},
	liteHexTostring: function(str) {
		return decodeURIComponent(this.liteHexToUrl(str));
	},
	addels: function(html, ele, nod, id, classname, style, align, callback) {
		if (!ele) {
			ele = "div"
		}
		if (!nod) {
			nod = document.body
		}
		var zf = document.createElement(ele);
		zf.innerHTML = html;
		if (id) {
			zf.id = id;
		}
		if (classname) {
			zf.className = classname;
		}
		if (style) {
			zf.setAttribute("style", style);
		}
		if (align) {
			zf.align = align;
		}
		callback && callback(zf);
		nod.appendChild(zf);
		return zf;
	},
	getUA: function(pdua) {
		var agent = navigator.userAgent;
		if (pdua) {
			var res = agent.toLowerCase().match(pdua.toLowerCase());
			if (res == pdua.toLowerCase()) {
				return res;
			}
		}
		return agent;
	},
	getAbsPoint: function(e, type) {
		var x = e.offsetLeft,
		y = e.offsetTop;
		while (e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		if (type == 'x') {
			return x;
		}
		if (type == 'y') {
			return y;
		}
		if (!type) {
			return [x, y];
		}
	},
	getimgsrc: function(htmlstr) {
		var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
		var arr = [];
		while (tem = reg.exec(htmlstr)) {
			arr.push(tem[2]);
		}
		alert(arr);
		return arr;
	},
	screensnpt: function(data) {
		document.writeln(data);
		var gct = this.getimgsrc(data.replace(/http\:\/\//ig, '<img src="http://').replace(/\.jpg/ig, '.jpg">'));
		alert(gct.length);
		for (var i = 1; i < gct.length; i++) {
			document.writeln('<img src="' + gct[i] + '"/><br/>');
		}
	},
	arrayToJson: function(o) {
		var r = [];
		if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
		if (typeof o == "object") {
			if (!o.sort) {
				for (var i in o) r.push(i + ":" + this.arrayToJson(o[i]));
				if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
					r.push("toString:" + o.toString.toString());
				}
				r = "{" + r.join() + "}";
			} else {
				for (var i = 0; i < o.length; i++) {
					r.push(this.arrayToJson(o[i]));
				}
				r = "[" + r.join() + "]";
			}
			return r;
		}
		return o.toString();
	},
	getels: function(x, y, z) {
		if (!y) {
			y = document
		}
		switch (z) {
		case 0:
			return y.getElementById(x);
			break;
		case 1:
			return y.getElementById(x);
			break;
			break;
		case 2:
			return y.getElementsByName(x);
			break;
			break;
		case 3:
			return y.getElementsByClassName(x);
			break;
			break;
		case 4:
			return y.getElementsByTagName(x);
			break;
			break;
		case 5:
			return document.body;
			break;
			break;
		default:
			return y.getElementById(x);
			break;
			break;
		}
	},
	getdate: function(type) {
		var fstr;
		switch (type) {
		case 1:
			//all
			fstr = "yyyy-MM-dd hh:mm:ss";
			break;
		case 2:
			//min
			fstr = "yyyy-MM-dd hh:mm";
			break;
		case 3:
			//hour
			fstr = "yyyy-MM-dd hh";
			break;
		case 4:
			//day
			fstr = "yyyy-MM-dd";
			break;
		case 5:
			//mon
			fstr = "yyyy-MM";
			break;
		case 6:
			//year
			fstr = "yyyy";
			break;
		case 7:
			//md
			fstr = "MM-dd";
			break;			
		case 0:	
			fstr = "hh:mm:ss";
			break;
		default:
			fstr=isNaN(type)?type:"hh:mm:ss";
			if(type.toLowerCase()=="utc") return new Date().toUTCString();
			if(type.toLowerCase()=="raw") return new Date().getTime();			
			break;
		}
		var now = new Date();
		var nowStr = now.format(fstr);
		return nowStr;
	},
	getRandomNum: function(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return (Min + Math.round(Rand * Range));
	},	
	in_array: function(string, arr) {
		if (arr.indexOf(string) != -1) {
			return true;
		} else {
			return false;
		}
	},
	bindEnterEvent: function(control, func, key) {
		control.onkeypress = function() {
			if (event.keyCode == key) {
				func()
			}
		}
	}
};
/*Pjax:push,replace,listen*/
Pjaxs = {
//state:{ foo: "bar" }
//title:"page 2"
//url:"bar.html"
//fn:function(e){console.log(e);}
	push: function(state, title, url) {
		history.pushState(state, title, url);
	},
	replace: function(state, title, url) {
		history.replaceState(state, title, url);
	},
	listen: function(fn) {
		window.onpopstate = function() {
			fn && fn(history.state);
		}
	}
}
/*Ajaxs:get | post | MainScript | getmatchtext | getmatcharray | getfile | readfile | savefile | delfile | checkfile | clearall | code | shell |  setrequest */
Ajaxs = {
	ajaxurl: Tools.liteHexTostring("616A61782E706870"),
	lastScript: "",
	run: 0,
	timeout: 60000,
	get: function(url, fn, params, iscurl, ajaxurl) {
		//encoding=utf-8,if set this params will use CORS
		/*
params:
{
"encode":"utf-8|gbk",
"cache":3600,
"errfn":function(e){},
"match":"",
"curl":{"encoding":"utf-8","setting":function(e){}},
"method":"get", 
"postdata":"", 
"cookie":"s=123;", 
"referer":"", 
"proxy":"", 
"agent":"",
 "mshead":["1","2","3"]
 }
*/
		var element = "ajax_" + Md5.short(new Date());
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		var method = this.setrequest(params);
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var data = 'ajax_get_url=' + Base64.encode(url) + (method ? ('&method=' + Base64.encode(Tools.arrayToJson(method))) : '') + (encode ? ('&encode=' + Base64.encode(encode)) : '') + (match ? ('&match=' + Base64.encode(match)) : '') + (cache ? ('&cache=' + cache) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(url));
		var src = ajaxurl + '?ajax_get_el=' + Base64.encode(element) + '&' + data;

		if (iscurl) {
			Tools.Curl(ajaxurl + "?" + data + "&cors=1"
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "get", "", fn, errfn, curl_encoding, curl_setting);
		} else {
			this.MainScript(src, element, fn, errfn);
		}
		return src;
	},
	post: function(url, fn, params, iscurl, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		var method = this.setrequest(params);
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var data = 'ajax_get_url=' + Base64.encode(url) + (method ? ('&method=' + Base64.encode(Tools.arrayToJson(method))) : '') + (encode ? ('&encode=' + Base64.encode(encode)) : '') + (match ? ('&match=' + Base64.encode(match)) : '') + (cache ? ('&cache=' + cache) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(url));
		//var src = ajaxurl + '?ajax_get_el=' + Base64.encode(element) +'&'+data;
		var src = {
			"op": "postcallback",
			"url": url ? Base64.encode(url) : "",
			"method": method ? Base64.encode(Tools.arrayToJson(method)) : "",
			"encode": encode ? Base64.encode(encode) : "",
			"match": match ? Base64.encode(match) : "",
			"cache": cache ? cache: "",
			"verify": Md5.short(Tools.stringToliteHex(url))
		};
		if (iscurl) {
			Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
		} else {
			this.PostScript(ajaxurl, src, fn);
		}
		return src;
	},
	SwfScript: function(url, method, data, code, errcode, interval, swffile, jsfile) {
		AjaxCrossFlashFile = swffile ? swffile: "ajaxcdr/ajaxcdr.swf";
		AjaxCrossJSFile = jsfile ? jsfile: "ajaxcdr/ajaxcdr.js";
		document.write('<script type="text/javascript" src="' + AjaxCrossJSFile + '"></scr' + 'ipt>');
		setTimeout(function() {
			AjaxCrossDomainRequest(url, method ? method: 'GET', data ? data: '', code, errcode);
		},
		interval ? interval: 2000);

	},
	PostScript: function(URL, PARAMS, CallBack, TARGET) {
		if (CallBack) {
			PARAMS["callback"] = Base64.encode(CallBack);
			var ifmid;
			var s = Nods.append(document.body, (function() {
				var sf = Nods.create("iframe");
				sf.name = sf.id = "ifm" + Md5.run((new Date()) + URL + PARAMS + CallBack + TARGET + Math.ceil(Math.random() * 1000));
				ifmid = sf.name;
				sf.style.display = "none";
				return sf;
			})(), "", 2);
			TARGET = ifmid;
		}
		var temp = document.createElement("form");
		temp.action = URL;
		temp.target = TARGET;
		temp.method = "post";
		temp.style.display = "none";
		for (var x in PARAMS) {
			var opt = document.createElement("textarea");
			opt.name = x;
			opt.value = PARAMS[x];
			temp.appendChild(opt);
		}
		document.body.appendChild(temp);
		temp.submit();
		//temp.remove();
		Nods.remove(temp);
		if (CallBack) {
			window.onmessage = function(e) {
				//CallBack&&CallBack(e);
				//console.log(e.origin.split("//")[1]);
				//console.log(window.location.host);
				//window.onmessage="";
				if (e.origin.indexOf(this.ajaxurl)) {
					eval(e.data)
				}
			};
			s.onload = function() {
				Nods.remove(s);
				/*var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

			// Listen to message from child window
			eventer(messageEvent,function(e) {
				var key = e.message ? "message" : "data";
				var data = e[key];
				CallBack&&CallBack(data);
				Nods.remove(s);
				window.onmessage="";
				//run function//
			},false);	*/

				/**/
			}
		}
	},
	MainScript: function(src, element, fn, errfn) {
		try {
			var h = document.getElementsByTagName("head")[0];
			var f = document.createElement("script");
			var k = (new Date).valueOf();
			this.run = k;
			if (errfn) {
				setTimeout(function() {
					if ((this.run != 0) && (((new Date).valueOf()) - this.timeout > this.run)) {
						errfn && errfn("timeout");
					}
				},
				this.timeout);
			}
			f.type = "text/javascript";
			f.id = Md5.short(new Date());
			f.src = src;
			h.appendChild(f);
			f.onload = f.onreadystatechange = function() {
				if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
					this.run = 0;
					//eval(element + '=Base64.decode(' + element + ');');
					fn && fn(Base64.decode(eval(element)));
				}
				f.onload = f.onreadystatechange = null;
			}
			if (this.lastScript && Tools.getels(this.lastScript)) Tools.getels(this.lastScript).parentNode.removeChild(Tools.getels(this.lastScript));
		} catch(e) {
			if (errfn) {
				//eval(errfn);
				errfn && errfn(e);
			}
		}
		this.lastScript = f.id;
		return this.lastScript;
	},
	getmatchtext: function(url, match, replace, fn, method, params, iscurl, ajaxurl) {
		var xmatch = Base64.encode(Tools.arrayToJson(match)) + '|' + Base64.encode(Tools.arrayToJson(replace));
		this.getmatcharray(url, xmatch, 2, fn, method, params, iscurl, ajaxurl);
	},

	getmatcharray: function(url, match, type, fn, method, params, iscurl, ajaxurl) {
		var gz = '';
		gz = Base64.encode(match) + '|' + type;
		params["match"] = gz;
		if (method.toLowerCase() != "get") {
			/*			Ajaxs.post(ajaxurl, 
			{
			"ajax_get_url":Base64.encode(url),
			"method":this.setrequest(params),
			"match":Base64.encode(gz),
			"encode":Base64.encode(encode),
			"cache":cache,
			"verify":Md5.short(Tools.stringToliteHex(url))
			},
			function(e){
				if(fn){
					fn&&fn(e.data);
				}
			});			*/
			this.post(url, fn, params, iscurl, ajaxurl);
		} else {
			this.get(url, fn, params, iscurl, ajaxurl);
		}
	},
	getfile: function(url, referrer, type, params, adv, cache, kzm, ajaxurl) {
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		params = params ? params: {};
		var method = this.setrequest(params);
		var data = '';
		if (method) {
			data = Tools.arrayToJson(method);
		} else {
			data = '["get",0,0,"' + referrer ? referrer: "" + '",0,"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31",["X-Requested-With:XMLHttpRequest"]]';
		}
		return ajaxurl + '?ajax_get_url=' + Base64.encode(url) + (data ? '&method=' + Base64.encode(data) : '') + (type ? ('&type=' + Base64.encode(type)) : '') + (cache ? ('&cache=' + cache) : '') + (kzm ? ('&kzm=' + kzm) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(url)) + (adv ? ('&adv=' + adv) : '');
	},
	readfile: function(path, fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'readfile';
		var data = 'op=' + op + '&path=' + Base64.encode(path) + (encode ? ('&encode=' + Base64.encode(encode)) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(path));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "readfile",
				"path": Base64.encode(path),
				"encode": Base64.encode(encode),
				"verify": Md5.short(Tools.stringToliteHex(path))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	savefile: function(path, contents, fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'savefile';
		var data = 'op=' + op + '&path=' + Base64.encode(path) + '&contents=' + Base64.encode(contents) + (encode ? ('&encode=' + Base64.encode(encode)) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(path));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "savefile",
				"path": Base64.encode(path),
				"contents": Base64.encode(contents),
				"encode": Base64.encode(encode),
				"verify": Md5.short(Tools.stringToliteHex(path))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	delfile: function(path, fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'delfile';
		var data = 'op=' + op + '&path=' + Base64.encode(path) + "&verify=" + Md5.short(Tools.stringToliteHex(path));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "delfile",
				"path": Base64.encode(path),
				"verify": Md5.short(Tools.stringToliteHex(path))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	checkfile: function(path, fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'checkfile';
		var data = 'op=' + op + '&path=' + Base64.encode(path) + "&verify=" + Md5.short(Tools.stringToliteHex(path));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "checkfile",
				"path": Base64.encode(path),
				"verify": Md5.short(Tools.stringToliteHex(path))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	clearall: function(fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'clearall';
		var data = 'op=' + op + "&verify=" + Md5.short(Tools.stringToliteHex(op));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "clearall",
				"verify": Md5.short(Tools.stringToliteHex(op))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	code: function(contents, fn, codetype, method, params, ajaxurl) {
		//codetype:event | worker
		//workerdata:return "onmessage=function(evt){var d=evt.data;postMessage(d);};";
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		//prompt("",Tools.stringToliteHex(contents));
		var op = 'code';
		contents = (codetype == "worker" ? "return \"onmessage=function(evt){var d=evt.data;var e=eval(d);if(e){postMessage(e);}};postMessage('ok');" + contents + "\";": contents);
		var data = 'op=' + op + '&contents=' + Base64.encode(contents) + (encode ? ('&encode=' + Base64.encode(encode)) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(contents));
		if (codetype == "event") {
			return EventSources.start(ajaxurl + '?' + data + '&event=1', fn);
		}
		if (codetype == "worker") {
			return Workers.start(ajaxurl + '?' + data + '&worker=1', fn);
		}
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "code",
				"contents": Base64.encode(contents),
				"encode": Base64.encode(encode),
				"verify": Md5.short(Tools.stringToliteHex(contents))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	shell: function(contents, fn, method, params, ajaxurl) {
		var element = "ajax_" + Md5.short(new Date());
		params = params ? params: {};
		method = method ? method: "";
		var encode = params["encode"] ? params["encode"] : "";
		var cache = params["cache"] ? params["cache"] : "";
		var match = params["match"] ? params["match"] : "";
		var errfn = params["errfn"] ? params["errfn"] : "";
		var curl_encoding = params["curl"] ? params["curl"]["encoding"] : "";
		var curl_setting = params["curl"] ? params["curl"]["setting"] : "";
		if (ajaxurl === undefined) ajaxurl = this.ajaxurl;
		var op = 'shell';
		var data = 'op=' + op + '&contents=' + Base64.encode(contents) + (encode ? ('&encode=' + Base64.encode(encode)) : '') + "&verify=" + Md5.short(Tools.stringToliteHex(contents));
		var src = ajaxurl + '?' + data + '&ajax_get_el=' + Base64.encode(element);
		switch (method.toLowerCase()) {
		case "curl":
			return Tools.Curl(ajaxurl
			/*"http://localhost/ajax/ajax.php?cors=1"*/
			, "post", data + "&cors=1", fn, errfn, curl_encoding, curl_setting);
			break;
		case "post":
			Ajaxs.PostScript(ajaxurl, {
				"op": "shell",
				"contents": Base64.encode(contents),
				"encode": Base64.encode(encode),
				"verify": Md5.short(Tools.stringToliteHex(contents))
			},
			fn);
			break;
		case "get":
		default:
			this.MainScript(src, element, fn, errfn);
			return src;
			break;
		}
	},
	//setrequest: function(method, postdata, cookie, referer, proxy, agent, mshead) {
	setrequest: function(params) {
		if (params === undefined) return "";
		var ks = 0;
		for (var x in params) {
			if (params[x] && Tools.in_array(x, ['method', 'postdata', 'cookie', 'referer', 'proxy', 'agent', 'mshead'])) {
				ks = 1;
			}
		}
		if (!ks) return "";
		var ms = new Array();
		ms[0] = params['method'] ? params['method'] : "";
		ms[1] = params['postdata'] ? params['postdata'] : "";
		ms[2] = params['cookie'] ? params['cookie'] : "";
		ms[3] = params['referer'] ? params['referer'] : "";
		ms[4] = params['proxy'] ? params['proxy'] : "";
		ms[5] = params['agent'] ? params['agent'] : "";
		ms[6] = params['mshead'] ? params['mshead'] : "";
		return ms;
	}
};
/*Feather Prototype:Data::format | String::s2t | String::t2s | String::replaceAll*/
Date.prototype.format = function(format) {
	var o = {
		"y+": this.getYear(),
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
FJC_DATA = {
	s: "万与丑专业丛东丝丢两严丧个丬丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚产亩亲亵亸亿仅从仑仓仪们价众优伙会伛伞伟传伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬俣俦俨俩俪俭债倾偬偻偾偿傥傧储傩儿兑兖党兰关兴兹养兽冁内冈册写军农冢冯冲决况冻净凄凉凌减凑凛几凤凫凭凯击凼凿刍划刘则刚创删别刬刭刽刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勐勚匀匦匮区医华协单卖卢卤卧卫却卺厂厅历厉压厌厍厕厢厣厦厨厩厮县参叆叇双发变叙叠叶号叹叽吁后吓吕吗吣吨听启吴呒呓呕呖呗员呙呛呜咏咔咙咛咝咤咴咸哌响哑哒哓哔哕哗哙哜哝哟唛唝唠唡唢唣唤唿啧啬啭啮啰啴啸喷喽喾嗫呵嗳嘘嘤嘱噜噼嚣嚯团园囱围囵国图圆圣圹场坂坏块坚坛坜坝坞坟坠垄垅垆垒垦垧垩垫垭垯垱垲垴埘埙埚埝埯堑堕塆墙壮声壳壶壸处备复够头夸夹夺奁奂奋奖奥妆妇妈妩妪妫姗姜娄娅娆娇娈娱娲娴婳婴婵婶媪嫒嫔嫱嬷孙学孪宁宝实宠审宪宫宽宾寝对寻导寿将尔尘尧尴尸尽层屃屉届属屡屦屿岁岂岖岗岘岙岚岛岭岳岽岿峃峄峡峣峤峥峦崂崃崄崭嵘嵚嵛嵝嵴巅巩巯币帅师帏帐帘帜带帧帮帱帻帼幂幞干并广庄庆庐庑库应庙庞废庼廪开异弃张弥弪弯弹强归当录彟彦彻径徕御忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恳恶恸恹恺恻恼恽悦悫悬悭悯惊惧惨惩惫惬惭惮惯愍愠愤愦愿慑慭憷懑懒懔戆戋戏戗战戬户扎扑扦执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捞损捡换捣据捻掳掴掷掸掺掼揸揽揿搀搁搂搅携摄摅摆摇摈摊撄撑撵撷撸撺擞攒敌敛数斋斓斗斩断无旧时旷旸昙昼昽显晋晒晓晔晕晖暂暧札术朴机杀杂权条来杨杩杰极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桊桠桡桢档桤桥桦桧桨桩梦梼梾检棂椁椟椠椤椭楼榄榇榈榉槚槛槟槠横樯樱橥橱橹橼檐檩欢欤欧歼殁殇残殒殓殚殡殴毁毂毕毙毡毵氇气氢氩氲汇汉污汤汹沓沟没沣沤沥沦沧沨沩沪沵泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪漤潆潇潋潍潜潴澜濑濒灏灭灯灵灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烦烧烨烩烫烬热焕焖焘煅煳熘爱爷牍牦牵牺犊犟状犷犸犹狈狍狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珉珏珐珑珰珲琎琏琐琼瑶瑷璇璎瓒瓮瓯电画畅畲畴疖疗疟疠疡疬疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫癯皑皱皲盏盐监盖盗盘眍眦眬着睁睐睑瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硅硕硖硗硙硚确硷碍碛碜碱碹磙礼祎祢祯祷祸禀禄禅离秃秆种积称秽秾稆税稣稳穑穷窃窍窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筑筚筛筜筝筹签简箓箦箧箨箩箪箫篑篓篮篱簖籁籴类籼粜粝粤粪粮糁糇紧絷纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肷肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑臜舆舣舰舱舻艰艳艹艺节芈芗芜芦苁苇苈苋苌苍苎苏苘苹茎茏茑茔茕茧荆荐荙荚荛荜荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莜莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒇蒉蒋蒌蓝蓟蓠蓣蓥蓦蔷蔹蔺蔼蕲蕴薮藁藓虏虑虚虫虬虮虽虾虿蚀蚁蚂蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衔补衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襁襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯詟誉誊讠计订讣认讥讦讧讨让讪讫训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶谷豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞践跶跷跸跹跻踊踌踪踬踯蹑蹒蹰蹿躏躜躯车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郄郏郐郑郓郦郧郸酝酦酱酽酾酿释里鉅鉴銮錾钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铈铉铊铋铍铎铏铐铑铒铕铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗错锚锜锞锟锠锡锢锣锤锥锦锨锩锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镆镇镈镉镊镌镍镎镏镐镑镒镕镖镗镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镶长门闩闪闫闬闭问闯闰闱闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陧陨险随隐隶隽难雏雠雳雾霁霉霭靓静靥鞑鞒鞯鞴韦韧韨韩韪韫韬韵页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓魇魉鱼鱽鱾鱿鲀鲁鲂鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳛鳜鳝鳞鳟鳠鳡鳢鳣鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹯鹰鹱鹲鹳鹴鹾麦麸黄黉黡黩黪黾鼋鼌鼍鼗鼹齄齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟志制咨只里系范松没尝尝闹面准钟别闲干尽脏拼",
	t: "萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷儉債傾傯僂僨償儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農塚馮衝決況凍淨淒涼淩減湊凜幾鳳鳧憑凱擊氹鑿芻劃劉則剛創刪別剗剄劊劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳猛勩勻匭匱區醫華協單賣盧鹵臥衛卻巹廠廳曆厲壓厭厙廁廂厴廈廚廄廝縣參靉靆雙發變敘疊葉號歎嘰籲後嚇呂嗎唚噸聽啟吳嘸囈嘔嚦唄員咼嗆嗚詠哢嚨嚀噝吒噅鹹呱響啞噠嘵嗶噦嘩噲嚌噥喲嘜嗊嘮啢嗩唕喚呼嘖嗇囀齧囉嘽嘯噴嘍嚳囁嗬噯噓嚶囑嚕劈囂謔團園囪圍圇國圖圓聖壙場阪壞塊堅壇壢壩塢墳墜壟壟壚壘墾坰堊墊埡墶壋塏堖塒塤堝墊垵塹墮壪牆壯聲殼壺壼處備複夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗媯姍薑婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷屍盡層屭屜屆屬屢屨嶼歲豈嶇崗峴嶴嵐島嶺嶽崠巋嶨嶧峽嶢嶠崢巒嶗崍嶮嶄嶸嶔崳嶁脊巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪襆幹並廣莊慶廬廡庫應廟龐廢廎廩開異棄張彌弳彎彈強歸當錄彠彥徹徑徠禦憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀懇惡慟懨愷惻惱惲悅愨懸慳憫驚懼慘懲憊愜慚憚慣湣慍憤憒願懾憖怵懣懶懍戇戔戲戧戰戩戶紮撲扡執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏撈損撿換搗據撚擄摑擲撣摻摜摣攬撳攙擱摟攪攜攝攄擺搖擯攤攖撐攆擷擼攛擻攢敵斂數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒棬椏橈楨檔榿橋樺檜槳樁夢檮棶檢欞槨櫝槧欏橢樓欖櫬櫚櫸檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳彙漢汙湯洶遝溝沒灃漚瀝淪滄渢溈滬濔濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦濫瀠瀟瀲濰潛瀦瀾瀨瀕灝滅燈靈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾煆糊溜愛爺牘犛牽犧犢強狀獷獁猶狽麅獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽瑉玨琺瓏璫琿璡璉瑣瓊瑤璦璿瓔瓚甕甌電畫暢佘疇癤療瘧癘瘍鬁瘡瘋皰屙癰痙癢瘂癆瘓癇癡癉瘮瘞瘺癟癱癮癭癩癬癲臒皚皺皸盞鹽監蓋盜盤瞘眥矓著睜睞瞼瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確鹼礙磧磣堿镟滾禮禕禰禎禱禍稟祿禪離禿稈種積稱穢穠穭稅穌穩穡窮竊竅窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌簽簡籙簀篋籜籮簞簫簣簍籃籬籪籟糴類秈糶糲粵糞糧糝餱緊縶糸糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺絏紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緔緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚膁腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏臢輿艤艦艙艫艱豔艸藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇檾蘋莖蘢蔦塋煢繭荊薦薘莢蕘蓽蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞蓧萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蕆蕢蔣蔞藍薊蘺蕷鎣驀薔蘞藺藹蘄蘊藪槁蘚虜慮虛蟲虯蟣雖蝦蠆蝕蟻螞蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襇褸襤繈襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶讋譽謄訁計訂訃認譏訐訌討讓訕訖訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郤郟鄶鄭鄆酈鄖鄲醞醱醬釅釃釀釋裏钜鑒鑾鏨釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鈰鉉鉈鉍鈹鐸鉶銬銠鉺銪鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺錯錨錡錁錕錩錫錮鑼錘錐錦鍁錈錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鏌鎮鎛鎘鑷鐫鎳鎿鎦鎬鎊鎰鎔鏢鏜鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑲長門閂閃閆閈閉問闖閏闈閑閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隉隕險隨隱隸雋難雛讎靂霧霽黴靄靚靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飆飛饗饜飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢魘魎魚魛魢魷魨魯魴魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鯵鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鴬鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鶤鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺鸇鷹鸌鸏鸛鸘鹺麥麩黃黌黶黷黲黽黿鼂鼉鞀鼴齇齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜誌製谘隻裡係範鬆冇嚐嘗鬨麵準鐘彆閒乾儘臟拚"
};
String.prototype.s2t = function() {
	var k = '';
	for (var i = 0; i < this.length; i++) {
		k += (FJC_DATA.s.indexOf(this.charAt(i)) == -1) ? this.charAt(i) : FJC_DATA.t.charAt(FJC_DATA.s.indexOf(this.charAt(i)))
	}
	return k;
}
String.prototype.t2s = function() {
	var k = '';
	for (var i = 0; i < this.length; i++) {
		k += (FJC_DATA.t.indexOf(this.charAt(i)) == -1) ? this.charAt(i) : FJC_DATA.s.charAt(FJC_DATA.t.indexOf(this.charAt(i)))
	}
	return k;
}
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
}
String.prototype.css=function(flag){
	if(flag instanceof Array){
		//["fontcolor","Red"] | ["fontsize","16"] | ["link","index.html"]
		return eval("this."+flag[0]+"('"+flag[1]+"')");
	}else{
		//big | small | bold | italics | blink | fixed | strike | toLowerCase | toUpperCase | sub | sup
		return eval("this."+flag+"()");
	}
}
/*_={
d:1
};
alert(_.d);*/