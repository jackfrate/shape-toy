import {
    CircleData,
    isCircleData,
    isRectangleData,
    RectangleData,
    ShapeData,
} from "./ShapeType";

// TODO: remove the canvas
export const drawShape = (
    shape: ShapeData,
    ctx: CanvasRenderingContext2D
) => {
    if (shape.type === "rectangle" && isRectangleData(shape)) {
        drawRectangle(shape, ctx);
    }

    if (shape.type === "circle" && isCircleData(shape)) {
        drawCircle(shape, ctx);
    }
};

export const strokeShape = (
    shape: ShapeData,
    context: CanvasRenderingContext2D
) => {
    
}; 

// Again, I'd put these function references in a map to access
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

const drawCircle = (shape: CircleData, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
    ctx.fillStyle = shape.color;
    ctx.fill();
    ctx.closePath();
};
