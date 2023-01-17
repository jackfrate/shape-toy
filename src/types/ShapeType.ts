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

// Type guards

export const isRectangleData = (shapeData: any): shapeData is RectangleData => {
    return shapeData.width !== undefined && shapeData.height !== undefined;
};

export const isCircleData = (shapeData: any): shapeData is CircleData => {
    return shapeData.radius !== undefined;
};
