define(function (require, exports, module) {
return {

	moveCursor: function (direction) {
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
		cursor = doc.getCursor(direction === C.LEFT ? 'start' : 'end');
		if (doc.getMode(cursor).name === "null") {
			if (direction === C.LEFT)
				CodeMirror.commands["goGroupLeft"](ccm);
			else if (direction === RIGHT)
				CodeMirror.commands["goGroupRight"](ccm);
			return;
		}
		if (direction === C.LEFT) {
			token = ccm.getTokenAt(cursor, true);
			var spaceCount = countSpacesAtEnd(token.string);
			if (spaceCount > 0 && cursor.ch === token.end && token.string.trim().length === 0) {
				doc.extendSelection(CodeMirror.Pos(cursor.line, cursor.ch-spaceCount));
				return;
			}
			if (token.string === ' ') {
				cursor.ch -= 1;
				token = ccm.getTokenAt(cursor, true);
			}
			var group = ccm.findPosH(cursor, -1, 'group');
			var word = ccm.findPosH(cursor, -1, 'word');
			if (group.line != cursor.line) group.ch = 0;
			if (word.line != cursor.line) word.ch = 0;
			pos = CodeMirror.Pos(cursor.line, Math.max(token.start, group.ch, word.ch));
		} else if (direction === C.RIGHT) {
			var x = doc.getLine(cursor.line);
			if (cursor.ch === 0 && x.substring(0,1) === '\t') {
				var tabCount = countTabsAtHead(x);
				doc.extendSelection(CodeMirror.Pos(cursor.line, tabCount));
				return
			}
			cursor.ch += 1;
			token = ccm.getTokenAt(cursor, true);
			if (token.string === ' ') {
				cursor.ch += 1;
				token = ccm.getTokenAt(cursor, true);
			}
			group = ccm.findPosH(cursor, 1, 'group');
			word = ccm.findPosH(cursor, 1, 'word');
			if (group.line != cursor.line) group.ch = Infinity;
			if (word.line != cursor.line) word.ch = Infinity;
			pos = CodeMirror.Pos(cursor.line, Math.min(token.end, group.ch, word.ch));
		}
		doc.extendSelection(pos);
	},

	moveCursor10: function (up) {
		for(var i = 0; i < 5; i++)
			ccm.moveV(up ? -1 : 1, "line");
	},

	focusAtCenter: function () {
		var scrollInfo = ccm.getScrollInfo();
		var x = scrollInfo.clientWidth/2;
		var y = scrollInfo.clientHeight/2;
		var ch = ccm.coordsChar({left:x, top:y});
		doc.extendSelection(ch);
	}

}
});