var intervalID, globalCounter, ccm;
define(function (require, exports, module) {"use strict";
	console.log("vii is running");
    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
		spaceDown = false,
		keyDown = false,
		lastKey = "",
		inserted = false,
		moved = false,
		keyCount = 0,
		editor,
		doc,
		currentCursor,
		timer;

	var LEFT, RIGHT, UP, DOWN, HOME, END, SCROLLUP, SCROLLDN;

	function setColemak() {
		LEFT = 78;
		RIGHT = 73;
		UP = 85;
		DOWN = 69;
		HOME = 72;
		END = 79;
		SCROLLUP = 76;
		SCROLLDN = 89;
	}

	setColemak();

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
		var top = ccm.getScrollInfo().top;
//		for(var i = 0; i < 10; i++){
//			top = up ? top+100 : top-100;
//			ccm.scrollTo(null, top);
//		}

		globalCounter = 0;
		intervalID = setInterval("console.log(\"vvv\"); if(++globalCounter>10) intervalID = clearInterval(intervalID);", 1000);
	}

	function command(key) {
		switch(key){
			case LEFT:
			case RIGHT: moveCursor(key); break;
			case UP: ccm.moveV(-1, "line"); break;
			case DOWN: ccm.moveV(1, "line"); break;
			case HOME: CodeMirror.commands["goLineStartSmart"](ccm); break;
			case END: CodeMirror.commands["goLineEnd"](ccm); break;
			case SCROLLUP: scroll(true); break;
			case SCROLLDN: scroll(false); break;
		}
	}
    document.onkeydown = function (e) {
//		timer = performance.webkitNow();
		editor = EditorManager.getFocusedEditor();
		if (!editor) {
			return true;
		}
		e = e || window.event;

		if (e.keyCode === 32) { // space down
			if (spaceDown) {
//				console.error('vii: spaceDown is already true');
//				return true;
			} else {
				spaceDown = true;
			}
			return false;
		}

		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
				 (e.keyCode >= 48 && e.keyCode <= 57) ||
				 (e.keyCode >= 186 && e.keyCode <= 192) ||
				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key down
			switch(e.keyCode){
				case 187: lastKey = "="; break;
				case 189: lastKey = "-"; break;
				case 219: lastKey = "["; break;
				case 221: lastKey = "]"; break;
				case 220: lastKey = "\\"; break;
				case 186: lastKey = ";"; break;
				case 222: lastKey = "\'"; break;
				case 188: lastKey = ","; break;
				case 190: lastKey = "."; break;
				case 191: lastKey = "/"; break;
				default: lastKey = String.fromCharCode(e.keyCode).toLowerCase();
			}
			keyCount += 1;
			if (spaceDown) {
				keyDown = true;
				inserted = false;
				return false;
			} else {
				inserted = true;
//				console.log(performance.webkitNow()-timer);
				return true;
			}
		}
		return true;
	};

	document.onkeyup = function (e) {
		editor = EditorManager.getFocusedEditor();
		if (!editor) {
			return true;
		}
		e = e || window.event;
		currentCursor = editor.getCursorPos();
        ccm = editor._codeMirror;
		doc = ccm.getDoc();

		if (e.keyCode === 32) { // space up
			if (spaceDown) {
				spaceDown = false;
				if (moved) moved = false;
				else if (keyDown) {
					insert(" " + lastKey);
					inserted = true;
				} else {
					insert(" ");
					inserted = false;
				}
				return false;
			} else {
				console.error("vii: space is already up");
				return true;
			}
		}

		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
				 (e.keyCode >= 48 && e.keyCode <= 57) ||
				 (e.keyCode >= 186 && e.keyCode <= 192) ||
				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key up
			keyCount -= 1;
			if (spaceDown && keyDown && !inserted) {
				command(e.keyCode);
				moved = true;
			}
			if (keyCount < 1) keyDown = false;
			return false;
		}

		return true;
	}
		}
	  );
/* TEST AREA

enoieanr stanrostinnnnneee
www.noitamina.com
*/