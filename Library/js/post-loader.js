$(document).attr("title", lessonHeader.Title);

function close_window() {
  if (confirm("Are you sure you're done with this exercise?")) {
    close();
  }
}

$(document).ready(function() {
  $("#main").prepend("<div id='js-page-container'><div id='js-pages'></div></div>")
  $("#main").prepend(`
    <div id="js-pagination">
      <div id="js-pagination-buttons">
        <button class="cs-button cs-disable" id="js-left-button"><h1>&#9658;</h1></button>
        <div id="js-pagination-boxes">
        </div>
        <button class="cs-button" id="js-right-button"><h1>&#9658;</h1></button>
      </div>
      <button onclick="close_window();return false;" class="cs-button">
        <h1>&#10683;</h1>
      </button>
    </div>
  `);

  $("#main").prepend("<h1 id='js-lesson-header'>" + lessonHeader.Title + "</h1>")

  $(window).resize();
})

$(window).resize(function() {
  var pageHeight = $(window).outerHeight(true);

  pageHeight -= $("#js-lesson-header").outerHeight(true);

  if ( $("#js-pagination").css("display") == "none" ) {
    pageHeight -= 24;
  } else {
    pageHeight -= $("#js-pagination").outerHeight(true);
  }

  $("#js-page-container").width("100%");
  $("#js-page-container").height(pageHeight);

  $("#js-pagination-boxes").height(
    $("#js-pagination-buttons").height() - 6
  );
});
