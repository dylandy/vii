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
		cm,
		currentCursor;

	var LEFT, RIGHT, UP, DOWN;

	function setColemak() {
		LEFT = 78;
		RIGHT = 73;
		UP = 85;
		DOWN = 69;
	}

	setColemak();

	function insert(text) {
		doc.replaceRange(text, editor.getCursorPos());
	}

	function command(key) {
		if (key === LEFT) {
			currentCursor.ch -= 1;
            editor.setCursorPos(currentCursor);
		} else if (key === RIGHT) {
			currentCursor.ch += 1;
            editor.setCursorPos(currentCursor);
		}
	}

    document.onkeydown = function (e) {
		editor = EditorManager.getFocusedEditor();
		if (!editor) {
			return true;
		}
		e = e || window.event;

		if (e.keyCode === 32) { // space down
			if (spaceDown) {
				console.error('vii: spaceDown is already true');
				return true;
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
        doc = editor.document;
        cm = editor._codeMirror;

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