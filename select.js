//"use strict";
define({
	C: undefined,
	setC: function(c) {
		C = c;
//		this.C = c;
	},

	line: function () {
		function countTabsAtHead(str) {
			var i = 0;
			while(i < str.length && str.substr(i, 1) === '\t') i += 1;
			return i;
		}
		C.CommandManager.execute('edit.selectLine')
		var sel = C.doc.getSelection(),
			head = C.doc.getCursor('start'),
			tail = C.doc.getCursor('end');
		head.ch += countTabsAtHead(sel);
		tail.line -= 1;
		tail.ch = C.doc.getLine(tail.line).length;
		C.doc.setSelection(head, tail);
	},

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
		var L = C.TokenUtils.getInitialContext(C.cm, LC),
			R = C.TokenUtils.getInitialContext(C.cm, RC);

		var Rstack = [], Lstack = [];
		function goLeft() {
			while (true) {
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
				if (!C.TokenUtils.movePrevToken(L)) break;
			}
		}
		function goRight(){
			while (true) {
				if (!C.TokenUtils.moveNextToken(R)) break;
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
		} else if (RB.indexOf(Rchar) >= 0 && LB.indexOf(Lchar) < 0){
			goLeft();
		} else if (RB.indexOf(Rchar) < 0 && LB.indexOf(Lchar) >= 0){
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
		var B = ['\"', '\'', '(', '[', '{', '/*', ')', ']', '}', '*/'];
		if (C.doc.somethingSelected()) return this.extendSelection();
		var cursor = C.doc.getCursor(),
			token = C.cm.getTokenAt(cursor, true);
		cursor.ch += 1;
		var rightToken = C.cm.getTokenAt(cursor, true);
		cursor.ch -= 1;

		if (token.string.trim() === '' ||
		    (token.end - token.start === 1 && rightToken.end - rightToken.start > 1) ||
//			(token.string.length > 1) ||
		    (B.indexOf(token.string) >= 0 && B.indexOf(rightToken.string) < 0)) {
			if(cursor.ch === token.end && token.string.length > 1) {
				C.Cursor.move(C.LEFT);
				var left = C.doc.getCursor();
				C.doc.setSelection(left, cursor);
			} else {
				C.Cursor.move(C.RIGHT);
				var right = C.doc.getCursor();
				C.doc.setSelection(cursor, right);
			}
		} else {
//			console.log('else');
			C.Cursor.move(C.LEFT);
			var left = C.doc.getCursor();
			C.Cursor.move(C.RIGHT);
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
});