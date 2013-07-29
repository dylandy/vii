# Vii: Full Keyboard Editing Support for Brackets
An extension for [Brackets](https://github.com/adobe/brackets/) to enable full feature keyboard editing commands with a keyboard scheme much easier to learn than Vi.

### Important Notes
This plug-in is under pre-alpha stage, it may or may not function as expected. Since I am busy working on other project, developement would be suspended until November. 

### How to Install
1. Select **Brackets > File > Extension Manager...**
2. Click on **Install from URL...**
3. Paste **https://github.com/dylandy/vii** into Extension URL field.
4. Click on the **Install** button.

### How to Use
1. The hotkey scheme is designed to let you move the cursor and select words without moving your hand off the keyboard.
2. To achieve this, the editor is in **Command Mode** whenever you press and hold the space bar; otherwise it is in **Editing Mode**. Putting the mode switch on space bar might seem somehow strange, but it is quite resonable because the space bar is the key which is easiest to reach.

When you are pressing and holding the space bar, the following commands are available (remembering by the position of the keys is recommended):

| Key | Function | Explanation |
| :------------: | ------------- | ------------ |
| J | Left | Move cursor left by a word or token. <br>This enables you to move much faster than the arrow key. |
| L | Right | Move cursor right by a word or token
| I | Up | Move cursor up by one line.
| K | Down | Move cursor down by one line.
| H | Home | Move to the head of the current line. <br>Press again to move to the head ignoring the indentation.
| ; | End | Move to the end of the current line.
| U | Up by 5 Lines | Same as pressing 'I' five times.
| O | Down by 5 Lines | Same as pressing 'K' five times.
| Y | Document Home | Move cursor to the first character of the current document.
| P | Document End | Move cursor to the last character of the current document.
| M | Focus | Move cursor to the center of the visible region.
| E | Scroll Up | Scroll up with the cursor position not changed.
| D | Scroll Down | Scroll down with the cursor position not changed.
| C | Center | Scroll to make the cursor appear at the center of the visible rigion.
| W | Swap Line Up | 
| S | Swap Line Down | 
| F | Smart Select | Press to select a word.<br>Press again to expand selection to brackets.
| R | Select a Line | Press to select a line.<br>Press again to select the next line.
| G | Toggle Selection Mode | When selection mode is on, IJKL keys work as if you are pressing the Shift key and tapping on the arrow keys.<br>Note 1: When you release the white space, the selection mode will be automatically turned off.<br>Note 2: It is a toggle, you don't need to hold this key.
| T | Exchange the Head and the Anchor | When you're in selection mode, press this key to control selection on the other end.|
| 9 | Previous Doc | Go to the previous document you edit.
| 0 | Next Doc | Go to the next document you edit.
| ' | Find | Same as Cmd-F
| \ | Replace | Same as Alt-Cmd-F
| ] | Find Next| Same as Cmd-G
| [ | Find Previous | Same as Cmd-Shift-G

**Tips for remembering:** Use your left hand to control scrolling; use you right hand to move the cursor. Use your left pointing finger to select.

Here are some other very useful hotkeys:

| Key | Explanation |
| :------------: | ------------- |
| Space-Backspace | Delete the word on the left of the cursor. |
| Space-Delete | Delete the word on the right of the cursor. |
| Cmd-Backspace | Delete to the head of the current line. |
| Cmd-Delect| Delete to the tail of the current line. |
| Shift-Backspace | Delete current line and move cursor to the previous line. |
| Shift-Delete | Delete current line and move cursor to the next line. |
| Space-Enter | Insert new line before current line. |
| Cmd-D | Duplicate the current line or the selected lines. |
| Cmd-J | Join lines. Same as Cmd-J in Sublime Text. |


### License
GNU GENERAL PUBLIC LICENSE Version 3 -- see `LICENSE` for details.

### Compatibility
Tested on Brackets Sprint 26 , OS X 10.8.4.
