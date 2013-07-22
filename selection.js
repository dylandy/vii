define(function (require, exports, module) {
return {
	extendSelection: function () {
		var LB = ['\"', '\'', '(', '[', '{', '/*'],
			RB = ['\"', '\'', ')', ']', '}', '*/'];
		var LC = C.doc.getCursor('start'),
			RC = C.doc.getCursor('end');
		var Lchar = C.doc.getRange(
			{line: LC.line, ch: LC.ch-1},
			{line: LC.line, ch: LC.ch});
		var Rchar = C.doc.getRange(
			{line: RC.line, ch: RC.ch},
			{line: RC.line, ch: RC.ch+1});
		var L = TokenUtils.getInitialContext(C.cm, LC),
			R = TokenUtils.getInitialContext(C.cm, RC);

		var Rstack = [], Lstack = [];
		function goLeft() {
			while (true) {
				if (!TokenUtils.movePrevToken(L)) break;
				if (LB.indexOf(L.token.string) >= 0) {
					if (Lstack.length === 0) break;
					else if (Lstack.length > 0 && L.token.string === Lstack[Lstack.length-1]) {
						Lstack.pop();
					} else {
						console.error('vii: brackets not matched');
						break;
					}
				} else if (RB.indexOf(L.token.string) >= 0) {
					Lstack.push(LB[RB.indexOf(L.token.string)]);
				}
			}
		}
		function goRight(){
			while (true) {
				if (!TokenUtils.moveNextToken(R)) break;
				if (RB.indexOf(R.token.string) >= 0) {
					if (Rstack.length === 0) break;
					else if (Rstack.length > 0 && R.token.string === Rstack[Rstack.length-1]) {
						Rstack.pop();
					}
					else {
						console.error('vii: brackets not matched');
						break;
					}
				} else if (LB.indexOf(R.token.string) >= 0) {
					Rstack.push(RB[LB.indexOf(R.token.string)]);
				}
			}
		}

		if (LB.indexOf(Lchar) >= 0 && LB.indexOf(Lchar) === RB.indexOf(Rchar)) {
			C.doc.setSelection({line: LC.line, ch: LC.ch-1}, {line: RC.line, ch: RC.ch+1});
			return;
		} else if (RB.indexOf(Rchar)>=0 && LB.indexOf(Lchar) < 0){
			goLeft();
			LC.ch += 1;
		} else if (RB.indexOf(Rchar)<0 && LB.indexOf(Lchar) >= 0){
			goRight();
			RC.ch -= 1;
		} else {
			goLeft();
			goRight();
			RC.ch -= 1;
		}
		C.doc.setSelection(LC, RC);
	},

	smartSelect: function () {
		if (C.doc.somethingSelected()) return this.extendSelection();
		var cursor = C.doc.getCursor(),
			token = C.cm.getTokenAt(cursor, true);
		cursor.ch += 1;
		var rightToken = C.cm.getTokenAt(cursor, true);
		cursor.ch -= 1;

		if (token.string.trim() === '' ||
		   (token.end - token.start === 1 && rightToken.end - rightToken.start >1)) {
			Cursor.moveCursor(C.RIGHT);
			var right = C.doc.getCursor();
			C.doc.setSelection(cursor, right);
		} else {
			Cursor.moveCursor(C.LEFT);
			var left = C.doc.getCursor();
			Cursor.moveCursor(C.RIGHT);
			var right = C.doc.getCursor();
			if (right.ch > cursor.ch)
				C.doc.setSelection(left, right);
			else C.doc.setSelection(left, cursor);
		}
	},

	selectToggle: function () {
		C.selectExtending = !C.selectExtending;
		C.doc.setExtending(C.selectExtending);
	},

	swapAnchor: function () {
		C.doc.setSelection(C.doc.getCursor('head'), C.doc.getCursor('anchor'));
	}
}
});