define(function (require, exports, module) {
return {
	
	initGlobalArgs: function(){
		editor = EditorManager.getFocusedEditor();
		if (!editor) return;
		ccm = editor._codeMirror;
		doc = ccm.getDoc();
	},
	
	CommandManager	: undefined,
	EditorManager	: undefined,
	ExtensionUtils	: undefined,
	KeyBindingManager:undefined,
	Menus			: undefined,
	TokenUtils		: undefined,

	selectExtending	: false,
	originalLine	: '',

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
	MULTICURSOR		: 0,
	NEWLINEBEFORE	: 0,		TEST		: 0,

	setColemak: function() {
		with(this) {
			LEFT			= 78;		RIGHT		= 73;
			UP				= 85;		DOWN		= 69;
			CENTER			= 75;		FOCUS		= 77;
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
			NEWLINEBEFORE	= 13;		TEST		= 49;
		}
	}

}
});