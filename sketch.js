function draw() {}

// for documentation
//
//  ⣀⣤⣤⡖⠛⣭⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒⠒⠒⠦⢄⡀⠀
// ⠙⣇⠀⠀⣷⡀⠛⠃⢀⡇⠙⢦⠀⠀⠀⢀⡿⠟⠉⢿⠀⠿⠃⢀⡇⠈⣱⣦
// ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀
// ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀
//
class Eye {
  constructor(eyeSide) {
    let side = eyeSide === "right" ? -1 : 1;
    // calculate dimensions for each eye
    //
    //       ┌─────────────────────────── eyelidPeak
    //       │
    //       ▼          ├──────────┤◄──── palpebralFissureX
    // ⢀⣀⣤⣤⡖⠛⣭⡉⠓⣦⡀⠀├───┤⠀⠀⣠⢴⠒⠒⠒⠦⢄⡀⠀⠀┬
    // ⠙⣇⠀⠀⣷⡀⠛⠃⢀⡇⠙⢦ ⠀▲⠀⢀⡿⠟⠉⢿⠀⠿⠃⢀⡇⠈⣱⣦│◄─── palpebralFissureY
    // ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀│⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀│
    // ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀⠀⠀⠀│⠀⠀⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀┴
    //               └─────────────────── innerCanthalDistance

    // Generate dimensions of eye based off of canvas size.
    // eye size
    const eyeWidth = width * 0.37;
    const eyeHeightMax = eyeWidth * 0.486;
    const eyeHeightMin = eyeWidth * 0.183;
    const yOffset = eyeHeightMax / 2;

    // horizontal positioning
    const innerCanthalDistance = width / 16;
    const centerOffset = side * (innerCanthalDistance / 2);
    const eyelidPeakX = side * (eyeWidth * 0.48 + innerCanthalDistance / 2);
    const outerCornerX = side * eyeWidth;

    // vertical positioning
    const eyeBaseline = 0; // centered
    // outer corner is higher than inner
    const outerCornerY = eyeBaseline - eyeHeightMax * 0.05;

    // eye opening displacement, relative to baseline
    const upperEyelidMax = -eyeHeightMax * 0.59;
    const upperEyelidMin = -eyeHeightMax * 0.17;
    const lowerEyelidMax = eyeHeightMax * 0.42;
    const lowerEyelidMin = eyeHeightMax * 0.23;

    // vertical anchors (outer & inner)
    const innerUpperMax = -eyeHeightMax * 0.51;
    const innerUpperMin = -eyeHeightMax * 0.19;
    const innerLowerMax = eyeHeightMax * 0.29;
    const innerLowerMin = eyeHeightMax * 0.11;

    const outerUpperMax = -eyeHeightMax * 0.28;
    const outerUpperMin = -eyeHeightMax * 0.2;
    const outerLowerMax = eyeHeightMax * 0.43;
    const outerLowerMin = eyeHeightMax * 0.13;

    // horizontal anchors (upper & lower eyelid)
    const eyelidAnchorOffset = eyeWidth * 0.27;
    const eyelidInnerAnchor = side * (abs(eyelidPeakX) - eyelidAnchorOffset);
    const eyelidOuterAnchor = side * (abs(eyelidPeakX) + eyelidAnchorOffset);

    const cx = eyelidPeakX;

    // eye center for translation in see()
    this.cx = eyelidPeakX;
    this.side = side;
    this.strokeWeight = 7;
    this.pupilSize = { w: eyeWidth * .9, h: eyeWidth * .6 }
    this.color = 0;

    // define positions of points and their anchors, relative to eyelidPeakX
    this.inner = makePoint(
      centerOffset - cx,
      eyeBaseline,
      centerOffset - cx,
      lerpInHour(innerUpperMin, innerUpperMax),
      centerOffset - cx,
      lerpInHour(innerLowerMin, innerLowerMax),
    );
    this.upper = makePoint(
      0,
      lerpInHour(upperEyelidMin, upperEyelidMax),
      eyelidInnerAnchor - cx,
      lerpInHour(upperEyelidMin, upperEyelidMax),
      eyelidOuterAnchor - cx,
      lerpInHour(upperEyelidMin, upperEyelidMax),
    );
    this.lower = makePoint(
      0,
      lerpInHour(lowerEyelidMin, lowerEyelidMax),
      eyelidInnerAnchor - cx,
      lerpInHour(lowerEyelidMin, lowerEyelidMax),
      eyelidOuterAnchor - cx,
      lerpInHour(lowerEyelidMin, lowerEyelidMax),
    );
    this.outer = makePoint(
      outerCornerX - cx,
      outerCornerY,
      outerCornerX - cx,
      lerpInHour(outerUpperMin, outerUpperMax),
      outerCornerX - cx,
      lerpInHour(outerLowerMin, outerLowerMax),
    );

    // create segments to draw with bezierVertex
    this.q1 = makeSegment(this.inner, this.inner.c1, this.upper.c1, this.upper);
    this.q2 = makeSegment(this.upper, this.upper.c2, this.outer.c1, this.outer);
    this.q3 = makeSegment(this.outer, this.outer.c2, this.lower.c2, this.lower);
    this.q4 = makeSegment(this.lower, this.lower.c1, this.inner.c2, this.inner);
  }

  /**
   * Moves the pupil towards where the hour hand would be pointing on an analogue clock.
   * @param {number} t - the current time in a 12-hour clock, represented as a number between 0-4 where 0 is 12:00
   */
  lookAtHour(t) {
    const clockwiseQuadrants = [this.q1, this.q4, this.q3, this.q2]
    for (let q of clockwiseQuadrants) {
      if (t < 1) {
        let x = -this.side * bezierPoint(q.a1.x, q.c1.x, q.c2.x, q.a2.x, t);
        let y = bezierPoint(q.a1.y, q.c1.y, q.c2.y, q.a2.y, t);
        ellipse(x, y, this.pupilSize.w, this.pupilSize.h)
        return
      }
      t--
    }
  }

  drawEyelids() {
    push();
    noFill();
    translate(width / 2 + this.cx, height / 2);
    beginShape();
    strokeWeight(this.strokeWeight);
    // BezierVertex needs to be called four times
    // for more: https://beta.p5js.org/reference/p5/beziervertex/ (v2)

    // for each:
    // 1. Anchor 1
    // 2. Control 1
    // 3. Control 2
    // 4. Anchor 2
    bezierVertex(this.inner.x, this.inner.y);
    for (let q of [this.q1, this.q2, this.q3, this.q4]) {
      bezierVertex(q.c1.x, q.c1.y);
      bezierVertex(q.c2.x, q.c2.y);
      bezierVertex(q.a2.x, q.a2.y);
    }
    endShape();
    pop();
  }

  drawPupil() {
    push();
    translate(width / 2 + this.cx, height / 2);
    scale(0.5);
    fill(this.color)
    noStroke()
    const currentHour = lerpByHour();
    this.lookAtHour(currentHour)
    pop();
  }

  see() {
    push()
    // make sure that pupils don't clip outside of eyelids
    beginClip()
    this.drawEyelids()
    endClip()

    this.drawEyelids()
    this.drawPupil()
    pop()
  }
}

function setup() {
  createCanvas(600, 600);
  background(255);
  let leftEye = new Eye("left");
  let rightEye = new Eye("right");
  leftEye.see();
  rightEye.see();
}

// helper functions
function lerpInHour(min, max) {
  const now = new Date();
  const secondsSinceHourStart = now.getMinutes() * 60 + now.getSeconds();
  // return a lower number the closer it is to the end of the hour (closer to min)
  return map(3600 - secondsSinceHourStart, 0, 3600, min, max);
}

function lerpByHour() {
  const now = new Date();
  const secondsSinceDayStart = (now.getHours() % 12) * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const secondsIn12Hours = 12 * 3600;
  return map(secondsSinceDayStart, 0, secondsIn12Hours, 0, 4);
}

function makePoint(x, y, c1x, c1y, c2x, c2y) {
  return { x, y, c1: { x: c1x, y: c1y }, c2: { x: c2x, y: c2y } };
}

function makeSegment(a1, c1, c2, a2) {
  return {
    a1: { x: a1.x, y: a1.y },
    a2: { x: a2.x, y: a2.y },
    c1: c1,
    c2: c2,
  };
}
