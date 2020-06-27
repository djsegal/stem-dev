$(document).attr("title", lessonHeader.Title);
$(document).ready(function() {
  $("#main").prepend(`
    <h1 id="js-pagination">
      <button id="js-left-button">&larr;</button>
      <progress id="js-progress" value="0" max="100">0%</progress>
      <button id="js-right-button">&rarr;</button>
    </h1>
  `);

  $("#main").prepend("<div id='js-page-container'><div id='js-pages'></div></div>")
  $("#main").prepend("<h1 id='js-lesson-header'>" + lessonHeader.Title + "</h1>")

  $(window).resize();
})

$(window).resize(function() {
  var pageHeight = $(window).outerHeight(true);

  pageHeight -= $("#js-lesson-header").outerHeight(true);
  pageHeight -= $("#js-pagination").outerHeight(true);

  $("#js-page-container").width("100%");
  $("#js-page-container").height(pageHeight);
});
