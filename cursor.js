define(function (require, exports, module) {
	"use strict";
	var C;
	exports.setC = function (c) {
		C = c;
	};

	exports.move = function (direction) {
		function countSpacesAtEnd(str) {
			var i = str.length - 1;
			while(i >= 0 && str.substr(i, 1) === ' ') i -= 1;
			return str.length-i-1;
		}
		function countTabsAtHead(str) {
			var i = 0;
			while(i < str.length && str.substr(i, 1) === '\t') i += 1;
			return i;
		}
		var cursor, token, pos, coords;
		if (C.selectExtending)
			cursor = C.doc.getCursor('head');
		else
			cursor = C.doc.getCursor(direction === C.LEFT ? 'start' : 'end');
		if (C.doc.getMode(cursor).name === "null") {
			if (direction === C.LEFT)
				CodeMirror.commands["goGroupLeft"](C.cm);
			else if (direction === C.RIGHT)
				CodeMirror.commands["goGroupRight"](C.cm);
			return;
		}
		if (direction === C.LEFT) {
			token = C.cm.getTokenAt(cursor, true);
			var spaceCount = countSpacesAtEnd(token.string);
			if (spaceCount > 0 && cursor.ch === token.end && token.string.trim().length === 0) {
				C.doc.extendSelection(CodeMirror.Pos(cursor.line, cursor.ch-spaceCount));
				return;
			}
			if (token.string === ' ') {
				cursor.ch -= 1;
				token = C.cm.getTokenAt(cursor, true);
				cursor.ch += 1;
			}
			var group = C.cm.findPosH(cursor, -1, 'group');
			var word = C.cm.findPosH(cursor, -1, 'word');
			if (group.line != cursor.line) group.ch = 0;
			if (word.line != cursor.line) word.ch = 0;
			pos = CodeMirror.Pos(cursor.line, Math.max(token.start, group.ch, word.ch));
		} else if (direction === C.RIGHT) {
			var x = C.doc.getLine(cursor.line);
			if (cursor.ch === 0 && x.substring(0,1) === '\t') {
				var tabCount = countTabsAtHead(x);
				C.doc.extendSelection(CodeMirror.Pos(cursor.line, tabCount));
				return
			}
			cursor.ch += 1;
			token = C.cm.getTokenAt(cursor, true);
//			console.log(token)
			if (token.string === ' ') {
				cursor.ch += 1;
				token = C.cm.getTokenAt(cursor, true);
				cursor.ch -= 1;
			}
			cursor.ch -= 1;
			group = C.cm.findPosH(cursor, 1, 'group');
			word = C.cm.findPosH(cursor, 1, 'word');
			if (group.line != cursor.line) group.ch = Infinity;
			if (word.line != cursor.line) word.ch = Infinity;
			pos = CodeMirror.Pos(cursor.line, Math.min(token.end, group.ch, word.ch));
		}
		C.doc.extendSelection(pos);
	};

	exports.move10 = function (up) {
		for(var i = 0; i < 5; i++)
			C.cm.moveV(up ? -1 : 1, "line");
	},

	exports.focusAtCenter = function () {
		var scrollInfo = C.cm.getScrollInfo();
		var x = scrollInfo.clientWidth/2;
		var y = scrollInfo.clientHeight/2;
		var ch = C.cm.coordsChar({left:x, top:y});
		C.doc.extendSelection(ch);
	}
});