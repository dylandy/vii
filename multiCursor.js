var searchCursor, cursors, selectionCount;

function multiSelect() {
	if (!doc.somethingSelected()) smartSelect();
	searchCursor = ccm.getSearchCursor(doc.getSelection(), doc.getCursor(), true);
	while(searchCursor.findNext())
		doc.markText(searchCursor.from(), searchCursor.to(), {
			className: 'multicursorNotSelected'
		});
}