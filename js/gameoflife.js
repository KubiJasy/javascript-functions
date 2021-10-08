function seed() {
  let seedArray = [].slice.call(arguments);
  return seedArray;
}

function same([x, y], [j, k]) {
  if (x===j && y===k) {
    return true;
  }
  return false;
};

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let counter = 0;
  for (i = 0; i < this.length; i++) {
    if(same(this[i], cell)){
      counter++;
    }
    }
    return counter;
  };


const printCell = (cell, state) => {
  //uses the contain function but the game state passes which is the 'this' keyword
  //is with respect to the argument passed for the game state in the printCell func
  //Any other arguments needed for the function are passed after this
  if (contains.call(state, cell)){
    return unescape('\u25A3');
  }else {
    return unescape('\u25A2');
  }
};
const corners = (state = []) => {
  if (state.length === 0){
    return {topRight: [0,0],
    bottomLeft: [0,0]};
  }else {
    var maxXCoord = state[0][0];
    var maxYCoord = state[0][1];
    var minXCoord = state[0][0];
    var minYCoord = state[0][1];
    var minCellIdx = 0
    var maxCellIdx = 0
  }

  for (let i = 0; i < state.length; i++) {
    if (state[i][0] >= maxXCoord){
        maxXCoord = state[i][0];
        maxCellIdx = i;
    }else if (state[i][0] <= minXCoord){
      minXCoord = state[i][0];
      minCellIdx = i;
  }
    if (state[i][1] >= maxYCoord) {
        maxYCoord = state[i][1];
    }else if (state[i][1] <= minYCoord) {
        minYCoord = state[i][1];
    }
    }


  var newMinYCoord = minYCoord

  if (maxYCoord === minYCoord) {
    maxYCoord=maxYCoord;
  }else{
    
    do {
      minYCoord++;
    } while (minYCoord < maxYCoord);

    do {
      maxYCoord--;
    } while (maxYCoord > newMinYCoord);  
  }

  
  let topRight = [state[maxCellIdx][0], minYCoord];
  let bottomLeft = [state[minCellIdx][0], maxYCoord];

  return {topRight: topRight,
  bottomLeft: bottomLeft
  };
};

const printCells = (state) => {
  var cellRep = "";
  var corners1 = corners(state);
  var a = corners1.topRight[0];
  var b = corners1.bottomLeft[1];
  var cellXCoord = corners1.bottomLeft[0];
  var cellYCoord = corners1.topRight[1];
  if (state.length === 1){
    return printCell(state[0], state);
  }
  while (!(same([cellXCoord, cellYCoord], [a,b]))) {
    cellXCoord = corners1.bottomLeft[0];
  while (cellXCoord < (a+1)) {
    cellRep = cellRep.concat(printCell([cellXCoord, cellYCoord], state) + " ");
    cellXCoord++;
  }
  cellYCoord--;
  if (cellYCoord < corners1.bottomLeft[1]){
     cellXCoord--;
     cellYCoord++;
  }
  cellRep = cellRep.concat("\n");
  continue;
}
  return cellRep;
};

const getNeighborsOf = ([x, y]) => [[x-1, y-1], [x, y-1], [x+1, y-1], [x-1,y], [x+1, y], [x-1, y+1], [x, y+1], [x+1, y+1]];

const getLivingNeighbors = (cell, state) => {
  let livingNeighbours = [];
  let neighbours = getNeighborsOf(cell);
  let contain = contains.bind(state);
  for (let i = 0; i < neighbours.length; i++) {
    let livingNeighbour = contain(neighbours[i]);
    if (livingNeighbour) {
      livingNeighbours.push(neighbours[i]);
    } 
    }
    return livingNeighbours;
  };


const willBeAlive = (cell, state) => {
  if ((getLivingNeighbors(cell, state).length === 3) || (contains.call(state, cell) && (getLivingNeighbors(cell, state).length === 2))){
    return true;
  }
  return false;
};

const calculateNext = (state) => {
  let nextState = [];
  for (let i = 0; i < state.length; i++) {
    if(willBeAlive(state[i], state)){
      nextState.push(state[i]);
    }
  }
  let topRight = [(corners(state).topRight[0] + 1), (corners(state).topRight[1] + 1)];
  let bottomLeft = [(corners(state).bottomLeft[0] - 1), (corners(state).bottomLeft[1] - 1)];

  for (let i = topRight[1]; i >= bottomLeft[1]; i--) {
    for (let j = 0; j <= topRight[0]; j++) {
      if (willBeAlive([i, j], state)){
        nextState.push([i, j]);
      }
    }
  }
  return nextState;
};

const iterate = (state, iterations) => {
  let gameStates = [];
  gameStates.push(state);
  let newState = state;
  for (let i = 0; i < iterations; i++){
    newState = calculateNext(newState);
    gameStates.push(newState);
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  let gameStates = iterate(startPatterns[pattern], iterations);
  for (let i = 0; i < gameStates.length; i++) {
    let intermediary = printCells(gameStates[i]);
    console.log(intermediary + "\n");}
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;
  