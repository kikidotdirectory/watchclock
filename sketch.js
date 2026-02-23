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
    const eyelidPeakX = side * (eyeWidth * 0.48 + centerOffset);

    // vertical positioning
    const eyeBaseline = 0; // centered
    // outer corner is higher than inner
    const outerOffsetY = -eyeHeightMax * 0.05;

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

    this.inner = {
      x: side * centerOffset,
      y: eyeBaseline,
      a1: { min: -(eyeHeightMax * 0.19), max: -(eyeHeightMax * 0.51) },
      a2: { min: eyeHeightMax * 0.11, max: eyeHeightMax * 0.29 },
    };
    this.upper = {
      x: side * eyelidPeakX,
      y: { min: eyeHeightMax * 0.17, max: eyeHeightMax * 0.61 },
      a1: side * (eyeWidth * 0.28),
      a2: this.upper.a1,
    };
    this.q1 = {
      //       ┌─────┐  ┌─────┐
      //  ⣀⣤⣤⡖⠛│⡉⠓⣦⡀⠀│⠀⠀│⠀⠀⣠⢴⠒│⠒⠦⢄⡀⠀
      // ⠙⣇⠀⠀⣷⡀└─────┘⠀⠀└─────┘⠃⢀⡇⠈⣱⣦
      // ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀
      // ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀
      //

      a1: { x: this.inner.x, y: this.inner.y },
      a2: { x: side * eyelidPeak, y: -yOffset },
      c1: {
        x: this.inner.x,
        y: interpolateThing(this.inner.a1.min, this.inner.a1.max),
      },
      c2: { x: side * (eyelidPeak - eyeWidth * 0.3), y: -yOffset },
    };

    this.q2 = {
      //┌──────┐              ┌──────┐
      //│ ⣀⣤⣤⡖⠛│⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒│⠒⠦⢄⡀⠀ │
      //└──────┘⠃⢀⡇⠙⢦⠀⠀⠀⢀⡿⠟⠉⢿⠀└──────┘
      // ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀
      // ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀
      //

      a1: { x: side * eyelidPeak, y: -yOffset },
      a2: { x: side * eyeWidth, y: eyeBaseline },
      c1: { x: side * (eyelidPeak + eyeWidth * 0.2), y: -yOffset },
      c2: { x: side * eyeWidth, y: eyeHeightMax * -0.25 },
    };

    this.q3 = {
      //
      //  ⣀⣤⣤⡖⠛⣭⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒⠒⠒⠦⢄⡀⠀
      //┌──────┐⠃⢀⡇⠙⢦⠀⠀⠀⢀⡿⠟⠉⢿⠀⠿┌──────┐
      //│⠀⠈⠳⣄⠀⠙│⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦│⠋⢀⡴⠋⠀ │
      //│⠀⠀⠀⠈⠓⠦│⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤│⠞⠉⠀⠀⠀ │
      //└──────┘               └──────┘

      a1: { x: side * (centerOffset + eyeWidth), y: eyeBaseline },
      a2: { x: side * eyelidPeak, y: yOffset },
      c1: { x: side * eyeWidth, y: yOffset * 0.67 },
      c2: { x: side * (eyelidPeak + eyeWidth * 0.2), y: yOffset },
    };

    this.q4 = {
      //
      //  ⣀⣤⣤⡖⠛⣭⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒⠒⠒⠦⢄⡀⠀
      // ⠙⣇⠀⠀⣷⡀⠛┌────┐⠀┌─────┐⠿⠃⢀⡇⠈⣱⣦
      // ⠀⠈⠳⣄⠀⠙⠓│⠉⣀⡔⠋│⠀│⠀⠻⣦⡀⠘│⠦⠶⠋⢀⡴⠋⠀
      // ⠀⠀⠀⠈⠓⠦⠤│⠚⠁⠀ │ │ ⠀⠀⠙⠷│⣤⣶⠞⠉⠀⠀⠀
      //        └────┘ └─────┘

      a1: { x: side * eyelidPeak, y: yOffset },
      a2: { x: side * centerOffset, y: eyeBaseline },
      c1: { x: side * (eyelidPeak - eyeWidth * 0.27), y: yOffset },
      c2: { x: side * centerOffset, y: yOffset * 0.55 },
    };
  }

  see() {
    push();
    noFill();
    translate(width / 2, height / 2);
    beginShape();
    strokeWeight(3);
    // BezierVertex needs to be called four times
    // for more: https://beta.p5js.org/reference/p5/beziervertex/ (v2)

    // for each:
    // 1. Anchor 1
    // 2. Control 1
    // 3. Control 2
    // 4. Anchor 2
    bezierVertex(this.q1.a1.x, this.q1.a1.y);
    for (let q of [this.q1, this.q2, this.q3, this.q4]) {
      bezierVertex(q.c1.x, q.c1.y);
      bezierVertex(q.c2.x, q.c2.y);
      bezierVertex(q.a2.x, q.a2.y);
    }
    endShape();
    pop();
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

const now = new Date();
const secondsSinceHourStart = now.getMinutes() * 60 + now.getSeconds();
function interpolateThing(min, max) {
  // return a lower number the closer it is to the end of the hour (closer to min)
  return map(3600 - secondsSinceHourStart, 0, 3600, min, max);
}
