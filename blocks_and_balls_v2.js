  var balls = [];
  var tot_balls = 100;
  var d = 5;
  var block_col = 10;
  var block_row = 7;
  var blocks = [];
  var b_width;
  var b_padding = 0;
  var start_x = 210;
  var start_y = 500;
  var start_dx = 0;
  var start_dy = -3 ;
  var start_lead = false;
  var spread = 1;
  var start_num = 6;

function setup() {
  createCanvas(400, 670);
  b_width = ((width - (b_padding * (block_col + 1)))/block_col);
  
  //Create Balls
  for (i = 0; i < tot_balls; i++) {
    balls[i] = {
      x: start_x + (-i * start_dx * spread),
      y: start_y + (-i * start_dy * spread),
      dx: start_dx,
      dy: start_dy,
      lead: start_lead,
     }
    };
  balls[0].lead = true;


//Create Blocks
  for (i = 0; i < block_row; i++) {
    blocks[i] = []
    for (j = 0; j < block_col; j++) {
      x = b_padding + (j * (b_width + b_padding));
      y = b_padding + (i * (b_width + b_padding));
      blocks[i][j] = {
        num: start_num,
        x: x,
        y: y,
        _x: x + b_width,
        _y: y + b_width,
        exposed: {
          T: false,
          R: false,
          B: false,
          L: false        
        }
      }
      if (i == block_row - 1){
        blocks[i][j].exposed.B = true;
      }
    }
  }
}

function draw() {
  background(51);
  draw_blocks();
  move_balls();
  draw_balls();
}

function draw_blocks() {
   for (i = 0; i < blocks.length; i++) {
    for (j = 0; j < blocks[i].length; j++) {
      if (blocks[i][j].num > 0){
        fill(70);
        strokeWeight(1);
        stroke(0);
        rect(blocks[i][j].x, blocks[i][j].y, b_width, b_width);
        textAlign(CENTER, CENTER);
        textSize(24)
        if (blocks[i][j].num > 99) {textSize(18)}
        fill(200);
        text(blocks[i][j].num, blocks[i][j].x + b_width/2, blocks[i][j].y + b_width/2);
        if (blocks[i][j].exposed.T) {
          strokeWeight(1);
          stroke(255, 0, 0);
          line( blocks[i][j].x, blocks[i][j].y, blocks[i][j]._x, blocks[i][j].y)
        }
        if (blocks[i][j].exposed.R) {
          strokeWeight(1);
          stroke(255, 0, 0);
          line( blocks[i][j]._x, blocks[i][j].y, blocks[i][j]._x, blocks[i][j]._y)
        }
        if (blocks[i][j].exposed.B) {
          strokeWeight(1);
          stroke(255, 0, 0);
          line( blocks[i][j]._x, blocks[i][j]._y, blocks[i][j].x, blocks[i][j]._y)
        }
        if (blocks[i][j].exposed.L) {
          strokeWeight(1);
          stroke(255, 0, 0);
          line( blocks[i][j].x, blocks[i][j]._y, blocks[i][j].x, blocks[i][j].y)
        }
      }
    }
  }
}

function draw_balls() {
  for (i = 0; i < balls.length; i++) {
    fill(255);
    if (balls[i].lead) {fill(255,0,0)};
    strokeWeight(0);
    ellipse(balls[i].x, balls[i].y, d, d);
  }
}

function move_balls() {
  for (i = balls.length - 1; i >= 0; i--) {
    movex = balls[i].x + balls[i].dx;
    movey = balls[i].y + balls[i].dy;
    if (balls[i].lead == true) {
      balls[i] = collision_wall(i, movex, movey, balls[i].dx, balls[i].dy, balls[i].lead);
      balls[i] = collision_blocks(balls[i].x, balls[i].y, balls[i].dx, balls[i].dy, balls[i].lead);
    } else {
    balls[i].x = movex;
    balls[i].y = movey;
    }
    if ((balls[i - 1] != void 0) &&
        (balls[i - 1].y == ((balls[i].dy / balls[i].dx) * balls[i - 1].x + (balls[i].y -((balls[i].dy / balls[i].dx) * balls[i].x))))) {
        balls[i].lead = false;
    }
  }
}

function collision_wall(i, movex, movey, dx, dy, lead) {
  newball = {};
    if (movex < d/2) {
    newball = bounce(movex, movey, dx, dy, 1, d/2, lead);
  } else if (movex > width - d/2) {
    newball = bounce(movex, movey, dx, dy, 1, width - d/2, lead);
  } else if (movey < d/2) {
    newball = bounce(movex, movey, dx, dy, 0, d/2, lead);
  } else if ((movey > height - d/2) && (dy > 0)) {
    balls.splice(i,1);
    if (balls[i + 1] != void 0) {
      balls[i + 1].lead = true;
    }
  } else newball = {
      x: movex, 
      y: movey, 
      dx: dx, 
      dy: dy, 
      lead: lead
    }; 
return(newball)
}


function collision_blocks(movex, movey, dx, dy, lead){
  newball = {
  x: movex,
  y: movey,
  dx: dx,
  dy: dy,
  lead: lead  
  }
  for (k = 0; k < block_row; k++) {
    for (j = 0; j < block_col; j++) {
      if (blocks[k][j].num > 0) {
        if (blocks[k][j].exposed.B){
          if (intersects(movex, movey, movex - dx, movey - dy, blocks[k][j]._x, blocks[k][j]._y, blocks[k][j].x, blocks[k][j]._y)){
            newball = bounce(movex, movey, dx, dy, 0, blocks[k][j]._y, lead);
            blocks[k][j].num--;
          }
        } else if (blocks[k][j].exposed.R){
          if (intersects(movex, movey, movex - dx, movey - dy, blocks[k][j]._x, blocks[k][j].y, blocks[k][j]._x, blocks[k][j]._y)){
            newball = bounce(movex, movey, dx, dy, 1, blocks[k][j]._x, lead);
            blocks[k][j].num--;
          }
        } else if (blocks[k][j].exposed.L){
          if (intersects(movex, movey, movex - dx, movey - dy, blocks[k][j].x, blocks[k][j]._y, blocks[k][j].x, blocks[k][j].y)){
            newball = bounce(movex, movey, dx, dy, 1, blocks[k][j].x, lead);
            blocks[k][j].num--;
          }
        } else if (blocks[k][j].exposed.T){
          if (intersects(movex, movey, movex - dx, movey - dy, blocks[k][j].x, blocks[k][j]._y, blocks[k][j]._x, blocks[k][j]._y)){
            newball = bounce(movex, movey, dx, dy, 0, blocks[k][j].y, lead);
            blocks[k][j].num--;
          }
        }
        if (dist(balls[i].x, balls[i].y, blocks[k][j]._x, blocks[k][j]._y) < d/2 ){
        console.log("hit bottom right corner");
        } else if (dist(balls[i].x, balls[i].y, blocks[k][j].x, blocks[k][j]._y) < d/2 ){
        console.log("hit bottom left corner");
        } else if (dist(balls[i].x, balls[i].y, blocks[k][j].x, blocks[k][j].y) < d/2 ){
        console.log("hit top left corner");
        } else if (dist(balls[i].x, balls[i].y, blocks[k][j]._x, blocks[k][j].y) < d/2 ){
        console.log("hit top right corner");
        }
      }
    
    if (blocks[k][j].num == 0) {
      if ((blocks[k + 1] != void 0) && (blocks[k + 1][j].num > 0)) {
          blocks[k + 1][j].exposed.T = true;
      }
      if ((blocks[k][j - 1] != void 0) && (blocks[k][j - 1].num > 0)) {
          blocks[k][j - 1].exposed.R = true;
        } 
      if ((blocks[k - 1] != void 0) && (blocks[k - 1][j].num > 0)) {
          blocks[k - 1][j].exposed.B = true;
        }
      if ((blocks[k][j + 1] != void 0) && (blocks[k][j + 1].num > 0)) {
          blocks[k][j + 1].exposed.L = true;
        }
      
      
    }
    }
  }
  return (newball);
}

  
  
function bounce(x, y, dx, dy, orient, axis, lead) {  
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
  if (balls[i + 1] != void 0) {
    balls[i + 1].lead = true;
  }
  newball = {
    x: x,
    y: y, 
    dx: dx,
    dy: dy,
    lead: lead
  }; 
return(newball)
}


//Credit user meriton on StackOverflow
function corner_bounce(x, y, dx, dy, orient, cornerx, cornery, lead){
  var newx = x - cornerx;
  var newy = y - cornery;
  var c = -2 * (dx * newx + dy * newy)/(newx * newx + newy * newy);
  dx += c * newx;
  dy += c * newy;
  x += dx;
  y += dy;    
  newball = {
    x: x,
    y: y, 
    dx: dx,
    dy: dy,
    lead: lead
  }; 
return(newball)
      
}





//Thank you dude from StackOverflow
function intersects(a, b, c, d, p, q, r, s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda <= 1) && (0 < gamma && gamma <= 1);
  }
}
