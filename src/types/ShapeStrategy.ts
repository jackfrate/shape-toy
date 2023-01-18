import { isRectangleData, RectangleData, ShapeData } from "./ShapeType";

export const drawShape = (
    shape: ShapeData,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    if (shape.type === "rectangle" && isRectangleData(shape)) {
        drawRectangle(shape, ctx);
    }
};

// Again, I'd put these function references in a map
// if there were more than 2 being used. (see comment in ../ShapeType.ts)
const drawRectangle = (
    shape: RectangleData,
    // canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {
    const originX = shape.centerX - shape.width / 2;
    const originY = shape.centerY - shape.height / 2;

    ctx.fillStyle = shape.color;
    ctx.fillRect(originX, originY, shape.width, shape.height);
};

const drawCircle = (
    shape: ShapeData,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) => {};
