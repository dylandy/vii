define({
	C: undefined,
	prevQuery: '',
	setC: function(c, cursor) {
		C = c;
	},

	isWordSelected: function() {
		function isWordChar(ch) {
			return (/\w/).test(ch) ||
				ch.toUpperCase() !== ch.toLowerCase();
		}
		if (!C.doc.somethingSelected) return false;
		var start = C.doc.getCursor('start'),
			end = C.doc.getCursor('end');
		if (start.line != end.line) return false;

		var text = C.doc.getSelection(),
			line = C.doc.getLine(end.line);
		if (text.length > 32) return false;
		if (!isWordChar(text.charAt(0)) ||
		    !isWordChar(text.charAt(text.length-1)))
			return false;
		var leftBound = start.ch === 0 ||
				!isWordChar(line.charAt(start.ch-1)),
			rightBound = end.ch === line.length ||
				!isWordChar(line.charAt(end.ch));
		return leftBound && rightBound;
	},

	handler: function(event, editor) {
		if (!editor) return;
		if (!editor.hasSelection()) {
			this.prevQuery = '';
			C.Find.clear(editor);
			return;
		}
		if (!this.isWordSelected()) return;
		var text = editor.getSelectedText();
		if (text === this.prevQuery) return;
		else this.prevQuery = text;
		C.Find.clear(editor);
		C.Find.doSearch(editor, false, text);
	}
});