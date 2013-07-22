var intervalID, globalCounter, globalUp, timer;

define(function (require, exports, module) {
	"use strict";
	var test = require('test');
	test.print();
	console.log(test);
	for(var i=0; i<10000; i++) i++;
	test.someVar = {xx:10, yy:20};
	test.foo=10;
	console.log(test);
	test.print();
//	var spaceDown, keyDown, inserted, moved, sameKey, shouldRepeat, repeated,
//		lastKey = '', keyCount = 0;
//	var C, Cursor, Commands, Enhancements, Selection;
//	Selection = require('selection');
//	Commands  = require('commands');
//	Cursor	  = require('cursor');
//	C 		  = require('C');
//	Commands.setC(C);
//	console.log(C);
//	C.CommandManager = brackets.getModule("command/CommandManager");
//	C.EditorManager  = brackets.getModule("editor/EditorManager");
//	C.ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
//	C.KeyBindingManager = brackets.getModule("command/KeyBindingManager");
//	C.Menus          = brackets.getModule("command/Menus");
//	C.TokenUtils = brackets.getModule("utils/TokenUtils");
//	C.ExtensionUtils.loadStyleSheet(module, './style.css');
//
//	C.setColemak();
//
//	function delToTail() { CodeMirror.commands["killLine"](C.cm); }
//	var reg = C.CommandManager.register,
//		bind = C.KeyBindingManager.addBinding;
//	reg("Duplicate Lines", "vii.duplicateLines", Commands.duplicateLines);
//	reg("Join Lines", "vii.joinLines", Commands.joinLines);
//	reg("Delete Lines and Go Up", "vii.deleteLines", Commands.deleteLines);
//	reg("Delete To Head", "vii.deleteToHead", Commands.deleteToHead);
//	reg("Delete To Tail", "vii.deleteToTail", delToTail);
//	["Cmd-J", "Shift-Cmd-D", "Ctrl-Cmd-Up","Ctrl-Cmd-Down",
//	 "Ctrl-Tab", "Ctrl-L", "Ctrl-Shift-Tab","Cmd-D", "Cmd-T",
//	 "Shift-Cmd-Z"].forEach(function(i){
//		C.KeyBindingManager.removeBinding(i);});
//	bind('edit.deletelines','Shift-Delete');
//	bind('navigate.jumptoDefinition','Cmd-T');
//	bind('navigate.gotoDefinition','Cmd-2');
//	bind('edit.redo','Cmd-Y');
//
//	var menu = C.Menus.getMenu(C.Menus.AppMenuBar.EDIT_MENU);
//	menu.addMenuDivider();
//	menu.addMenuItem('vii.duplicateLines', 'Cmd-D');
//	menu.addMenuItem("vii.joinLines", "Ctrl-J");
//	menu.addMenuItem("vii.deleteLines", "Shift-Backspace");
//	menu.addMenuItem("vii.deleteToHead", "Cmd-Backspace");
//	menu.addMenuItem("vii.deleteToTail", "Cmd-Delete");
//
//	function command(key) {
//		switch(key){
//			case C.LEFT:
//			case C.RIGHT: Cursor.moveCursor(key); break;
//			case C.UP: C.cm.moveV(-1, "line"); break;
//			case C.DOWN: C.cm.moveV(1, "line"); break;
//			case C.HOME: CodeMirror.commands["goLineStartSmart"](C.cm); break;
//			case C.END: CodeMirror.commands["goLineEnd"](C.cm); break;
//			case C.SCROLLUP: Commands.scroll(true); break;
//			case C.SCROLLDN: Commands.scroll(false); break;
//			case C.DOCHOME: CodeMirror.commands["goDocStart"](C.cm); break;
//			case C.DOCEND: CodeMirror.commands["goDocEnd"](C.cm); break;
//			case C.UP10: Cursor.moveCursor10(true); break;
//			case C.DOWN10: Cursor.moveCursor10(false); break;
//			case C.CENTER: Commands.centerCursor(); break;
//			case C.FOCUS: Cursor.focusAtCenter(); break;
//			case C.LINEUP: CommandManager.execute('edit.lineUp'); break;
//			case C.LINEDOWN: CommandManager.execute('edit.lineDown'); break
//			case C.SMARTSELECT: Selection.smartSelect(); break;
//			case C.SELECTLINE: CommandManager.execute('edit.selectLine'); break;
//			case C.TOGGLESELECT: Selection.selectToggle(); break;
//			case C.SWAPANCHOR: Selection.swapAnchor(); break;
//			case C.NEXTDOC: CommandManager.execute('navigate.nextDoc'); break;
//			case C.PREVDOC: CommandManager.execute('navigate.prevDoc'); break;
//			case C.FIND: CommandManager.execute('edit.find'); break;
//			case C.FINDNEXT: CommandManager.execute('edit.findNext'); break;
//			case C.FINDPREV: CommandManager.execute('edit.findPrevious'); break;
//			case C.REPLACE: CommandManager.execute('edit.replace'); break;
//			case C.MULTICURSOR: multiSelect(); break;
//		}
//	}
//
//	C.KeyBindingManager.addGlobalKeydownHook(function (e) {
//		if (spaceDown) {
//			if (e.keyCode === C.BACKSPACE) {
//				moved = true;
//				deleteWord(C.LEFT);
//				return true;
//			} else if (e.keyCode === C.DEL) {
//				moved = true;
//				deleteWord(C.RIGHT);
//				return true;
//			} else if (e.keyCode === 13) {
//				moved = true;
//				insertLineBefore();
//				return true;
//			}
//		}
//		return false;
//	});
//
//    document.onkeydown = function (e) {
//		if(!C.editorReady()) return true;
//		e = e || window.event;
//
//		if (e.keyCode === 32) { // space down
//			spaceDown = true;
//			originalLine = C.doc.getLine(C.doc.getCursor().line);
//			return false;
//		}
//
//		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
//				 (e.keyCode >= 48 && e.keyCode <= 57) ||
//				 (e.keyCode >= 186 && e.keyCode <= 192) ||
//				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key down
//			var k;
//
//			switch(e.keyCode){
//				case 187: k = "="; break;
//				case 189: k = "-"; break;
//				case 219: k = "["; break;
//				case 221: k = "]"; break;
//				case 220: k = "\\"; break;
//				case 186: k = ";"; break;
//				case 222: k = "\'"; break;
//				case 188: k = ","; break;
//				case 190: k = "."; break;
//				case 191: k = "/"; break;
//				default: k = String.fromCharCode(e.keyCode).toLowerCase();
//			}
//			if (k != lastKey) {
//				keyCount += 1;
//				lastKey = k;
//			} else shouldRepeat = true;
//
//			if (spaceDown) {
//				keyDown = true;
//				inserted = false;
//				if (moved) shouldRepeat = true;
//				if (shouldRepeat) {
//					repeated = true;
//					command(e.keyCode);
//				}
//				return false;
//			} else {
//				inserted = true;
//				return true;
//			}
//		}
//		return true;
//	};
//
//	document.onkeyup = function (e) {
//		if (!C.editorReady()) return true;
//		e = e || window.event;
//		currentCursor = C.editor.getCursorPos();
//
//
//		if (e.keyCode != 32 &&
//			((e.keyCode >= 65 && e.keyCode <= 90) ||
//				 (e.keyCode >= 48 && e.keyCode <= 57) ||
//				 (e.keyCode >= 186 && e.keyCode <= 192) ||
//				 (e.keyCode >= 219 && e.keyCode <= 222)))
//			keyCount -= 1;
//
//		if (e.keyCode === 32) { // space up
//			if (spaceDown) {
//				spaceDown = false;
//				shouldRepeat = false;
//				repeated = false;
//				selectExtending = false;
//				C.doc.setExtending(false);
//				if (moved) moved = false;
//				else if (keyDown) {
//					Commands.insert(" " + lastKey);
//					inserted = true;
//				} else {
//					Commands.insert(" ");
//					inserted = false;
//				}
//				return false;
//			} else {
//				console.error("vii: space is already up");
//				return true;
//			}
//			return true;
//		}
//
//		else if ((e.keyCode >= 65 && e.keyCode <= 90) ||
//				 (e.keyCode >= 48 && e.keyCode <= 57) ||
//				 (e.keyCode >= 186 && e.keyCode <= 192) ||
//				 (e.keyCode >= 219 && e.keyCode <= 222)) { // key up
//			if (spaceDown && keyDown && !inserted) {
//				 if (!repeated) command(e.keyCode);
//				moved = true;
//			}
//			if (keyCount < 1) {
//				keyDown = false;
//				lastKey = '';
//				keyCount = 0; // prevent problem with hot key
//			}
//			return false;
//		}
//		return true;
//	}
//
//	console.log("vii is running");
});