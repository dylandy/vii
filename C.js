//"use strict";
define({
	CommandManager 	: brackets.getModule("command/CommandManager"),
	EditorManager	: brackets.getModule("editor/EditorManager"),
	ExtensionUtils	: brackets.getModule("utils/ExtensionUtils"),
	KeyBindingManager : brackets.getModule("command/KeyBindingManager"),
	Menus         	: brackets.getModule("command/Menus"),
	TokenUtils : brackets.getModule("utils/TokenUtils"),
	editorReady: function(){
		this.editor = this.EditorManager.getFocusedEditor();
		if (!this.editor) return false;
		this.cm = this.editor._codeMirror;
		this.doc = this.cm.getDoc();
		return true;
	},

	selectExtending	: false,
	originalLine	: '',

	Cursor	: undefined,
	Commands: undefined,
	Select	: undefined,
	setUp	: function(cursor, commands, select) {
		this.Cursor = cursor;
		this.Commands = commands;
		this.Select = select;
	},

	editor			: undefined,
	doc				: undefined,
	currentCursor	: undefined,
	timer			: undefined,

	LEFT			: 0,		RIGHT		: 0,
	UP				: 0,		DOWN		: 0,
	CENTER			: 0,		FOCUS		: 0,
	UP10			: 0,		DOWN10		: 0,
	HOME			: 0,		END			: 0,
	DOCHOME			: 0,		DOCEND		: 0,
	SCROLLUP		: 0,		SCROLLDN	: 0,
	LINEUP			: 0,		LINEDOWN	: 0,
	NEXTDOC			: 0,		PREVDOC		: 0,
	SMARTSELECT		: 0,		SELECTLINE	: 0,
	TOGGLESELECT	: 0,		SWAPANCHOR	: 0,
	BACKSPACE		: 0,		DEL			: 0,
	FIND			: 0,		REPLACE		: 0,
	FINDNEXT		: 0,		FINDPREV	: 0,
	MULTICURSOR		: 0,		SPACE		: 32,
	NEWLINEBEFORE	: 0,		ENTER		: 13,

	setColemak: function() {
		with(this){
			LEFT			= 78;		RIGHT		= 73;
			UP				= 85;		DOWN		= 69;
			CENTER			= 67;		FOCUS		= 77;
			UP10			= 76;		DOWN10		= 89;
			HOME			= 72;		END			= 79;
			DOCHOME			= 74;		DOCEND		= 186;
			SCROLLUP		= 70;		SCROLLDN	= 83;
			LINEUP			= 87;		LINEDOWN	= 82;
			NEXTDOC			= 48;		PREVDOC		= 57;
			SMARTSELECT		= 84;		SELECTLINE	= 80;
			TOGGLESELECT	= 68;		SWAPANCHOR	= 71;
			BACKSPACE		= 8;		DEL			= 46;
			FIND			= 222;		REPLACE		= 220;
			FINDNEXT		= 221;		FINDPREV	= 219;
			MULTICURSOR		= 65;
			NEWLINEBEFORE	= 13;
		}
	}
});