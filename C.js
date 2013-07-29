define(function (require, exports, module) {
	"use strict";
	exports.CommandManager 		= brackets.getModule("command/CommandManager");
	exports.EditorManager		= brackets.getModule("editor/EditorManager");
	exports.ExtensionUtils		= brackets.getModule("utils/ExtensionUtils");
	exports.KeyBindingManager	= brackets.getModule("command/KeyBindingManager");
	exports.Menus         		= brackets.getModule("command/Menus");
	exports.TokenUtils 			= brackets.getModule("utils/TokenUtils");
	exports.selectExtending		= false;
	exports.originalLine		= '';
	exports.Cursor				= require('cursor');
	exports.Commands			= require('commands');
	exports.Find				= require('find');
	exports.Select				= require('select');
	exports.selectExtending		= false;
	exports.originalLine		= '';
	exports.currentCursor		= undefined;
	exports.timer				= undefined;

	function editorReady () {
		exports.editor = exports.EditorManager.getFocusedEditor();
		if (!exports.editor) return false;
		exports.cm = exports.editor._codeMirror;
		exports.doc = exports.cm.getDoc();
		return true;
	} exports.editorReady = editorReady;

	function setColemak() {
		exports.LEFT			= 78;		exports.RIGHT		= 73;
		exports.UP				= 85;		exports.DOWN		= 69;
		exports.CENTER			= 67;		exports.FOCUS		= 77;
		exports.UP10			= 76;		exports.DOWN10		= 89;
		exports.HOME			= 72;		exports.END			= 79;
		exports.DOCHOME			= 74;		exports.DOCEND		= 186;
		exports.SCROLLUP		= 70;		exports.SCROLLDN	= 83;
		exports.LINEUP			= 87;		exports.LINEDOWN	= 82;
		exports.NEXTDOC			= 48;		exports.PREVDOC		= 57;
		exports.SMARTSELECT		= 84;		exports.SELECTLINE	= 80;
		exports.TOGGLESELECT	= 68;		exports.SWAPANCHOR	= 71;
		exports.BACKSPACE		= 8;		exports.DEL			= 46;
		exports.FIND			= 222;		exports.REPLACE		= 220;
		exports.FINDNEXT		= 221;		exports.FINDPREV	= 219;
		exports.MULTICURSOR		= 65;		exports.SPACE		= 32;
		exports.NEWLINEBEFORE	= 13;		exports.ENTER		= 13;
	} exports.setColemak = setColemak;

	function setQwerty() {
		exports.LEFT			= 74;		exports.RIGHT		= 76;
		exports.UP				= 73;		exports.DOWN		= 75;
		exports.CENTER			= 67;		exports.FOCUS		= 77;
		exports.UP10			= 85;		exports.DOWN10		= 79;
		exports.HOME			= 72;		exports.END			= 186;
		exports.DOCHOME			= 89;		exports.DOCEND		= 80;
		exports.SCROLLUP		= 69;		exports.SCROLLDN	= 68;
		exports.LINEUP			= 87;		exports.LINEDOWN	= 83;
		exports.NEXTDOC			= 48;		exports.PREVDOC		= 57;
		exports.SMARTSELECT		= 70;		exports.SELECTLINE	= 82;
		exports.TOGGLESELECT	= 71;		exports.SWAPANCHOR	= 84;
		exports.BACKSPACE		= 8;		exports.DEL			= 46;
		exports.FIND			= 222;		exports.REPLACE		= 220;
		exports.FINDNEXT		= 221;		exports.FINDPREV	= 219;
		exports.MULTICURSOR		= 65;		exports.SPACE		= 32;
		exports.NEWLINEBEFORE	= 13;		exports.ENTER		= 13;
	} exports.setQwerty = setQwerty;
});