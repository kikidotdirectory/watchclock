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

    const innerCanthalDistance = width / 10;
    const centerOffset = innerCanthalDistance / 2;

    const palpebralFissureX = width * 0.37;
    const palpebralFissureY = width / 6;
    const yOffset = palpebralFissureY / 2.2;

    const eyelidPeak = palpebralFissureX * 0.48 + centerOffset;
    const eyeBaseline = 0; // centered

    this.q1 = {
      //       ┌─────┐  ┌─────┐
      //  ⣀⣤⣤⡖⠛│⡉⠓⣦⡀⠀│⠀⠀│⠀⠀⣠⢴⠒│⠒⠦⢄⡀⠀
      // ⠙⣇⠀⠀⣷⡀└─────┘⠀⠀└─────┘⠃⢀⡇⠈⣱⣦
      // ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀
      // ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀
      //

      a1: { x: side * centerOffset, y: eyeBaseline },
      a2: { x: side * eyelidPeak, y: -yOffset },
      c1: { x: side * centerOffset, y: -yOffset },
      c2: { x: side * (eyelidPeak - palpebralFissureX * 0.3), y: -yOffset },
    };

    this.q2 = {
      //┌──────┐              ┌──────┐
      //│ ⣀⣤⣤⡖⠛│⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒│⠒⠦⢄⡀⠀ │
      //└──────┘⠃⢀⡇⠙⢦⠀⠀⠀⢀⡿⠟⠉⢿⠀└──────┘
      // ⠀⠈⠳⣄⠀⠙⠓⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦⠶⠋⢀⡴⠋⠀
      // ⠀⠀⠀⠈⠓⠦⠤⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤⣶⠞⠉⠀⠀⠀
      //

      a1: { x: side * eyelidPeak, y: -yOffset },
      a2: { x: side * palpebralFissureX, y: eyeBaseline },
      c1: { x: side * (eyelidPeak + palpebralFissureX * 0.2), y: -yOffset },
      c2: { x: side * palpebralFissureX, y: palpebralFissureY * -0.25 },
    };

    this.q3 = {
      //
      //  ⣀⣤⣤⡖⠛⣭⡉⠓⣦⡀⠀⠀⠀⠀⠀⠀⠀⣠⢴⠒⠒⠒⠦⢄⡀⠀
      //┌──────┐⠃⢀⡇⠙⢦⠀⠀⠀⢀⡿⠟⠉⢿⠀⠿┌──────┐
      //│⠀⠈⠳⣄⠀⠙│⠋⠉⣀⡔⠋⠀⠀⠀⠀⠻⣦⡀⠘⠷⠦│⠋⢀⡴⠋⠀ │
      //│⠀⠀⠀⠈⠓⠦│⠖⠚⠁⠀     ⠀⠀⠙⠷⣦⣤│⠞⠉⠀⠀⠀ │
      //└──────┘               └──────┘

      a1: { x: side * (centerOffset + palpebralFissureX), y: eyeBaseline },
      a2: { x: side * eyelidPeak, y: yOffset },
      c1: { x: side * palpebralFissureX, y: yOffset * 0.67 },
      c2: { x: side * (eyelidPeak + palpebralFissureX * 0.2), y: yOffset },
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
      c1: { x: side * (eyelidPeak - palpebralFissureX * 0.27), y: yOffset },
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
