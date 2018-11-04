
$( document ).ready(function() {
   $("input").on("change", function() {
	    this.setAttribute(
	        "data-date",
	        moment(this.value, "YYYY-MM-DD")
	        .format( this.getAttribute("data-date-format") )
	    )
	}).trigger("change")
});