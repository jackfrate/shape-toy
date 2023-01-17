import { v4 as uuidv4 } from "uuid";

export type ShapeType = "rectangle" | "circle";

export type ShapeData = {
    id: string;
    type: ShapeType;
    centerX: number;
    centerY: number;
    color: string;
};

export interface RectangleData extends ShapeData {
    width: number;
    height: number;
}

export interface CircleData extends ShapeData {
    radius: number;
}

//
// Type guards
//

export const isRectangleData = (shapeData: any): shapeData is RectangleData => {
    return shapeData.width !== undefined && shapeData.height !== undefined;
};

export const isCircleData = (shapeData: any): shapeData is CircleData => {
    return shapeData.radius !== undefined;
};

//
// Shape data CRUD
// Keeping things purely functional to avoid headaches
//

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
