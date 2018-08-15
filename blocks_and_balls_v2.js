var balls = []
  var tot_balls = 100
  var d = 5
  var block_col = 7
  var block_row = 3
  var blocks = []
  var b_width = 0
  var b_padding = 3
  var frame = 0

  function setup() {
  createCanvas(400, 670);
  b_width = floor((width - (b_padding*block_col) - b_padding)/block_col);
  //Create Balls
  for (i = 0; i < tot_balls; i++) {
    balls[i] = {
    x: 
    width/2 + (i * d * 2), 
    y: 
    height + (i * d * 2), 
    dx: 
    -3, 
    dy: 
    -3, 
      //lead: false
  };
}
//balls[0].lead = true;
//Create Blocks
//for (i = 0; i < block_row; i++) {
//  blocks[i] = []
//  for (j = 0; j < block_col; j++) {
//    blocks[i][j] = {
//    num: 100,
//    x: j * (b_width + b_padding) + b_padding,
//    y: i * (b_width + b_padding) + b_padding,
//    TLx: j * (b_width + b_padding) + b_padding,
//    TLy: i * (b_width + b_padding) + b_padding,
//    TRx: j * (b_width + b_padding) + b_padding + b_width,
//    TRy: i * (b_width + b_padding) + b_padding,
//    BRx: j * (b_width + b_padding) + b_padding + b_width,
//    BRy: i * (b_width + b_padding) + b_padding + b_width,
//    BLx: j * (b_width + b_padding) + b_padding,
//    BLy: i * (b_width + b_padding) + b_padding + b_width,

//    }
//  }  
//}
}

function draw() {
  background(51);
  frame++; 
  // draw_blocks();
  move_balls();
  draw_balls();
}

function draw_blocks() {
  for (i = 0; i < blocks.length; i++) {
    for (j = 0; j < blocks[i].length; j++) {
      fill(70);
      strokeWeight(2);
      rect(blocks[i][j].x, blocks[i][j].y, b_width, b_width);
      textAlign(CENTER, CENTER);
      fill(0);
      text(blocks[i][j].num, blocks[i][j].x + b_width/2, blocks[i][j].y + b_width/2);
    }
  }
}

function draw_balls() {
  for (i = 0; i < balls.length; i++) {
    fill(255);
    strokeWeight(1);
    ellipse(balls[i].x, balls[i].y, d, d);
  }
}

function move_balls() {
  for (i = balls.length - 1; i >= 0; i--) {
    movex = balls[i].x + balls[i].dx;
    movey = balls[i].y + balls[i].dy;
    //if (balls[i].lead) {
    balls[i] = collision_wall(movex, movey, balls[i].dx, balls[i].dy);
    //    balls[i] = collision_blocks(movex, movey, balls[i].dx, balls[i].dy);
  }
  //} else {
  //  balls[i].x = movex;
  //  balls[i].y = movey;
  //}
}

function bounce(x, y, dx, dy, orient, axis) {  
  if (orient == 1) {
    if (x > axis) {
      x = axis - (x - axis);
    } else if (x < axis) {
      x = axis + (axis - x);
    }
    dx *= -1
  } else if (orient == 0) {
    if (y > axis) {
      y = axis - (y - axis);
    } else if (y < axis) {
      y = axis + (axis - y);
    }
    dy *= -1
  }
  newball = {
  x: 
  x, 
  y: 
  y, 
  dx: 
  dx, 
  dy: 
  dy, 
    //lead: true,
}
return(newball)
  }


function collision_wall(movex, movey, dx, dy) {
  newball = {} 
    if (movex < d/2) {
    console.log("Bounce off Left");
    newball = bounce(movex, movey, dx, dy, 1, d/2);
    //if (balls[i + 1] !== void 0){ 
    //  balls[i + 1].lead = true
    //};
  } else if (movex > width - d/2) {
    console.log("Bounce off Right");
    newball = bounce(movex, movey, dx, dy, 1, width - d/2);
    //if (balls[i + 1] !== void 0){ 
    //  balls[i + 1].lead = true
    //};
  } else if (movey < d/2) {
    console.log("Bounce off Top");
    newball = bounce(movex, movey, dx, dy, 0, d/2);
    //if (balls[i + 1] !== void 0){ 
    //  balls[i + 1].lead = true
    //};
  } else if ((movey > height - 400) && (dy > 0)) {
    console.log("Break through Bottom");
    newball = {};
    //if (balls[i + 1] !== void 0){ 
    //  balls[i + 1].lead = true
    //};
  } else newball = {
  x: 
  movex, 
  y: 
  movey, 
  dx: 
  dx, 
  dy: 
  dy, 
    //lead: true,
}
//if (balls[i - 1] !== void 0) {
//  if (newball.dx == balls[i - 1].dx && newball.dy == balls[i - 1].dy){
//     newball.lead = false;
//  }
//}
return(newball)
  }

function intersects(a, b, c, d, p, q, r, s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

//function collision_blocks(movex, movey, dx, dy){
//  newball = {}
//  for (i = 0; i < blocks.length; i++) {
//    console.log("i = ", i);
//    for (j = 0; j < blocks[i].length; j++) {
//      console.log("j = ", j);
//      b = blocks[i][j];
//      console.log(b)
//      if (b.x < movex && movex < b.TRx && b.y < movey && movey < b.BRy) {
//      console.log("HIT!");
//      }

//      if (intersects(b.TRx, b.TRy, b.TLx, b.TLy, movex, movey, movex - dx, movey - dy)) {
//        newball = bounce(movex, movey, dx, dy, 0, b.y);
//      } else if (intersects(b.BLx, b.BLy, b.BRx, b.BRy, movex, movey, movex - dx, movey - dy)) {
//        newball = bounce(movex, movey, dx, dy, 0, b.BRy);
//      } else if (intersects(b.TRx, b.TRy, b.BRx, b.BRy, movex, movey, movex - dx, movey - dy)) {
//        newball = bounce(movex, movey, dx, dy, 1, b.BRx);
//      } else if (intersects(b.TLx, b.TLy, b.BLx, b.BLy, movex, movey, movex - dx, movey - dy)) {
//        newball = bounce(movex, movey, dx, dy, 1, b.x);
//      } else {
//        newball = {
//          x: movex, 
//          y: movey, 
//          dx: dx, 
//          dy: dy,
//        }
//      }
//    }
//  }
//  return(newball)
//}
