lessonSlug = "stomata-opening";

lessonHeader = {
  Title: "Stomata Opening",
  Slug: lessonSlug,
  Author: "",
  Date: "",
  Revision: "",
  Subject: "",
  Description: ""
}

pageData[lessonSlug] = {};
pageLoaded[lessonSlug] = [];

for (var curPage = 0; curPage <= maxPages; curPage++) {
  pageLoaded[lessonSlug].push(false);
}

for (var curPage = 0; curPage <= maxPages; curPage++) {
  addLessonScript(lessonSlug, curPage)
}
