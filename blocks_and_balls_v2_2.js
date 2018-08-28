  var balls = [];
  var tot_balls = 100;
  var d = 5;
  var block_col = 10;
  var block_row = 7;
  var blocks = [];
  var b_width;
  var b_padding = 0;
  var start_x = 200;
  var start_y = 270;
  var start_dx = 2;
  var start_dy = -1 ;
  var start_lead = false;
  var spread = 2.5;
  var start_num = 6;
  var ccpass;
  var newball = {};

function setup() {
  createCanvas(400, 670);
  b_width = ((width - (b_padding * (block_col + 1)))/block_col);
  
  //Create Balls
  for (i = 0; i < tot_balls; i++) {
    balls[i] = {
      x: width/2 + (-i * start_dx * spread),
      y: height + (-i * start_dy * spread),
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
    ccpass = 0;
    if (balls[i].lead){
    newball = collision(balls[i].x + balls[i].dx, balls[i].y + balls[i].dy, balls[i].dx, balls[i].dy, balls[i].lead);
    } else {
      newball = {
      x: balls[i].x + balls[i].dx,
      y: balls[i].y + balls[i].dy,
      dx: balls[i].dx,
      dy: balls[i].dy,
      lead: balls[i].lead      
      }
    }
    balls[i] = newball;    
    if (balls[i].y > height - d/2 && balls.dy > 0) {
      balls.splice(i, 1);
      if (balls[i + 1] != void 0) {
        balls[i + 1].lead = true;
      }
    }
    if ((balls[i - 1] != void 0) &&
        (balls[i - 1].y == ((balls[i].dy / balls[i].dx) * balls[i - 1].x + (balls[i].y -((balls[i].dy / balls[i].dx) * balls[i].x))))) {
        balls[i].lead = false;
    }
  }
}

function collision(x, y, dx, dy, lead) {
  newball = {
    x: x,
    y: y,
    dx: dx,
    dy: dy,
    lead: lead  
  }
  newball = collision_wall(newball.x, newball.y, newball.dx, newball.dy, newball.lead);
  if (ccpass < 2) {
    newball = collision_blocks(newball.x, newball.y, newball.dx, newball.dy, newball.lead)
  }
  if (ccpass = 2) {
  return (newball)
  }
}

function collision_wall( x, y, dx, dy, lead) {
  if (x < d/2) {
    newball = bounce( x, y, dx, dy, lead, 1, d/2);
    ccpass = 0;
  } else if (x > width - d/2) {
    newball = bounce(x, y, dx, dy, lead, 1, width - d/2);
    ccpass = 0;
  } else if (y < d/2) {
    newball = bounce(x, y, dx, dy, lead, 0, d/2);
    ccpass = 0;
  } else { 
    ccpass++;
  }
  return(newball)
}


function collision_blocks(x, y, dx, dy, lead) {
  ccpassx = newball.x;
  ccpassy = newball.y;
  for (k = 0; k < block_row; k++) {
    for (j = 0; j < block_col; j++) {
      if (blocks[k][j].num > 0) {
        if (blocks[k][j].x <= x + d/2 && x - d/2 <= blocks[k][j]._x && blocks[k][j].y <= y + d/2 && y - d/2 <= blocks [k][j]._y) {
          ccpass = 0;
          if (intersects( x, y + d/2, x - dx, y - dy + d/2, blocks[k][j].x, blocks[k][j].y, blocks[k][j]._x, blocks[k][j].y)) {
            newball = bounce( x, y, dx, dy, lead, 0, blocks[k][j].y - d/2);
            blocks[k][j].num--;
          } else if (intersects( x - d/2, y, x - dx - d/2, y - dy, blocks[k][j]._x, blocks[k][j].y, blocks[k][j]._x, blocks[k][j]._y)) {
            newball = bounce( x, y, dx, dy, lead, 1, blocks[k][j]._x + d/2);
            blocks[k][j].num--;
          } else if (intersects( x, y - d/2, x - dx, y - dy - d/2, blocks[k][j]._x, blocks[k][j]._y, blocks[k][j].x, blocks[k][j]._y)) {
            newball = bounce( x, y, dx, dy, lead, 0, blocks[k][j]._y + d/2);
            blocks[k][j].num--;
          } else if (intersects( x + d/2, y, x - dx + d/2, y - dy, blocks[k][j].x, blocks[k][j]._y, blocks[k][j].x, blocks[k][j].y)) {
            newball = bounce( x, y, dx, dy, lead, 1, blocks[k][j].x - d/2);
            blocks[k][j].num--;
          } else {
          console.log("YOU FUCKED UP!!!");
          }
        }
      }
    }
  }
  if (ccpassx == newball.x && ccpassy == newball.y) {
    ccpass++;
  } else {
    newball = collision(newball.x, newball.y, newball.dx, newball.dy, newball.lead)
  }
  if (ccpass < 2) {
    newball = collision(newball.x, newball.y, newball.dx, newball.dy, newball.lead)
  }
  return (newball);
}

  
  
function bounce(x, y, dx, dy, lead, orient, axis) {  
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
