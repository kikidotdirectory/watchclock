# watchclock

a simple 'clock' designed and built as apart of [Visualizing the City](https://coopertype.org/events/visualizing-the-city-interactive-data-stories-with-nyc-open-data), a class at Data@Cooper.

## description

the 'clock' visualizes time with a pair of eyes. the opening of the eyes represents the minute with fully open representing :00 and nearly closed representing :59. the hour is represented by the direction the eyes are looking. the design is based on the concept of someone dozing off watching the time pass.

under the hood, it is built with p5js. the eyes are drawn as closed cubic bezier curves scaled to the canvas size. eyelid opening is interpolated across the current minute using `lerpInHour`, and gaze direction is calculated by finding the point on each eye's bezier track that faces toward the current hour position on an imaginary clock centered on the canvas.

## getting started

download & run in a live server. `npm i` for types.

## ai disclaimer

while the concept and implementation was completely human-created, ai-assisted code was used to write parts of the execution, such as the `lookAt()` function, and used for some refactoring with supervision.
