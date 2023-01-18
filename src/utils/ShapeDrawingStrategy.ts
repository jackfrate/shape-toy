import {
    CircleData,
    isCircleData,
    isRectangleData,
    RectangleData,
    ShapeData,
} from "./ShapeType";

// Drawing functions. Since there are 2 canvases, 
// we can use these on either

export const drawShape = (
    shape: ShapeData,
    ctx: CanvasRenderingContext2D
): Path2D => {
    ctx.fillStyle = shape.color;

    if (shape.type === "rectangle" && isRectangleData(shape)) {
        return drawRectangle(shape, ctx);
    }

    if (shape.type === "circle" && isCircleData(shape)) {
        return drawCircle(shape, ctx);
    }

    throw new Error("Shape must be a rectangle or circle");
};

export const strokeShape = (
    shape: ShapeData,
    ctx: CanvasRenderingContext2D,
    isHover: boolean = false
) => {
    const outlineOffset = isHover ? 6 : 2;
    const outlineColor = isHover ? "red" : "blue";
    ctx.lineWidth = 4;

    if (shape.type === "rectangle" && isRectangleData(shape)) {
        return strokeRectangle(shape, ctx, outlineOffset, outlineColor);
    }

    if (shape.type === "circle" && isCircleData(shape)) {
        return strokeCircle(shape, ctx, outlineOffset, outlineColor);
    }

    throw new Error("Shape must be a rectangle or circle");
};

// Again, I'd put these function references in a map to access
// if there were more than 2 being used. (see comment in ../ShapeType.ts)
const drawRectangle = (
    shape: RectangleData,
    ctx: CanvasRenderingContext2D
): Path2D => {
    const originX = shape.centerX - shape.width / 2;
    const originY = shape.centerY - shape.height / 2;

    const path = new Path2D();
    path.rect(originX, originY, shape.width, shape.height);

    ctx.fill(path);

    return path;
};

const drawCircle = (
    shape: CircleData,
    ctx: CanvasRenderingContext2D
): Path2D => {
    const path = new Path2D();
    path.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);

    ctx.fill(path);

    return path;
};

const strokeRectangle = (
    shape: RectangleData,
    ctx: CanvasRenderingContext2D,
    outlineOffset: number,
    outlineColor: string
): Path2D => {
    const originX = shape.centerX - shape.width / 2;
    const originY = shape.centerY - shape.height / 2;

    const path = new Path2D();
    path.rect(
        originX - outlineOffset,
        originY - outlineOffset,
        shape.width + outlineOffset * 2,
        shape.height + outlineOffset * 2
    );

    ctx.strokeStyle = outlineColor;
    ctx.stroke(path);

    return path;
};

const strokeCircle = (
    shape: CircleData,
    ctx: CanvasRenderingContext2D,
    outlineOffset: number,
    outlineColor: string
): Path2D => {
    const path = new Path2D();
    path.arc(
        shape.centerX,
        shape.centerY,
        shape.radius + outlineOffset,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = outlineColor;
    ctx.stroke(path);

    return path;
};
