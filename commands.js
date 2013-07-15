function insert(text) {
	doc.replaceRange(text, editor.getCursorPos());
}

function moveCursor(direction) {
	var cursor, token, pos, coords;
	cursor = doc.getCursor();
	if (doc.getMode(cursor).name === "null") {
		if (direction === LEFT)
			CodeMirror.commands["goGroupLeft"](ccm);
		else if (direction === RIGHT)
			CodeMirror.commands["goGroupRight"](ccm);
		return;
	}
	if (direction === LEFT) {
		token = ccm.getTokenAt(cursor, true);
		if (token.string === ' ') {
			cursor.ch -= 1;
			token = ccm.getTokenAt(cursor, true);
		}
		var group = ccm.findPosH(cursor, -1, 'group');
		var word = ccm.findPosH(cursor, -1, 'word');
		if (group.line != cursor.line) group.ch = 0;
		if (word.line != cursor.line) word.ch = 0;
		pos = CodeMirror.Pos(cursor.line, Math.max(token.start, group.ch, word.ch));
	} else if (direction === RIGHT) {
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
	doc.setCursor(pos);
}

function moveCursor10(up) {
	var cursor = doc.getCursor();
	cursor.line += up ? -5 : 5;
	doc.setCursor(cursor);
	CodeMirror.commands["goLineEnd"](ccm);
	if (doc.getCursor().ch > 100) doc.setCursor(cursor);
}

function centerCursor() {
	var margin = ccm.getScrollInfo().clientHeight * 0.49;
	ccm.scrollIntoView(doc.getCursor(), margin);
}

function focusAtCenter() {
	var scrollInfo = ccm.getScrollInfo();
	var x = scrollInfo.clientWidth/2;
	var y = scrollInfo.clientHeight/2;
	var ch = ccm.coordsChar({left:x, top:y});
	doc.setCursor(ch);
}

function scroll(up) {
	if (intervalID) intervalID = clearInterval(intervalID);
	globalUp = up;
	ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-60 : ccm.getScrollInfo().top+60);
	globalCounter = 60;
	intervalID = setInterval("ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-globalCounter : ccm.getScrollInfo().top+globalCounter); globalCounter-=5; if(globalCounter<2) intervalID = clearInterval(intervalID);", 10);
}

function joinLines() {
	editor = EditorManager.getFocusedEditor();
	if (!editor) return true;
	ccm = editor._codeMirror;
	doc = ccm.getDoc();

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
}

function insertLineBefore() {
	ccm.moveV(-1, "line");
	CodeMirror.commands["goLineEnd"](ccm);
	CodeMirror.commands["newlineAndIndent"](ccm);
}

function testCommand(){
	insertLineBefore();
}