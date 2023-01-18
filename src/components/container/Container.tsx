import { useState } from "react";
import { createShape, deleteShape, updateShape } from "../../utils/ShapeCrud";
import { CircleData, RectangleData, ShapeData } from "../../utils/ShapeType";
import ShapeCanvas from "../canvas/ShapeCanvas";
import ShapeEditorContainer from "../editors/ShapeEditorContainer";

const shapeCompareFunction = (a: ShapeData, b: ShapeData) => {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
};

// Default shape data for making new shapes,
// the ID is filled in when creating
const newRectangle: RectangleData = {
    id: "",
    type: "rectangle",
    centerX: 250,
    centerY: 250,
    color: "#000000",
    width: 50,
    height: 50,
};

const newCircle: CircleData = {
    id: "",
    type: "circle",
    centerX: 250,
    centerY: 250,
    color: "#000000",
    radius: 50,
};

// TODO: try moving inline functions to the component if it doesn't break state
const Container = () => {
    const [shapes, updateShapes] = useState<ShapeData[]>([]);
    const [selectedShapeIds, updateSelectedShapeIds] = useState<string[]>([]);

    return (
        <div className="flex flex-col gap-1">
            <div className="navbar bg-base-300">
                <h1 className="text-2xl font-bold">Shape Toy</h1>
            </div>
            <div className="flex flex-row px-2 gap-6">
                {/* Create shape menu */}
                <div className="flex flex-col gap-2">
                    <div
                        className="btn btn-primary w-40"
                        onClick={() => {
                            const newShapes = createShape(newRectangle, shapes);
                            updateShapes(newShapes);
                        }}
                    >
                        Add Rectangle
                    </div>
                    <div
                        className="btn btn-primary w-40"
                        onClick={() => {
                            const newShapes = createShape(newCircle, shapes);
                            updateShapes(newShapes);
                        }}
                    >
                        Add Circle
                    </div>
                </div>
                {/* Canvas */}
                <div className="flex flex-col">
                    <ShapeCanvas
                        shapes={shapes}
                        selectedShapeIds={selectedShapeIds}
                        setSelectedShapeIds={(shapeIds) =>
                            updateSelectedShapeIds(shapeIds)
                        }
                        setShapesList={(shapes) => updateShapes(shapes)}
                    ></ShapeCanvas>
                </div>
                {/* Shape properties */}
                <div className="flex flex-col">
                    <div className="flex flex-col gap-2">
                        {shapes
                            .filter(({ id }) => selectedShapeIds.includes(id))
                            // The shape edit menus have to be sorted consistently here,
                            // otherwise they will move around when editing (not good)
                            .sort(shapeCompareFunction)
                            .map((shape) => {
                                return (
                                    <ShapeEditorContainer
                                        shapeData={shape}
                                        onShapeUpdate={(newShapeData) => {
                                            const newShapes = updateShape(
                                                newShapeData,
                                                shapes
                                            );
                                            updateShapes(newShapes);
                                        }}
                                        onShapeDelete={() => {
                                            const newShapes = deleteShape(
                                                shape,
                                                shapes
                                            );
                                            updateShapes(newShapes);
                                        }}
                                        key={shape.id}
                                    ></ShapeEditorContainer>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Container;
