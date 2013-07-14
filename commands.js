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
function scroll(up){
	if (intervalID) intervalID = clearInterval(intervalID);
	globalUp = up;
	ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-60 : ccm.getScrollInfo().top+60);
	globalCounter = 60;
	intervalID = setInterval("ccm.scrollTo(null, globalUp ? ccm.getScrollInfo().top-globalCounter : ccm.getScrollInfo().top+globalCounter); globalCounter-=5; if(globalCounter<2) intervalID = clearInterval(intervalID);", 10);
}
function hello(){
	console.log('hello');
}