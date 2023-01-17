import { useState } from "react";
import {
    CircleData,
    createShape,
    RectangleData,
    ShapeData,
} from "../../types/ShapeType";
import ShapeCanvas from "../canvas/ShapeCanvas";

const Container = () => {
    const [shapes, updateShapes] = useState<ShapeData[]>([]);
    const [hoveredShapeId, updateHoveredShapeId] = useState<string>("");
    const [selectedShapeIds, updateSelectedShapeIds] = useState<string[]>([]);

    return (
        <div className="flex flex-col gap-1">
            <div className="navbar bg-base-300">
                <h1 className="text-2xl font-bold">Shape Toy</h1>
            </div>
            <div className="flex flex-row px-2 gap-6">
                <div className="flex flex-col gap-2">
                    <div
                        className="btn"
                        onClick={() => {
                            const newRectangle: RectangleData = {
                                id: "",
                                type: "rectangle",
                                centerX: 100,
                                centerY: 100,
                                color: "black",
                                width: 50,
                                height: 50,
                            };

                            const newShapes = createShape(newRectangle, shapes);
                            updateShapes(newShapes);
                        }}
                    >
                        Add Rectangle
                    </div>
                    <div
                        className="btn"
                        onClick={() => {
                            const newCircle: CircleData = {
                                id: "",
                                type: "rectangle",
                                centerX: 100,
                                centerY: 100,
                                color: "black",
                                radius: 50,
                            };

                            const newShapes = createShape(newCircle, shapes);
                            updateShapes(newShapes);
                        }}
                    >
                        Add Circle
                    </div>
                </div>
                <div className="flex flex-col">
                    <ShapeCanvas
                        shapes={shapes}
                        hoveredShapeId={hoveredShapeId}
                        selectedShapeIds={selectedShapeIds}
                    ></ShapeCanvas>
                </div>
                <div className="flex flex-col"></div>
            </div>
            {/* TODO: Delete this */}
            <div className="testZone">
                shapes len : {shapes.length.toString()}
            </div>
        </div>
    );
};

export default Container;
