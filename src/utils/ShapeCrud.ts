import { v4 as uuidv4 } from "uuid";
import { ShapeData } from "./ShapeType";

// Crud Operations for shapes
// They all return a new array instead of 
// changing the old one


export const createShape = (
    newShape: ShapeData,
    shapesList: ShapeData[]
): ShapeData[] => {
    const newShapesList = [...shapesList];

    const id = uuidv4();
    newShape = {
        ...newShape,
        id,
    };

    newShapesList.push(newShape);

    return newShapesList;
};

export const updateShape = (
    updatedShape: ShapeData,
    shapesList: ShapeData[]
): ShapeData[] => {
    const newShapesList = [...shapesList].filter(
        (shape) => shape.id !== updatedShape.id
    );

    // Put updated shape at the end to keep shape overlapping consistent
    newShapesList.push(updatedShape);

    return newShapesList;
};

export const deleteShape = (
    shapeToDelete: ShapeData,
    shapesList: ShapeData[]
): ShapeData[] => {
    const newShapesList = [...shapesList].filter(
        (shape) => shape.id !== shapeToDelete.id
    );

    return newShapesList;
};
