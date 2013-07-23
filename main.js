define(function (require, exports, module) {
	"use strict";
	var spaceDown = false, keyDown = false,	inserted = false,
		moved = false, sameKey = false, shouldRepeat = false,
		repeated = false, lastKey = '', keyCount = 0,
		C 		= require('C'),
		Commands= require('commands'),
		Cursor	= require('cursor'),
		Select	= require('select');

	Commands.setC(C);
	Cursor.setC(C);
	Select.setC(C);
	C.setUp(Cursor, Commands, Select);
	C.ExtensionUtils.loadStyleSheet(module, './style.css');

	var reg = C.CommandManager.register,
		bind = C.KeyBindingManager.addBinding;
	reg("Toggle Line Comment", "vii.lineComment", Commands.toggleComment);
	reg("Duplicate Lines", "vii.duplicateLines", Commands.duplicateLines);
	reg("Join Lines", "vii.joinLines", Commands.joinLines);
	reg("Delete Lines and Go Up", "vii.deleteLines", Commands.deleteLines);
	reg("Delete To Head", "vii.deleteToHead", Commands.deleteToHead);
	reg("Delete To Tail", "vii.deleteToTail", function(){
		CodeMirror.commands["killLine"](C.cm);});
	["Cmd-J", "Shift-Cmd-D", "Ctrl-Cmd-Up","Ctrl-Cmd-Down",
	 "Ctrl-Tab", "Ctrl-L", "Ctrl-Shift-Tab","Cmd-D", "Cmd-T",
	 "Shift-Cmd-Z", 'Cmd-/'].forEach(function(i){
		C.KeyBindingManager.removeBinding(i);});
	bind('edit.deletelines','Shift-Delete');
	bind('navigate.jumptoDefinition','Cmd-T');
	bind('navigate.gotoDefinition','Cmd-2');
	bind('edit.redo','Cmd-Y');

	var menu = C.Menus.getMenu(C.Menus.AppMenuBar.EDIT_MENU);
	menu.addMenuDivider();
	menu.addMenuItem('vii.lineComment', 'Cmd-/')
	menu.addMenuItem('vii.duplicateLines', 'Cmd-D');
	menu.addMenuItem('vii.joinLines', 'Ctrl-J');
	menu.addMenuItem('vii.deleteLines', 'Shift-Backspace');
	menu.addMenuItem('vii.deleteToHead', 'Cmd-Backspace');
	menu.addMenuItem('vii.deleteToTail', 'Cmd-Delete');
	['edit.lineUp', 'edit.lineDown', 'edit.selectLine',
	 'edit.duplicate'].forEach(function(i){
		menu.removeMenuItem(i);});

	function isKeycodeInRange(keyCode) {
		if((keyCode >= 65 && keyCode <= 90) ||
		   (keyCode >= 48 && keyCode <= 57) ||
		   (keyCode >= 186 && keyCode <= 192) ||
		   (keyCode >= 219 && keyCode <= 222))
			return true;
		return false;
	}

	function command(key) {
		function cmd(s) {
			CodeMirror.commands[s](C.cm);
		}
		function exe(s) {
			C.CommandManager.execute(s);
		}
		switch(key){
			case C.LEFT:
			case C.RIGHT:		Cursor.move(key);			break;
			case C.UP:			C.cm.moveV(-1, "line"); 	break;
			case C.DOWN:		C.cm.moveV(1, "line");		break;
			case C.HOME:		cmd("goLineStartSmart");	break;
			case C.END:			cmd("goLineEnd");			break;
			case C.SCROLLUP:	Commands.scroll(true);		break;
			case C.SCROLLDN:	Commands.scroll(false); 	break;
			case C.DOCHOME:		cmd("goDocStart");			break;
			case C.DOCEND:		cmd("goDocEnd");			break;
			case C.UP10:		Cursor.move10(true);		break;
			case C.DOWN10:		Cursor.move10(false); 		break;
			case C.CENTER:		Commands.centerCursor();	break;
			case C.FOCUS:		Cursor.focusAtCenter(); 	break;
			case C.LINEUP:		exe('edit.lineUp');			break;
			case C.LINEDOWN:	exe('edit.lineDown');		break;
			case C.SMARTSELECT: Select.smartSelect();		break;
			case C.SELECTLINE: 	Select.line();				break;
			case C.TOGGLESELECT:Select.selectToggle();		break;
			case C.SWAPANCHOR: 	Select.swapAnchor();		break;
			case C.NEXTDOC:		exe('navigate.nextDoc');	break;
			case C.PREVDOC:		exe('navigate.prevDoc');	break;
			case C.FIND:		exe('edit.find'); 			break;
			case C.FINDNEXT:	exe('edit.findNext'); 		break;
			case C.FINDPREV:	exe('edit.findPrevious'); 	break;
			case C.REPLACE: 	exe('edit.replace');		break;
			case C.MULTICURSOR: 							break;
		}
	}

	C.KeyBindingManager.addGlobalKeydownHook(function (e) {
		if (spaceDown) {
			switch(e.keyCode) {
				case C.BACKSPACE: Commands.deleteWord(C.LEFT); break;
				case C.DEL: Commands.deleteWord(C.RIGHT); break;
				case C.ENTER: Commands.insertLineBefore(); break;//Todo: c.enter
				default: return false;
			}
			moved = true;
			return true;
		}
		return false;
	});

    document.onkeydown = function (e) {
		if(!C.editorReady()) return true;
		e = e || window.event;

		if (e.keyCode === C.SPACE) { // space down
			spaceDown = true;
			C.originalLine = C.doc.getLine(C.doc.getCursor().line);
			return false;
		}

		else if (isKeycodeInRange(e.keyCode)) { // key down
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
		if (!C.editorReady()) return true;
		e = e || window.event;
		C.currentCursor = C.editor.getCursorPos();


		if (e.keyCode != C.SPACE && isKeycodeInRange(e.keyCode))
			keyCount -= 1;

		if (e.keyCode === C.SPACE) { // space up
			if (spaceDown) {
				spaceDown = false;
				shouldRepeat = false;
				repeated = false;
				C.selectExtending = false;
				C.doc.setExtending(false);
				if (moved) moved = false;
				else if (keyDown) {
					if (C.doc.somethingSelected())
						C.doc.replaceSelection(" " + lastKey);
					else Commands.insert(" " + lastKey);
					inserted = true;
				} else {
					if (C.doc.somethingSelected())
						C.doc.replaceSelection(" ");
					else Commands.insert(" ");
					inserted = false;
				}
				return false;
			} else {
				console.error("vii: space is already up");
				return true;
			}
			return true;
		}

		else if (isKeycodeInRange(e.keyCode)) { // key up
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

	C.setColemak();
	console.log("vii is running");
});