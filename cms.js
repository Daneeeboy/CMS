// JavaScript Document

$(document).ready(function() {
		
	function setCaret(el) {
		var range = document.createRange();
		var sel = window.getSelection();
		range.setStart(el.childNodes[0], 0);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		el.focus();
	}
	
	function updateContents() {
		$(".editable-textarea").on("keyup", function() {
			var sel = $("#t1").getSelection();
			$("#editable").append(sel.end);
			$("#contents").html($(this).val());
		});
	}
	
	function createTextarea() {
		createDisplayDiv();
		$("#t1").focus();
		updateContents();
	}
	
	function createDisplayDiv() {
		$("#editable").append('<div id="contents" class="contents"></div>');
	}
	
	$("#editable").click(function() {
		$("#default").hide();
		createTextarea();
	});
		
});