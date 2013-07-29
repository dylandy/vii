define(function (require, exports, module) {
    "use strict";
    var CommandManager      = brackets.getModule("command/CommandManager"),
        Commands            = brackets.getModule("command/Commands"),
        Strings             = brackets.getModule("strings"),
        Editor              = brackets.getModule("editor/Editor"),
        EditorManager       = brackets.getModule("editor/EditorManager");

    var isFindFirst = false;

    function SearchState() {
        this.posFrom = this.posTo = this.query = null;
        this.marked = [];
    }

    function getSearchState(cm) {
        if (!cm._searchState) {
            cm._searchState = new SearchState();
        }
        return cm._searchState;
    }

    function getSearchCursor(cm, query, pos) {
        return cm.getSearchCursor(query, pos, typeof query === "string" && query === query.toLowerCase());
    }

    function parseQuery(query) {
        var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
        try {
            if (isRE && isRE[1]) {  // non-empty regexp
                return new RegExp(isRE[1], isRE[2].indexOf("i") === -1 ? "" : "i");
            } else {
                return query;
            }
        } catch (e) {
            return "";
        }
    }

    function findNext(editor, rev) {
        var cm = editor._codeMirror;
        var found = true;
        cm.operation(function () {
            var state = getSearchState(cm);
            var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
            if (!cursor.find(rev)) {
                cursor = getSearchCursor(cm, state.query, rev ? {line: cm.lineCount() - 1} : {line: 0, ch: 0});
                if (!cursor.find(rev)) {
                    cm.setCursor(cm.getCursor());  // collapses selection, keeping cursor in place to avoid scrolling
                    found = false;
                    return;
                }
            }
            var centerOptions = (isFindFirst) ? Editor.BOUNDARY_IGNORE_TOP : Editor.BOUNDARY_CHECK_NORMAL;
            editor.setSelection(cursor.from(), cursor.to(), true, centerOptions);
            state.posFrom = cursor.from();
            state.posTo = cursor.to();
            state.findNextCalled = true;
        });
        return found;
    }

    function clearHighlights(state) {
        state.marked.forEach(function (markedRange) {
            markedRange.clear();
        });
        state.marked.length = 0;
    }

    function clearSearch(cm) {
        cm.operation(function () {
            var state = getSearchState(cm);
            if (!state.query) {
                return;
            }
            state.query = null;
            clearHighlights(state);
        });
    }

    function clear(editor) {
        var cm = editor._codeMirror;
		console.log(editor);
        var state = getSearchState(cm);
        clearSearch(cm);
        $(cm.getWrapperElement()).removeClass("find-highlighting");
    }

	function doSearch(editor, rev, initialQuery) {
        var cm = editor._codeMirror;
        var state = getSearchState(cm);
        if (state.query) {
            return;
        }
        var searchStartPos = cm.getCursor(true);
        function findFirst(query) {
            isFindFirst = true;
            cm.operation(function () {
                if (state.query) {
                    clearHighlights(getSearchState(cm));
                }
                state.query = parseQuery(query);
                if (!state.query) {
                    cm.setCursor(searchStartPos);
                    return;
                }
                if (cm.getValue().length < 500000) {
                    $(cm.getWrapperElement()).addClass("find-highlighting");
                    var cursor = getSearchCursor(cm, state.query);
                    while (cursor.findNext()) {
                        state.marked.push(cm.markText(cursor.from(), cursor.to(), { className: "CodeMirror-searching" }));
                        if (cursor.pos.match && cursor.pos.match[0] === "") {
                            if (cursor.to().line + 1 === cm.lineCount()) {
                                break;
                            }
                            cursor = getSearchCursor(cm, state.query, {line: cursor.to().line + 1, ch: 0});
                        }
                    }
                }
                state.posFrom = state.posTo = searchStartPos;
            });
            isFindFirst = false;
        }
        if (initialQuery !== undefined) {
            findFirst(initialQuery);
            state.findNextCalled = false;
        }
    }
    exports.doSearch = doSearch;
    exports.clear = clear;
});