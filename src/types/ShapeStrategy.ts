import {
    CircleData,
    isCircleData,
    isRectangleData,
    RectangleData,
    ShapeData,
} from "./ShapeType";

export const drawShape = (
    shape: ShapeData,
    ctx: CanvasRenderingContext2D
): Path2D => {
    if (shape.type === "rectangle" && isRectangleData(shape)) {
        return drawRectangle(shape, ctx);
    }

    if (shape.type === "circle" && isCircleData(shape)) {
        return drawCircle(shape, ctx);
    }
    // This should never be hit, but is just here for typescript for now
    return new Path2D();
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
    // This should never be hit, but is just here for typescript for now
    return new Path2D();
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

    ctx.fillStyle = shape.color;
    ctx.fill(path);

    return path;
};

const drawCircle = (
    shape: CircleData,
    ctx: CanvasRenderingContext2D
): Path2D => {
    const path = new Path2D();
    path.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);

    ctx.fillStyle = shape.color;
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
