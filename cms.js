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
	
	function dummyCaret(activeP) {
		var sel = $("#t" + activeP).getSelection();
		var caretPosition = sel.end;
		if(caretPosition == "") {
			caretPosition = 0;	
		}
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
		$("#d" + activeP).css("top", caretPosition.top +"px !important");
	}
	
	function updateCanvasP(activeP) {
		// pull the contents of the active p textarea into the corresponding display p
		$("#p" + activeP).text($("#t" + activeP).val());
	}
	
	function focusOnTextarea(currentP) {
		// set hidden caret to relevant textarea/update currently active P.
		$("#t" + currentP).focus();
		activeP = currentP;	
	}
	
	function createNewTextarea(currentP) {
		// create hidden textarea and container div.  Append to row. Focus on new textarea
		$("#r" + currentP).append('<div class="hidden_input_div" id="#d' + currentP + '"><textarea id="t' + currentP + '" class="hidden_input_textarea editable_p"></textarea>');
		focusOnTextarea(currentP);
		
		// when editing hidden editable p in textarea, update the canvas P
		$(".editable_p").on("keyup", function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				currentP = createNewP(currentP);
			}

			updateCanvasP(currentP);
			dummyCaret(currentP);	
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
		
		$(".canvas_p").on("click", function() {
			focusOnTextarea(activeP);
		});
		
		return newP;
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
	$(".canvas_p").on("click", function() {
		if($("#default").length > 0) {
			//first click of content.  Default div exists. Remove, setup new row.
			$("#default").remove();
			createRow(currentP);
		} 
	});
		
});