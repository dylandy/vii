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
function initGlobalArgs(){
	editor = EditorManager.getFocusedEditor();
	if (!editor) return;
	ccm = editor._codeMirror;
	doc = ccm.getDoc();
}

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
		var spaceCount = countSpacesAtEnd(token.string);
		if (spaceCount > 0 && cursor.ch === token.end && token.string.trim().length === 0) {
			doc.setCursor(CodeMirror.Pos(cursor.line, cursor.ch-spaceCount));
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
	} else if (direction === RIGHT) {
		var x = doc.getLine(cursor.line);
		if (cursor.ch === 0 && x.substring(0,1) === '\t') {
			var tabCount = countTabsAtHead(x);
			doc.setCursor(CodeMirror.Pos(cursor.line, tabCount));
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
	doc.setCursor(pos);
}

function moveCursor10(up) {
	for(var i = 0; i < 5; i++)
		ccm.moveV(up ? -1 : 1, "line");
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
	initGlobalArgs;
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
}

function insertLineBefore() {
	ccm.moveV(-1, "line");
	CodeMirror.commands["goLineEnd"](ccm);
	CodeMirror.commands["newlineAndIndent"](ccm);
}

function testCommand(){
	insertLineBefore();
}

function deleteWord(direction){
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
}

function deleteLines() {
	initGlobalArgs();
	if (!editor) return;
	CommandManager.execute('edit.deletelines');
	ccm.moveV(-1, "line");
	CodeMirror.commands["goLineEnd"](ccm);
	doc.setCursor(doc.getCursor());
}

function deleteToHead() {
	initGlobalArgs();
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
}

function extendSelection() {

}

function smartSelect() {
	if (doc.somethingSelected()) return extendSelection();
	var cursor = doc.getCursor(),
		token = ccm.getTokenAt(cursor, true);
	cursor.ch += 1;
	var rightToken = ccm.getTokenAt(cursor, true);
	cursor.ch -= 1;

	if (token.string.trim() === '' ||
	   (token.end - token.start === 1 && rightToken.end - rightToken.start >1)) {
		moveCursor(RIGHT);
		var right = doc.getCursor();
		doc.setSelection(cursor, right);
	} else {
		moveCursor(LEFT);
		var left = doc.getCursor();
		moveCursor(RIGHT);
		var right = doc.getCursor();
		if (right.ch > cursor.ch)
			doc.setSelection(left, right);
		else doc.setSelection(left, cursor);
	}
}