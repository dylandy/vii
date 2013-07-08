define(function (require, exports, module) {"use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus");
                                            
    var spaceIsDown = false,
        spaceEventFired = false,
        keyDownCount = 0,
        needResendKey = false,
        previousKeycode;
                                            
    document.onkeydown = function(e) {
        var editor = EditorManager.getFocusedEditor();
        if(!editor) return true;
        e = e || window.event;
        ++keyDownCount;
        if (e.keyCode==32) { // space
            if (keyDownCount>1)
                doc.replaceRange(" ", editor.getCursorPos());
            else spaceIsDown = true;
            return false;
        }
        else if (spaceIsDown) {
            needResendKey = true;
            previousKeycode = e.keyCode;
        }
        return !spaceIsDown;        
    };
    document.onkeyup = function(e) {
        var editor = EditorManager.getFocusedEditor();
        if(!editor) return true;
        var currentCursor = editor.getCursorPos(),
            doc = editor.document,
            cm = editor._codeMirror;
        e = e || window.event;
        --keyDownCount;
        if (e.keyCode==32) {
            spaceIsDown = false;
            if (!spaceEventFired)
                doc.replaceRange(" ", editor.getCursorPos());
            spaceEventFired = false;
        }
        if (!spaceIsDown && needResendKey)
            doc.replaceRange(String.fromCharCode(previousKeycode), editor.getCursorPos());
        needResendKey = false;
        if (!spaceIsDown) return true;
        spaceEventFired = true;
        switch(e.keyCode){
            case 78: // left
                currentCursor.ch-=1;
                editor.setCursorPos(currentCursor);
                break;
            case 73: // right
                currentCursor.ch+=1;
                editor.setCursorPos(currentCursor);
                break;
            case 85: // up
                currentCursor.line-=1;
                editor.setCursorPos(currentCursor);
                break;
            case 69: // down
                currentCursor.line+=1;
                editor.setCursorPos(currentCursor);
                break;
//            case 187:
//                doc.replaceRange("= ", editor.getCursorPos());
//                break;
            case 49: // test  
                var cc = cm.cursorCoords();
                console.warn(cm);
                
        }
        
        return false;
    }
});