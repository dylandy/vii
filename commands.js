//"use strict";
define({
	C: undefined,
	setC: function(c, cursor) {
		C = c;
//		this.C = c;
	},

	insert: function(text){
		C.doc.replaceRange(text, C.editor.getCursorPos());
	},

	centerCursor: function(){
		var margin = C.cm.getScrollInfo().clientHeight * 0.49;
		C.cm.scrollIntoView(C.doc.getCursor(), margin);
	},

	scroll: function(up){
		if (window.intervalID) window.intervalID = clearInterval(window.intervalID);
		window.globalUp = up;
		C.cm.scrollTo(null, window.globalUp ? C.cm.getScrollInfo().top-60 : C.cm.getScrollInfo().top+60);
		window.globalCounter = 60;
		window.intervalID = setInterval("C.cm.scrollTo(null, window.globalUp ? " +
			"C.cm.getScrollInfo().top-window.globalCounter : " +
			"C.cm.getScrollInfo().top+window.globalCounter);" +
			"window.globalCounter-=5;" +
			"if(window.globalCounter<2)"+
			"window.intervalID = clearInterval(window.intervalID);", 10);
	},

	joinLines: function(){
		if (!C.editorReady()) return true;
		if (C.doc.somethingSelected()) {
			var splitted = C.doc.getSelection().split("\n"),
				result = "";
			for(var i in splitted) result += splitted[i].trim() + " ";
			C.doc.replaceSelection(result);
		} else {
			var cursor = C.doc.getCursor();
			if (cursor.line >= C.doc.lastLine()) return;
			CodeMirror.commands["goLineStartSmart"](C.cm);
			var from = C.doc.getCursor();
			C.cm.moveV(1, "line");
			CodeMirror.commands["goLineEnd"](C.cm);
			var to = C.doc.getCursor();
			var thisLine = C.doc.getLine(cursor.line);
			var nextLine = C.doc.getLine(cursor.line+1);
			C.doc.replaceRange(thisLine.trim()+" "+nextLine.trim(), from, to);
			C.doc.setCursor(cursor);
		}
	},

	insertLineBefore: function() {
		C.cm.moveV(-1, "line");
		CodeMirror.commands["goLineEnd"](C.cm);
		CodeMirror.commands["newlineAndIndent"](C.cm);
	},

	deleteWord: function(direction) {
		var cursor 	= C.doc.getCursor(),
			left 	= C.doc.getCursor(),
			right	= C.doc.getCursor();
		if (C.doc.somethingSelected())
			C.doc.replaceSelection("");
		else if (direction === C.LEFT) {
			C.Cursor.move(C.LEFT);
			left.ch = C.doc.getCursor().ch;
			C.Cursor.move(C.RIGHT);
			right.ch = C.doc.getCursor().ch;
			if (right.ch < cursor.ch) right = cursor;
		} else if (direction === C.RIGHT) {
			C.Cursor.move(C.RIGHT);
			right.ch = C.doc.getCursor().ch;
			C.Cursor.move(C.LEFT);
			left.ch = C.doc.getCursor().ch;
			if (left.ch > cursor.ch) left = cursor;
		}
		C.doc.setSelection(left, right);
	},

	deleteLines: function() {
		if (!C.editorReady()) return;
		C.CommandManager.execute('edit.deletelines');
		C.cm.moveV(-1, "line");
		CodeMirror.commands["goLineEnd"](C.cm);
		C.doc.setCursor(C.doc.getCursor());
	},

	deleteToHead: function() {
		if (!C.editorReady()) return;
		if (C.doc.somethingSelected()) {
			C.doc.replaceSelection("");
			return;
		}
		var cursorRight = C.doc.getCursor(),
			cursorLeft = C.doc.getCursor();
		CodeMirror.commands["goLineStartSmart"](C.cm);
		var head = C.doc.getCursor().ch;
		cursorLeft.ch = head;
		C.doc.replaceRange("", cursorLeft, cursorRight);
	},

	duplicateLines: function() {
		if (!C.editorReady()) return;
		if (C.doc.somethingSelected()) {
			var L = C.doc.getCursor('start'),
				R = C.doc.getCursor('end');
			L.ch = 0;
			R.ch = C.doc.getLine(R.line).length;
			C.doc.setSelection(L, R);
			C.CommandManager.execute('edit.duplicate');
			C.doc.setCursor(R);
			CodeMirror.commands["newlineAndIndent"](C.cm);
		} else C.CommandManager.execute('edit.duplicate');
	},

	toggleComment: function() {
		C.CommandManager.execute('edit.lineComment');
		if (!C.doc.somethingSelected())
			C.cm.moveV(1, "line");
	}
});