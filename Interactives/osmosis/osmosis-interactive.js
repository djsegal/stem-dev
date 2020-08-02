var leftGridLabel = "Outside";
var rightGridLabel = "Inside";

var concentrationLabel = "Concentration";
var solventName = "Water";

var rowCount = 10;
var colCount = 12;

var cellWidth = 8;
var cellMargin = 6;

var initSoluteLeft = {
  "Substance 1": 3,
  "Substance 2": 3,
  "Substance 3": 1,
};

var initSoluteRight = {
  "Substance 1": 3,
  "Substance 2": 1,
  "Substance 3": 5
};

var leftKeys = JSON.stringify(Object.keys(initSoluteLeft));
var rightKeys = JSON.stringify(Object.keys(initSoluteRight));

if ( leftKeys !== rightKeys ) {
  alert("Solute dictionaries should have the same keys!")
}

var substanceNames = [solventName].concat(Object.keys(initSoluteLeft));

if ( Object.keys(initSoluteRight).length > 3 ) {
  alert("Too many solutes (current max is 3)!")
}

var leftColor = "#FAF8CF";
var rightColor = "#DCDCDC";

var solventColor = "#73C6EE";
var soluteColors = [
  "#EB2730", "#0CA94D", "#A74497"
];

var gridHTML = "";

for (var i = 0; i < rowCount; i++) {
  gridHTML += "<div class='js-row-" + i + "'>"
  for (var j = 0; j < colCount; j++) {
    gridHTML += "<div class='cs-col js-col-" + j + "' style='"

    var curRoll = parseInt((Math.random() * (4) + 1).toFixed(0));
    if ( curRoll == 1 ) {
      gridHTML += "margin: " + (cellWidth+cellMargin) + "px " + (cellWidth+cellMargin) + "px " + (cellWidth-cellMargin) + "px " + (cellWidth-cellMargin) + "px; ";
    } else if (curRoll == 2) {
      gridHTML += "margin: " + (cellWidth-cellMargin) + "px " + (cellWidth+cellMargin) + "px " + (cellWidth+cellMargin) + "px " + (cellWidth-cellMargin) + "px; ";
    } else if (curRoll == 3) {
      gridHTML += "margin: " + (cellWidth+cellMargin) + "px " + (cellWidth-cellMargin) + "px " + (cellWidth-cellMargin) + "px " + (cellWidth+cellMargin) + "px; ";
    } else if (curRoll == 4) {
      gridHTML += "margin: " + (cellWidth-cellMargin) + "px " + (cellWidth-cellMargin) + "px " + (cellWidth+cellMargin) + "px " + (cellWidth+cellMargin) + "px; ";
    } else if (curRoll == 5) {
      gridHTML += "margin: " + cellWidth +"px; ";
    } else {
      alert("Invalid roll" + curRoll);
    }

    gridHTML += "background-color: " + solventColor + "'></div>"
  }
  gridHTML += "</div>"
}

var concentrationHTML = "";

for (var i = 0; i < substanceNames.length; i++) {
  concentrationHTML += "<div class='cs-item'><div class='cs-item__left'>"
  if ( i == 0 ) {
    concentrationHTML += "<div class='cs-col' style='background-color: " + solventColor + "'></div>"
  } else {
    concentrationHTML += "<div class='cs-col' style='background-color: " + soluteColors[i-1] + "'></div>"
  }
  concentrationHTML += "</div><div class='cs-item__right'>" + substanceNames[i] + "<br>";

  if ( i == 0 ) {
    concentrationHTML += "<input min='0' max='" + ( rowCount * colCount ) + "' type='number' class='js-concentration__solvent' disabled></input>"
  } else {
    concentrationHTML += "<input min='0' max='" + ( rowCount * colCount ) + "' type='number' class='js-concentration__" + substanceNames[i].replace(/\s+/g, '-') + "'></input>"
  }

  concentrationHTML += "&nbsp; mol/L</div>";

  concentrationHTML += "</div>"
}

$(window).resize(function() {
  var gridWidth = $(".cs-grid-outer").width();
  gridWidth -= ( $(".cs-grid").outerWidth() - $(".cs-grid").width() );

  var cellSize = ( gridWidth ) / colCount - cellWidth*2;

  $(".cs-col").width(cellSize);
  $(".cs-col").height(cellSize);
})

let rgb2hex= c=> '#'+c.match(/\d+/g).map(x=>(+x).toString(16).padStart(2,0)).join``

function addDot(curGrid, curColor) {
  var didAdd = false;
  while (!didAdd) {
    curRow = Math.floor(Math.random() * rowCount);
    curCol = Math.floor(Math.random() * colCount);
    if ( rgb2hex($(curGrid + " .js-row-" + curRow + " .js-col-" + curCol).css("background-color")) == solventColor.toLowerCase() ) {
      $(curGrid + " .js-row-" + curRow + " .js-col-" + curCol).css("background-color", curColor);
      didAdd = true;
    }
  }
}

function resetGrids() {
  for (var i = 0; i < substanceNames.length; i++) {
    if ( i == 0 ) { continue; }

    for (var j = 0; j < initSoluteLeft[substanceNames[i]]; j++) {
      addDot("#js-left-grid", soluteColors[i-1])
    }

    for (var j = 0; j < initSoluteRight[substanceNames[i]]; j++) {
      addDot("#js-right-grid", soluteColors[i-1])
    }
  }

  $("#js-left-concentrations .js-concentration__solvent").val(rowCount*colCount - Object.values(initSoluteLeft).reduce((a, b) => a + b, 0))
  $("#js-right-concentrations .js-concentration__solvent").val(rowCount*colCount - Object.values(initSoluteRight).reduce((a, b) => a + b, 0))
}

var isPlaying = false;

function jiggleCell(curCell, isTop, isLeft) {
  if (Math.random() < 1/3) {
    curCell.css('margin', cellWidth);
  } else {
    if (Math.random() < 0.5) {
      if ( isTop ) {
        curCell.css('margin-top', cellWidth+cellMargin)
        curCell.css('margin-bottom', cellWidth-cellMargin)
      } else {
        curCell.css('margin-top', cellWidth-cellMargin)
        curCell.css('margin-bottom', cellWidth+cellMargin)
      }
    } else {
      if ( isLeft ) {
        curCell.css('margin-left', cellWidth+cellMargin)
        curCell.css('margin-right', cellWidth-cellMargin)
      } else {
        curCell.css('margin-left', cellWidth-cellMargin)
        curCell.css('margin-right', cellWidth+cellMargin)
      }
    }
  }
}

function nudgeCell(curCell, k) {
  var yOffset = cellMargin*[-1, +1][0+(Math.random() < 0.5)];

  if ( rgb2hex(curCell.css("background-color")) == solventColor.toLowerCase() ) {
    var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.5)];
  } else {
    if ( !isAgainstGradient(curCell, k) ) {
      if ( k == 0 ) {
        var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.8)];
      } else {
        var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.2)];
      }
    } else if ( k == 0 && ( curCell.hasClass("js-col-" + (colCount-1)) || curCell.hasClass("js-col-" + (colCount-2)) ) ) {
      var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.2)];
    } else if ( k == 1 && ( curCell.hasClass("js-col-0") || curCell.hasClass("js-col-1") ) ) {
      var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.8)];
    } else {
      var xOffset = cellMargin*[-1, +1][0+(Math.random() < 0.5)];
    }
  }

  curCell.css('margin-left', cellWidth+xOffset)
  curCell.css('margin-right', cellWidth-xOffset)
  curCell.css('margin-top', cellWidth+yOffset)
  curCell.css('margin-bottom', cellWidth-yOffset)
}

function isTop(tmpCell) {
  return parseInt(tmpCell.css("margin-top")) < cellWidth;
}

function isLeft(tmpCell) {
  return parseInt(tmpCell.css("margin-left")) < cellWidth;
}

function isAvailable(tmpCell) {
  if ( typeof tmpCell[0] === "undefined" ) { return false; }
  return tmpCell.css("margin") !== cellWidth + "px";
}

function isAgainstGradient(curCell, k) {
  var curBool = false;

  var thisColor = curCell.css('background-color');

  var leftColor = $("#js-left-grid .cs-col").filter(function(){
    return $(this).css('background-color') == thisColor;
  }).length;

  var rightColor = $("#js-right-grid .cs-col").filter(function(){
    return $(this).css('background-color') == thisColor;
  }).length;

  if ( k == 0 ) {
    curBool = leftColor <= rightColor;
  } else {
    curBool = rightColor <= leftColor;
  }

  return curBool;
}

function shuffleList(curList) {
  let shuffle = [...curList];
  const getRandomValue = (i, N) => Math.floor(Math.random() * (N - i) + i);
  shuffle.forEach( (elem, i, arr, j = getRandomValue(i, arr.length)) => [arr[i], arr[j]] = [arr[j], arr[i]] );
  return shuffle
}

function getOthers(otherGrid, i, j) {
  var otherList = []

  for (var h = i-1; h <= i+1; h++) {
    var otherCell = $(otherGrid + " .js-row-" + h + " .js-col-" + j);
    if ( typeof otherCell[0] === "undefined" ) { continue; }
    if ( !( rgb2hex(otherCell.css("background-color")) == solventColor.toLowerCase() ) ) { continue; }
    otherList.push([otherCell,[h,j]])
  }

  return shuffleList(otherList)[0];
}

function getNeighbors(curGrid, i, j, thisTop, thisLeft) {
  otherCells = [];

  if ( thisTop ) {
    if ( thisLeft ) {
      h = i-1; k = j-1;
      oppCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(oppCell) && !isTop(oppCell) && !isLeft(oppCell) ) { otherCells.push([oppCell,[h,k]]); }

      h = i-1; k = j;
      verCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(verCell) && !isTop(verCell) && isLeft(verCell) ) { otherCells.push([verCell,[h,k]]); }

      h = i; k = j-1;
      horCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(horCell) && isTop(horCell) && !isLeft(horCell) ) { otherCells.push([horCell,[h,k]]); }
    } else {
      h = i-1; k = j+1;
      oppCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(oppCell) && !isTop(oppCell) && isLeft(oppCell) ) { otherCells.push([oppCell,[h,k]]); }

      h = i-1; k = j;
      verCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(verCell) && !isTop(verCell) && !isLeft(verCell) ) { otherCells.push([verCell,[h,k]]); }

      h = i; k = j+1;
      horCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(horCell) && isTop(horCell) && isLeft(horCell) ) { otherCells.push([horCell,[h,k]]); }
    }
  } else {
    if ( thisLeft ) {
      h = i+1; k = j-1;
      oppCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(oppCell) && isTop(oppCell) && !isLeft(oppCell) ) { otherCells.push([oppCell,[h,k]]); }

      h = i+1; k = j;
      verCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(verCell) && isTop(verCell) && isLeft(verCell) ) { otherCells.push([verCell,[h,k]]); }

      h = i; k = j-1;
      horCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(horCell) && !isTop(horCell) && !isLeft(horCell) ) { otherCells.push([horCell,[h,k]]); }
    } else {
      h = i+1; k = j+1;
      oppCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(oppCell) && isTop(oppCell) && isLeft(oppCell) ) { otherCells.push([oppCell,[h,k]]); }

      h = i+1; k = j;
      verCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(verCell) && isTop(verCell) && !isLeft(verCell) ) { otherCells.push([verCell,[h,k]]); }

      h = i; k = j+1;
      horCell = $(curGrid + " .js-row-" + h + " .js-col-" + k);
      if ( isAvailable(horCell) && !isTop(horCell) && isLeft(horCell) ) { otherCells.push([horCell,[h,k]]); }
    }
  }

  return shuffleList(otherCells);
}

$(document).on("click", "#js-play", function() {
  if ( $("#js-play").text() == "Play" ) {
    $("#js-play").text("Restart");

    if ( isPlaying ) { return }
    isPlaying = true;

    var clockId = setInterval(curClock, 125);
    function curClock() {
      if ( $("#js-play").text() == "Play" ) {
        clearInterval(clockId);
        isPlaying = false;
      } else {
        movedList = [];

        for (var k = 0; k < 2; k++) {
          if ( k == 0 ) {
            var curGrid = "#js-left-grid";
          } else {
            var curGrid = "#js-right-grid";
          }

          for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < colCount; j++) {
              var isAlreadyMoved = false;

              for (var m = 0; m < movedList.length; m++) {
                if ( i != movedList[m][0] ) { continue; }
                if ( j != movedList[m][1] ) { continue; }
                if ( k != movedList[m][2] ) { continue; }

                isAlreadyMoved = true;
                break
              }

              if (isAlreadyMoved) { continue; }

              var curCell = $(curGrid + " .js-row-" + i + " .js-col-" + j);

              if ( !( rgb2hex(curCell.css("background-color")) == solventColor.toLowerCase() ) ) {
                var otherParticle = undefined;

                if ( k == 0 && j == ( colCount - 1 ) ) {
                  otherParticle = getOthers("#js-right-grid", i, 0);
                } else if ( k == 1 && j == 0 ) {
                  otherParticle = getOthers("#js-left-grid", i, ( colCount - 1 ));
                }

                if ( typeof otherParticle !== "undefined" ) {
                  var thisColor = curCell.css('background-color');

                  if ( !isAgainstGradient(curCell, k) ) {
                    var otherColor = otherParticle[0].css('background-color');

                    curCell.css('background-color', otherColor);
                    otherParticle[0].css('background-color', thisColor);

                    movedList.push([i,j,k]);

                    if ( k == 0 ) {
                      movedList.push([...otherParticle[1],1]);
                    } else {
                      movedList.push([...otherParticle[1],0]);
                    }

                    continue;
                  }
                }
              }

              if ( curCell.css("margin") == cellWidth + "px" ) {
                nudgeCell(curCell, k);
              } else {
                var thisTop = isTop(curCell);
                var thisLeft = isLeft(curCell);

                if ( rgb2hex(curCell.css("background-color")) == solventColor.toLowerCase() ) {
                  jiggleCell(curCell, isTop, isLeft);
                } else {
                  otherCells = getNeighbors(curGrid, i, j, thisTop, thisLeft);

                  if ( otherCells.length == 0 ) {
                    jiggleCell(curCell, isTop, isLeft);
                  } else {
                    didMove = false;
                    for (var h = 0; h < otherCells.length; h++) {
                      if (Math.random() > 0.3) { continue; }

                      didMove = true;

                      var thisColor = curCell.css('background-color');
                      var otherColor = otherCells[h][0].css('background-color');

                      curCell.css('background-color', otherColor);
                      otherCells[h][0].css('background-color', thisColor);

                      movedList.push([i,j,k]);
                      movedList.push([...otherCells[h][1],k]);

                      break;
                    }
                    if (!didMove) { jiggleCell(curCell, isTop, isLeft); }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
    if ( $("#js-play").text() != "Restart" ) { alert("Invalid play text: " + $("#js-play").text())}
    $("#js-play").text("Play");

    $(".cs-grid .cs-col").css("background-color", solventColor);
    resetGrids();
  }

})

$(document).on("change", ".js-concentrations input", function(curEvent) {
  var parentContainer = $(curEvent.target).parentsUntil(".js-concentrations-container")[$(curEvent.target).parentsUntil(".js-concentrations-container").length-1];
  var concentrationName = curEvent.target.classList[0].replace("js-concentration__", "").replace("-", " ");
  var newValue = parseInt(curEvent.target.value);

  if ( parentContainer.id == "js-left-concentrations" ) {
    initSoluteLeft[concentrationName] = newValue;

    if ( Object.values(initSoluteLeft).reduce((a, b) => a + b, 0) > ( rowCount * colCount ) ) {
      curEvent.target.value -= ( Object.values(initSoluteLeft).reduce((a, b) => a + b, 0) - ( rowCount * colCount ) )
      $(curEvent.target).change();
      return
    }
  } else if ( parentContainer.id == "js-right-concentrations" ) {
    initSoluteRight[concentrationName] = newValue;

    if ( Object.values(initSoluteRight).reduce((a, b) => a + b, 0) > ( rowCount * colCount ) ) {
      curEvent.target.value -= ( Object.values(initSoluteRight).reduce((a, b) => a + b, 0) - ( rowCount * colCount ) )
      $(curEvent.target).change();
      return
    }
  } else {
    alert("Invalid concentrations id")
  }

  $(".cs-grid .cs-col").css("background-color", solventColor);
  resetGrids();
});

$(document).ready(function() {
  $(".js-grid-labels").append(`
    <h2>` + leftGridLabel + `</h2>
    <h2>` + rightGridLabel + `</h2>
  `);

  $(".js-concentrations-labels").append(`
    <h1>` + concentrationLabel + `</h1>
    <h1>` + concentrationLabel + `</h1>
  `);

  $("#js-left-grid").css('background-color', leftColor);
  $("#js-left-concentrations").css('background-color', leftColor);

  $("#js-right-grid").css('background-color', rightColor);
  $("#js-right-concentrations").css('background-color', rightColor);

  $(".cs-grid").append(gridHTML);
  $(".js-concentrations").append(concentrationHTML)

  for (var i = 0; i < substanceNames.length; i++) {
    if ( i == 0 ) { continue; }
    $("#js-left-concentrations .js-concentration__" + substanceNames[i].replace(/\s/g, '-')).val(initSoluteLeft[substanceNames[i]])
    $("#js-right-concentrations .js-concentration__" + substanceNames[i].replace(/\s/g, '-')).val(initSoluteRight[substanceNames[i]])
  }

  resetGrids();
  $(window).resize();
})
