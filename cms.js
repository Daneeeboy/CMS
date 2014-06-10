// JavaScript Document

$(document).ready(function() {
	
	var currentP = 0;
	var activeP;
		
	function setCaret(el) {
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el.childNodes[0], 0);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		el.focus();
	}
	
	function highlight() {
            var range = getFirstRange();
            if (range) {
                var el = document.createElement("span");
                el.style.backgroundColor = "pink";
                try {
                    range.surroundContents(el);
                } catch(ex) {
                    if ((ex instanceof rangy.RangeException || Object.prototype.toString.call(ex) == "[object RangeException]") && ex.code == 1) {
                        console.log("Unable to surround range because range partially selects a non-text node. See DOM Level 2 Range spec for more information.\n\n" + ex);
                    } else {
                        console.log("Unexpected errror: " + ex);
                    }
                }
            }
        }
		
	function getFirstRange() {
       var sel = rangy.getSelection();
       return sel.rangeCount ? sel.getRangeAt(0) : null;
    }
	
	function findOffset(node, initialOffset) {
		  var offset = initialOffset;
		  var walker = node.ownerDocument.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		  while(walker.nextNode()) {
			var text  = walker.currentNode.nodeValue;
			if (text.length > offset) {
			  return { node: walker.currentNode.parentNode, offset: offset };
			}
			offset -= text.length;
		  }
		  return { node: node, offset: initialOffset };
		}
	
	function getSelectionOffset(element) {
		var start = 0, end = 0;
		var sel, range, priorRange;
		if (typeof window.getSelection != "undefined") {
			range = window.getSelection().getRangeAt(0);
			priorRange = range.cloneRange();
			priorRange.selectNodeContents(element);
			priorRange.setEnd(range.startContainer, range.startOffset);
			start = priorRange.toString().length;
			end = start + range.toString().length;
		} else if (typeof document.selection != "undefined" &&
				(sel = document.selection).type != "Control") {
			range = sel.createRange();
			priorRange = document.body.createTextRange();
			priorRange.moveToElementText(element);
			priorRange.setEndPoint("EndToStart", range);
			start = priorRange.text.length;
			end = start + range.text.length;
		}
		return {
			start: start,
			end: end
		};
	}
	
	function getSelectedNode() {
		var node,selection;
		if (window.getSelection) {
		  selection = getSelection();
		  node = selection.anchorNode;
		}
		if (!node && document.selection) {
			selection = document.selection
			var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
			node = range.commonAncestorContainer ? range.commonAncestorContainer :
				   range.parentElement ? range.parentElement() : range.item(0);
		}
		if (node) {
		  return (node.nodeName == "#text" ? node.parentNode : node);
		}
	};
	
	function dummyCaret() {
		var sel = $("#t" + activeP).getSelection();
		var caretPosition = sel.end;
		if(caretPosition == "") {
			caretPosition = 0;	
		}
		
		var contentLength = $("#p" + activeP).text().length;
		if(caretPosition > contentLength) {
			caretPosition = contentLength;	
		}
		
		// create the caret span and insert into p.
		var range = rangy.createRange();
		var canvasP = document.getElementById("p" + activeP);
		range.setStart(canvasP.childNodes[0], caretPosition);
		range.setEnd(canvasP.childNodes[0], caretPosition);
		var caretContainer = document.createElement("span");
		caretContainer.setAttribute("id", "caret");
		var caretContent = document.createTextNode("");
		caretContainer.appendChild(caretContent);
		$(caretContainer).addClass("caret");
		range.insertNode(caretContainer);
		
		// get x y position of caret, move hidden textarea to match.
		var caretPosition = $("#caret").position();
		var caretParent = $("#caret").closest("p").attr("id");
		activeP = caretParent.substr(1);
		$("#d" + activeP).css("top", caretPosition.top);
	}
	
	function updateCanvasP(activeP) {
		// pull the contents of the active p textarea into the corresponding display p
		$("#p" + activeP).text($("#t" + activeP).val());
		$("#p" + activeP).append("&nbsp;");
	}
	
	function focusOnTextarea(currentP) {
		// set hidden caret to relevant textarea/update currently active P.
		$("#t" + currentP).focus();
		activeP = currentP;
	}
	
	function modifyTextarea(e) {
		var selectedP = getSelectedNode();
		selectedP = $(selectedP).attr("id");
		activeP = selectedP.substr(1);
		
		if(e.keyCode == 13) {
			e.preventDefault();
			currentP = addParagraph(activeP);
		}
			
		updateCanvasP(activeP);
		dummyCaret(activeP);		
	}
	
	function createNewTextarea(currentP) {
		// create hidden textarea and container div.  Append to row. Focus on new textarea
		$("#r" + currentP).append('<div class="hidden_input_div" id="d' + currentP + '"><textarea id="t' + currentP + '" class="hidden_input_textarea editable_p"></textarea>');
		focusOnTextarea(currentP);
		
		// when editing hidden editable p in textarea, update the canvas P
		$(".editable_p").on("keyup", function(e) {
			modifyTextarea(e);
		});
		
		// when leaving the focus of the textarea, destroy any dummy carets
		$(".editable_p").on("focusout", function(e) {
			$(".caret").remove();
		});
	}
	
	function createNewP(currentP) {
		// create a new paragraph (insert into db/create display div/create textarea)
		var newP = currentP+1; // DUMMY CODE - this will be the insertion into the db that will return the correct ID.
		$("#editable_canvas").append('<div class="canvas_row" id="r' + newP +'"><p id="p' + newP + '" class="canvas_p">&nbsp;</p></div>'); // DUMMY CODE - should be new function.  Append after current P. 
		createNewTextarea(newP); // create textarea and hidden container div
		
		$("#p" + newP).on("mouseup", function(e) {
			e.stopPropagation();
			console.log("got this far, fred");
			activeE = getSelectedNode();
			var sel = getSelectionOffset(activeE);
			activeP = $(activeE).closest("p").attr("id");
			activeP = activeP.substr(1);
			if(sel.start != sel.end) {
				highlight();	
			}
			$("#t" + activeP).setSelection(sel.start, sel.end);
			dummyCaret(activeP);
			console.log(activeP + "," + sel.start + "," + sel.end);
			//focusOnTextarea(activeP);
		});

		return newP;
	}
	
	function addParagraph() {
		var sel = $("#t" + activeP).getSelection();
		var caretPosition = sel.end;
		if(caretPosition == "") {
			caretPosition = 0;	
		}
		
		var contentLength = $("#r" + activeP).text().length;
		if(caretPosition > contentLength) {
			caretPosition = contentLength;	
		}
		
		// create the caret span and insert into p.
		var range = rangy.createRange();
		var canvasP = document.getElementById("p" + activeP);
		var poffset = findOffset(canvasP, caretPosition);
		range.setStart(poffset.node, poffset.offset);
		range.setEnd(poffset.node, poffset.offset);
		
		console.log(poffset);
		
		var caretContainer = document.createElement("br");
		var caretContent = document.createTextNode("");
		caretContainer.appendChild(caretContent);
		range.insertNode(caretContainer);
	}
	
	function createRow(currentP) {
		// insert new row into canvas. 
		
		if(currentP == "" || currentP == "0") { // dummy code.
			currentP = 	1;
		}
		
		var newP = createNewP(currentP);
		return newP;
	}
	
	// on click of canvas paragraph
	$(".canvas_p").one("click", function() {
		if($("#default").length > 0) {
			//first click of content.  Default div exists. Remove, setup new row.
			$("#default").remove();
			createRow(currentP);
		}
	});
		
});