//
// Math helpers for shapes

// import {
//     CircleData,
//     isCircleData,
//     isRectangleData,
//     RectangleData,
//     ShapeData,
// } from "./ShapeType";

// //
// export const areCoordinatesInShape = (
//     x: number,
//     y: number,
//     shape: ShapeData
// ): boolean => {
//     if (shape.type === "rectangle" && isRectangleData(shape)) {
//         return areCoordinatesInRectangle(x, y, shape);
//     }

//     if (shape.type === "circle" && isCircleData(shape)) {
//         return areCoordinatesInCircle(x, y, shape);
//     }
// };

// const areCoordinatesInRectangle = (
//     x: number,
//     y: number,
//     shape: RectangleData
// ): boolean => {
//     const shapeXOrigin = shape.centerX - shape.width / 2;
//     const shapeYOrigin = shape.centerY - shape.height / 2;
//     return (
//         x >= shapeXOrigin &&
//         x <= shapeXOrigin + shape.width &&
//         y >= shapeYOrigin &&
//         x <= shapeYOrigin + shape.height
//     );
// };

// const areCoordinatesInCircle = (
//     x: number,
//     y: number,
//     shape: CircleData
// ): boolean => {

// };
export default {};
