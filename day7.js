let sourceImage;
let maskImage;

function randPow2() {
    return Math.pow(2, Math.floor(Math.random() * 4));
}

function randStep() {
    let init = randPow2();
    init = init == 0 ? 1 : init;
    return init * randPow2();
}

function randPosInt(up) {
    return Math.floor(Math.random() * up) + 1;
}

let backgroundColor;
let horizontalLinesColor;
let verticalLinesColor;
let verticalLinesStep = randStep();
let stepMult = 1 / randPosInt(4);
let horizontalLinesStep = verticalLinesStep / stepMult;
let weightMult = 1 / randPosInt(4);
let verticalLinesWeight = verticalLinesStep / randPow2();
let horizontalLinesWeight = verticalLinesWeight * weightMult;
let verticalFreq = 1 / 2;
let horizontalFreq = (verticalFreq * 1) / randPosInt(4);
let maskFn;
let horizontalDrawMethod;

function initRandomPallette() {
    const pallettes = [
        [[20], [220], [220]],
        [
            [105, 210, 231],
            [224, 228, 204],
            [250, 105, 0]
        ],
        [
            [21, 39, 68],
            [163, 253, 243],
            [97, 210, 194]
        ]
    ];

    const p = pallettes[int(random(pallettes.length))];
    backgroundColor = color.apply(null, p[0]);
    verticalLinesColor = color.apply(null, p[1]);

    horizontalLinesColor = color.apply(null, p[2]);
}

function randomMaskShape() {
    const fns = [
        pg => pg.ellipse(width / 2, height / 2, 300),
        pg => pg.rect(width / 4, height / 4, width / 2, height / 2),
        pg =>
            pg.triangle(
                width / 2,
                height / 4,
                width / 4,
                height * 0.75,
                width * 0.75,
                height * 0.75
            )
    ];
    return fns[int(random(fns.length))];
}

function setup() {
    createCanvas(500, 500);
    initRandomPallette();

    sourceImage = createGraphics(width, height);

    maskImage = createGraphics(width, height);
    maskFn = randomMaskShape();
    maskFn(maskImage);
    horizontalDrawMethod = int(random(3));
}

function draw() {
    background(backgroundColor);
    drawVerticalLines(
        this,
        verticalLinesStep,
        verticalLinesColor,
        verticalLinesWeight
    );
    updateMasked();
    image(masked, 0, 0);
}

function updateMasked() {
    sourceImage.background(backgroundColor);
    drawHorizontalLines(
        sourceImage,
        horizontalLinesStep,
        horizontalLinesColor,
        horizontalLinesWeight
    );
    sourceImage.stroke(verticalLinesColor);
    maskFn(sourceImage);
    masked = sourceImage.get();
    masked.mask(maskImage);
}

function drawHorizontalLines(pg, step, c, sw) {
    pg.stroke(c);
    pg.strokeWeight(sw);
    pg.noFill();
    switch (horizontalDrawMethod) {
        case 0:
            {
                for (
                    let y = (frameCount * horizontalFreq) % step;
                    y < pg.height;
                    y += step
                ) {
                    pg.line(0, y, pg.width, y);
                }
            }
            break;
        case 1: {
            for (
                let y = (frameCount * horizontalFreq) % step;
                y < pg.height;
                y += step
            ) {
                for (let x = 1; x < pg.width; x++) {
                    pg.line(
                        x - 1,
                        y +
                            (Math.sin(
                                (x -
                                    1 +
                                    ((frameCount * horizontalFreq) % step)) /
                                    10
                            ) *
                                horizontalLinesStep) /
                                3,
                        x,
                        y +
                            (Math.sin(
                                x / 10 + ((frameCount * horizontalFreq) % step)
                            ) *
                                horizontalLinesStep) /
                                3
                    );
                }
            }
            break;
        }
        case 2: {
            for (
                let y = (frameCount * horizontalFreq) % step;
                y < pg.height;
                y += step
            ) {
                for (let x = 1; x < pg.width; x++) {
                    pg.line(
                        x - 1,
                        y + (Math.sin((x - 1) / 10) * horizontalLinesStep) / 3,
                        x,
                        y + (Math.sin(x / 10) * horizontalLinesStep) / 3
                    );
                }
            }
            break;
        }
    }
}

function drawVerticalLines(pg, step, c, sw) {
    pg.stroke(c);
    pg.strokeWeight(sw);
    pg.noFill();
    for (x = (frameCount * verticalFreq) % step; x < pg.width; x += step) {
        pg.line(x, 0, x, height);
    }
}
