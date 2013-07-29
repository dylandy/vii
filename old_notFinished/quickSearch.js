define(function (require, exports, module) {
    var CommandManager      = brackets.getModule("command/CommandManager"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        Menus               = brackets.getModule("command/Menus"),
        QUICKSEARCH         = 'quicksearch.toggle',
        _find               = require('find'),
        _enabled            = true,
        _previousQuery      = "";

    function isWordSelected(line, selectedText, selection) {
        var start = selection.start.ch, //Start is inclusive, end is exclusive.
            end = selection.end.ch;

        function isWordChar(ch) {
            return (/\w/).test(ch) || ch.toUpperCase() !== ch.toLowerCase();
        }

        // check the beginning and end of the selectedText are word chars
        if (!isWordChar(selectedText.charAt(0))
            || !isWordChar(selectedText.charAt(selectedText.length - 1))) {
            return false;
        }

        // check the surrounding chars are not word chars
        var startBoundary = (start === 0 || !isWordChar(line.charAt(start - 1)));
        var endBoundary = (end === line.length || !isWordChar(line.charAt(end)));

        return startBoundary && endBoundary;
    }

    // modified from Editor.prototype.selectWordAt
    function getWordAt(line, pos) {
        var start = pos.ch,
            end = pos.ch;

        function isWordChar(ch) {
            return (/\w/).test(ch) || ch.toUpperCase() !== ch.toLowerCase();
        }

        while (start > 0 && isWordChar(line.charAt(start - 1))) {
            --start;
        }
        while (end < line.length && isWordChar(line.charAt(end))) {
            ++end;
        }

        return line.slice(start, end);
    }

    function _handler(event, editor) {
        if (editor) {
            if (editor.hasSelection()) {
                var selectedText = editor.getSelectedText();
                if (selectedText.toLowerCase() === _previousQuery) {
                    return; // let internal search do the findNext
                } else {
                    _previousQuery = selectedText.toLowerCase();
                }

                // clear any previous searches
                _find.clear(editor);

                var selection = editor.getSelection();
                var line = editor.document.getLine(selection.start.line);

                if (isWordSelected(line, selectedText, selection)) {
                    _find.doSearch(editor, false, editor.getSelectedText());
                }
            } else {
                _previousQuery = "";
                _find.clear(editor);
            }
        }
    }

    function _handlerOff(editor) {
        _find.clear(editor);
        $(editor).off('cursorActivity', _handler);
    }

    function _handlerOn(editor) {
        $(editor).on('cursorActivity', _handler);
    }

    // Toggle the extension, set the _document and register the listener.
    function _toggle() {
        _enabled = !_enabled;
        CommandManager.get(QUICKSEARCH).setChecked(_enabled);
        var editor = EditorManager.getActiveEditor();
        // Register or remove listener depending on _enabled.
        if (_enabled) {
            _handlerOn(editor);
        } else {
            _handlerOff(editor);
        }
    }

    // Reset the listeners when the active editor change.
    $(EditorManager).on("activeEditorChange",
        function (event, current, previous) {
            if (_enabled) {
                if (previous) {
                    _handlerOff(previous);
                }
                if (current) {
                    _handlerOn(current);
                }
            }
        });

    // Register command.
    CommandManager.register("Enable Quick Search", QUICKSEARCH, _toggle);
    Menus.getMenu(Menus.AppMenuBar.VIEW_MENU).addMenuItem(QUICKSEARCH);
    CommandManager.get(QUICKSEARCH).setChecked(_enabled);
});