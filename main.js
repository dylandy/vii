var intervalID, globalCounter, ccm, globalUp;
var spaceDown = false,
	keyDown = false,
	lastKey = "",
	inserted = false,
	moved = false,
	sameKey = false,
	shouldRepeat = false,
	repeated = false,
	selectExtending = false,
	keyCount = 0,
	originalLine = '',
	editor,	doc, currentCursor,	timer;
var LEFT, RIGHT, UP, DOWN, HOME, END, SCROLLUP, SCROLLDN,
	DOCHOME, DOCEND, DOWN10, UP10, CENTER, FOCUS, TEST,
	LINEUP, LINEDOWN, NEWLINEBEFORE, NEXTDOC, PREVDOC,
	BACKSPACE, DEL, SMARTSELECT, SELECTLINE, TOGGLESELECT,
	SWAPANCHOR, FIND, REPLACE, FINDNEXT, FINDPREV
	;
var CM,	EditorManager,	Menus, KeyBindingManager, TokenUtils,
	Enhancements;

define(function (require, exports, module) {
	"use strict";
	require([require.toUrl('./commands.js')]);
	Enhancements = require([require.toUrl('./enhancement.js')]);
	console.log("vii is running");
	CM = brackets.getModule("command/CommandManager");
	EditorManager  = brackets.getModule("editor/EditorManager");
	Menus          = brackets.getModule("command/Menus");
	KeyBindingManager = brackets.getModule("command/KeyBindingManager");
	TokenUtils = brackets.getModule("utils/TokenUtils");

	function setColemak() {
		LEFT = 78;
		RIGHT = 73;
		UP = 85;
		DOWN = 69;
		HOME = 72;
		END = 79;
		SCROLLUP = 70;
		SCROLLDN = 83;
		DOCHOME = 74;
		DOCEND = 186;
		UP10 = 76;
		DOWN10 = 89;
		CENTER = 75;
		FOCUS = 77;
		TEST = 49;
		LINEUP = 87;
		LINEDOWN = 82;
		NEWLINEBEFORE = 13;
		BACKSPACE = 8;
		DEL = 46;
		SMARTSELECT = 84;
		SELECTLINE = 80;
		TOGGLESELECT = 68;
		SWAPANCHOR = 71;
		FIND = 222;
		REPLACE = 220;
		FINDPREV = 219;
		FINDNEXT = 221;
		NEXTDOC = 48;
		PREVDOC = 57;
	}
	setColemak();

	function j() { joinLines(); }
	function dl() { deleteLines(); }
	function delToTail() { CodeMirror.commands["killLine"](ccm); }
	function delToHead() { deleteToHead(); }
	function dup() { duplicateLines(); }

	CM.register("Duplicate Lines", "vii.duplicateLines", dup);
	CM.register("Join Lines", "vii.joinLines", j);
	CM.register("Delete Lines and Go Up", "vii.deleteLines", dl);
	CM.register("Delete To Head", "vii.deleteToHead", delToHead);
	CM.register("Delete To Tail", "vii.deleteToTail", delToTail);
	var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
	KeyBindingManager.removeBinding("Cmd-J");
	KeyBindingManager.removeBinding("Shift-Cmd-D");
	KeyBindingManager.removeBinding("Ctrl-Cmd-Up");
	KeyBindingManager.removeBinding("Ctrl-Cmd-Down");
	KeyBindingManager.removeBinding("Ctrl-Tab");
	KeyBindingManager.removeBinding("Ctrl-L");
	KeyBindingManager.removeBinding("Ctrl-Shift-Tab");
	KeyBindingManager.removeBinding("Cmd-D");
	KeyBindingManager.removeBinding("Cmd-T");
	KeyBindingManager.addBinding('edit.deletelines','Shift-Delete');
	KeyBindingManager.addBinding('navigate.jumptoDefinition','Cmd-T');
	KeyBindingManager.addBinding('navigate.gotoDefinition','Cmd-2');
  	menu.addMenuDivider();
	menu.addMenuItem('vii.duplicateLines', 'Cmd-D');
  	menu.addMenuItem("vii.joinLines", "Ctrl-J");
  	menu.addMenuItem("vii.deleteLines", "Shift-Backspace");
  	menu.addMenuItem("vii.deleteToHead", "Cmd-Backspace");
  	menu.addMenuItem("vii.deleteToTail", "Cmd-Delete");

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
			case DOCHOME: CodeMirror.commands["goDocStart"](ccm); break;
			case DOCEND: CodeMirror.commands["goDocEnd"](ccm); break;
			case UP10: moveCursor10(true); break;
			case DOWN10: moveCursor10(false); break;
			case CENTER: centerCursor(); break;
			case FOCUS: focusAtCenter(); break;
			case TEST: testCommand(); break;
			case LINEUP: CM.execute('edit.lineUp'); break;
			case LINEDOWN: CM.execute('edit.lineDown'); break
			case SMARTSELECT: smartSelect(); break;
			case SELECTLINE: CM.execute('edit.selectLine'); break;
			case TOGGLESELECT: selectToggle(); break;
			case SWAPANCHOR: swapAnchor(); break;
			case NEXTDOC: CM.execute('navigate.nextDoc'); break;
			case PREVDOC: CM.execute('navigate.prevDoc'); break;
			case FIND: CM.execute('edit.find'); break;
			case FINDNEXT: CM.execute('edit.findNext'); break;
			case FINDPREV: CM.execute('edit.findPrevious'); break;
			case REPLACE: CM.execute('edit.replace'); break;
		}
	}

	KeyBindingManager.addGlobalKeydownHook(function (e) {
		if (spaceDown) {
			if (e.keyCode === BACKSPACE) {
				moved = true;
				deleteWord(LEFT);
				return true;
			} else if (e.keyCode === DEL) {
				moved = true;
				deleteWord(RIGHT);
				return true;
			} else if (e.keyCode === 13) {
				moved = true;
				insertLineBefore();
				return true;
			}
		}
		return false;
	});

    document.onkeydown = function (e) {
		editor = EditorManager.getFocusedEditor();
		if (!editor) return true;
		ccm = editor._codeMirror;
		doc = ccm.getDoc();
		e = e || window.event;

		if (e.keyCode === 32) { // space down
			spaceDown = true;
			originalLine = doc.getLine(doc.getCursor().line);
			return false;
		}

		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
				 (e.keyCode >= 48 && e.keyCode <= 57) ||
				 (e.keyCode >= 186 && e.keyCode <= 192) ||
				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key down
			var k;
			switch(e.keyCode){
				case 187: k = "="; break;
				case 189: k = "-"; break;
				case 219: k = "["; break;
				case 221: k = "]"; break;
				case 220: k = "\\"; break;
				case 186: k = ";"; break;
				case 222: k = "\'"; break;
				case 188: k = ","; break;
				case 190: k = "."; break;
				case 191: k = "/"; break;
				default: k = String.fromCharCode(e.keyCode).toLowerCase();
			}
			if (k != lastKey) {
				keyCount += 1;
				lastKey = k;
			} else shouldRepeat = true;

			if (spaceDown) {
				keyDown = true;
				inserted = false;
				if (moved) shouldRepeat = true;
				if (shouldRepeat) {
					repeated = true;
					command(e.keyCode);
				}
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
        ccm = editor._codeMirror;
		doc = ccm.getDoc();

		if (e.keyCode != 32 &&
			((e.keyCode >= 65 && e.keyCode <= 90) ||
				 (e.keyCode >= 48 && e.keyCode <= 57) ||
				 (e.keyCode >= 186 && e.keyCode <= 192) ||
				 (e.keyCode >= 219 && e.keyCode <= 222)))
			keyCount -= 1;

		if (e.keyCode === 32) { // space up
			if (spaceDown) {
				spaceDown = false;
				shouldRepeat = false;
				repeated = false;
				selectExtending = false;
				doc.setExtending(false);
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
			return true;
		}

		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
				 (e.keyCode >= 48 && e.keyCode <= 57) ||
				 (e.keyCode >= 186 && e.keyCode <= 192) ||
				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key up
			if (spaceDown && keyDown && !inserted) {
				 if (!repeated) command(e.keyCode);
				moved = true;
			}
			if (keyCount < 1) {
				keyDown = false;
				lastKey = '';
				keyCount = 0; // prevent problem with hot key
			}
			return false;
		}
		return true;
	}
});