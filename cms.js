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
		$("#p" + activeP).append(caretPosition);
	}
	
	function updateCanvasP(activeP) {
		// pull the contents of the active p textarea into the corresponding display p
		$("#p" + activeP).html($("#t" + activeP).val());
	}
	
	function focusOnTextarea(currentP) {
		// set hidden caret to relevant textarea/update currently active P.
		$("#t" + currentP).focus();
		activeP = currentP;	
	}
	
	function createNewTextarea(currentP) {
		// create hidden textarea and container div.  Append to row. Focus on new textarea
		$("#r" + currentP).append('<div class="hidden_input_div"><textarea id="t' + currentP + '" class="hidden_input_textarea editable_p"></textarea>');
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