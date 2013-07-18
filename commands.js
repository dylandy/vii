define(function (require, exports, module) {
return {



	insert: function(text){
		doc.replaceRange(text, editor.getCursorPos());
	},

	centerCursor: function(){
		var margin = ccm.getScrollInfo().clientHeight * 0.49;
		ccm.scrollIntoView(doc.getCursor(), margin);
	},

	scroll: function(up){
		if (intervalID) intervalID = clearInterval(intervalID);
		globalUp = up;
		ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-60 : ccm.getScrollInfo().top+60);
		globalCounter = 60;
		intervalID = setInterval("ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-globalCounter : ccm.getScrollInfo().top+globalCounter); globalCounter-=5; if(globalCounter<2) intervalID = clearInterval(intervalID);", 10);
	},

	joinLines: function(){
		C.initGlobalArgs();
		if (!editor) return true;

		if (doc.somethingSelected()) {
			var splitted = doc.getSelection().split("\n"),
				result = "";
			for(var i in splitted) result += splitted[i].trim() + " ";
			doc.replaceSelection(result);
		} else {
			var cursor = doc.getCursor();
			if (cursor.line >= doc.lastLine()) return;
			CodeMirror.commands["goLineStartSmart"](ccm);
			var from = doc.getCursor();
			ccm.moveV(1, "line");
			CodeMirror.commands["goLineEnd"](ccm);
			var to = doc.getCursor();
			var thisLine = doc.getLine(cursor.line);
			var nextLine = doc.getLine(cursor.line+1);
			doc.replaceRange(thisLine.trim()+" "+nextLine.trim(), from, to);
			doc.setCursor(cursor);
		}
	},

	insertLineBefore: function() {
		ccm.moveV(-1, "line");
		CodeMirror.commands["goLineEnd"](ccm);
		CodeMirror.commands["newlineAndIndent"](ccm);
	},

	deleteWord: function(direction) {
		var cursor = doc.getCursor(),
			left = doc.getCursor(),
			right = doc.getCursor();
		if (doc.somethingSelected())
			doc.replaceSelection("");
		else if (direction === LEFT) {
			moveCursor(LEFT);
			left.ch = doc.getCursor().ch;
			moveCursor(RIGHT);
			right.ch = doc.getCursor().ch;
			if (right.ch < cursor.ch) right = cursor;
		} else if (direction === RIGHT) {
			moveCursor(RIGHT);
			right.ch = doc.getCursor().ch;
			moveCursor(LEFT);
			left.ch = doc.getCursor().ch;
			if (left.ch > cursor.ch) left = cursor;
		}
		doc.setSelection(left, right);
	},

	deleteLines: function() {
		C.initGlobalArgs();
		if (!editor) return;
		CommandManager.execute('edit.deletelines');
		ccm.moveV(-1, "line");
		CodeMirror.commands["goLineEnd"](ccm);
		doc.setCursor(doc.getCursor());
	},

	deleteToHead: function() {
		C.initGlobalArgs();
		if (!editor) return;
		if (doc.somethingSelected()) {
			doc.replaceSelection("");
			return;
		}
		var cursorRight = doc.getCursor(),
			cursorLeft = doc.getCursor();
		CodeMirror.commands["goLineStartSmart"](ccm);
		var head = doc.getCursor().ch;
		cursorLeft.ch = head;
		doc.replaceRange("", cursorLeft, cursorRight);
	},

	duplicateLines: function() {
		C.initGlobalArgs();
		if (doc.somethingSelected()) {
			var L = doc.getCursor('start'),
				R = doc.getCursor('end');
			L.ch = 0;
			R.ch = doc.getLine(R.line).length;
			doc.setSelection(L, R);
			CommandManager.execute('edit.duplicate');
			doc.setCursor(R);
			CodeMirror.commands["newlineAndIndent"](ccm);
		} else CommandManager.execute('edit.duplicate');
	},

	insertLineBefore: function() {
		ccm.moveV(-1, "line");
		CodeMirror.commands["goLineEnd"](ccm);
	}
}});