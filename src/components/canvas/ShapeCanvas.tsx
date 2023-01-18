import { useEffect, useRef, useState } from "react";
import { updateShape } from "../../utils/ShapeCrud";
import { drawShape, strokeShape } from "../../utils/ShapeDrawingStrategy";
import { ShapeData } from "../../utils/ShapeType";

type Coordinate = { x: number; y: number };

const getShapeIdUnderPointer = (
    { x, y }: Coordinate,
    shapePaths: Map<string, Path2D>,
    ctx: CanvasRenderingContext2D
): string | undefined => {
    let foundShapeId: string | undefined = undefined;
    shapePaths.forEach((path, shapeId) => {
        if (ctx.isPointInPath(path, x, y)) {
            foundShapeId = shapeId;
            return shapeId;
        }
    });

    return foundShapeId;
};

type Props = {
    shapes: ShapeData[];
    selectedShapeIds: string[];
    setSelectedShapeIds: (shapeIds: string[]) => void;
    setShapesList: (shapes: ShapeData[]) => void;
};

const ShapeCanvas: React.FC<Props> = ({
    shapes,
    selectedShapeIds,
    setSelectedShapeIds,
    setShapesList,
}: Props) => {
    const [hoveredShapeId, updateHoveredShapeId] = useState<string>("");

    const [pointerIsDown, setPointerIsDown] = useState(false);

    const [shapePaths, setShapePaths] = useState<Map<string, Path2D>>(
        new Map()
    );

    const [currentPointerCoordinates, setCurrentPointerCoordinates] =
        useState<Coordinate>({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    const shapeCanvasRef = useRef<HTMLCanvasElement>(null);
    // Used to avoid re-drawing entire canvas on hover
    const outlineCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update shapes and their selection outlines
    useEffect(() => {
        const shapeCanvas = shapeCanvasRef.current;
        if (!shapeCanvas) {
            return;
        }

        const shapeContext = shapeCanvas.getContext(
            "2d"
        ) as CanvasRenderingContext2D;
        shapeContext.clearRect(0, 0, 500, 500);

        // Draw the non selected shapes first to avoid any artifacting when
        // selected shapes overlap non-selected shapes

        const unSelectedShapes = [...shapes].filter(
            ({ id }) => !selectedShapeIds.includes(id)
        );
        const selectedShapes = [...shapes].filter(({ id }) =>
            selectedShapeIds.includes(id)
        );

        const newPathMap = new Map<string, Path2D>();

        unSelectedShapes.forEach((shape) => {
            const path = drawShape(shape, shapeContext);
            newPathMap.set(shape.id, path);
        });

        selectedShapes.forEach((shape) => {
            const path = drawShape(shape, shapeContext);
            newPathMap.set(shape.id, path);

            // Highlight selected shapes
            strokeShape(shape, shapeContext, false);
        });

        setShapePaths(newPathMap);
    }, [shapes, selectedShapeIds]);

    useEffect(() => {
        if (!outlineCanvasRef.current?.getContext("2d")) {
            return;
        }
        const path = shapePaths.get(hoveredShapeId);
        const outlineContext = outlineCanvasRef.current.getContext("2d");

        outlineContext!.clearRect(0, 0, 500, 500);

        if (
            shapes.map(({ id }) => id).includes(hoveredShapeId) &&
            outlineContext &&
            path
        ) {
            const shape = shapes.find(({ id }) => id === hoveredShapeId);
            // @ts-ignore
            strokeShape(shape, outlineContext, true);
        }
    }, [shapes, hoveredShapeId, shapePaths]);

    return (
        // In my experience, canvases can be weird with events occasionally,
        // so I'll do all the event captures on this div
        <div
            className="h-[500px] w-[500px] bg-white relative"
            ref={containerRef}
            onMouseDown={(e) => {
                setPointerIsDown(true);

                // Setting active shape logic
                const clickedShapeId = getShapeIdUnderPointer(
                    currentPointerCoordinates,
                    shapePaths,
                    // @ts-ignore
                    shapeCanvasRef.current?.getContext("2d")
                );

                if (!clickedShapeId) {
                    setSelectedShapeIds([]);
                } else if (
                    clickedShapeId &&
                    !selectedShapeIds.includes(clickedShapeId)
                ) {
                    const newSelectedShapeIds: string[] = e.shiftKey
                        ? [...selectedShapeIds]
                        : [];
                    newSelectedShapeIds.push(clickedShapeId);
                    setSelectedShapeIds(newSelectedShapeIds);
                } else if (clickedShapeId && containerRef.current) {
                    // Handle deselection behavior. Only deselect on mouseup if we're not dragging
                    // We do this with 2 (single use) event listeners that abort (via abort controller)
                    // as soon as either of them trigger.
                    const controller = new AbortController();
                    // If mouse moves (shape being dragged) do nothing
                    containerRef.current.addEventListener(
                        "mousemove",
                        () => {
                            controller.abort();
                        },
                        { once: true, signal: controller.signal }
                    );
                    // If no mouse movement, deselect shape on mouseup
                    containerRef.current.addEventListener(
                        "mouseup",
                        () => {
                            setSelectedShapeIds(
                                [...selectedShapeIds].filter(
                                    (id) => id !== clickedShapeId
                                )
                            );
                            controller.abort();
                        },
                        { once: true, signal: controller.signal }
                    );
                }
            }}
            onMouseUp={() => {
                setPointerIsDown(false);
            }}
            // ensure we don't get buggy dragging
            onMouseLeave={() => setPointerIsDown(false)}
            onMouseMove={(e) => {
                // Handle moving logic
                const coords = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                };
                setCurrentPointerCoordinates(coords);

                if (pointerIsDown) {
                    const xDiff = e.nativeEvent.movementX;
                    const yDiff = e.nativeEvent.movementY;

                    let updatedShapes = [...shapes];
                    shapes
                        .filter(
                            ({ id }) =>
                                selectedShapeIds.includes(id) ||
                                id === hoveredShapeId
                        )
                        .forEach((shape) => {
                            const newShape: ShapeData = {
                                ...shape,
                                centerX: shape.centerX + xDiff,
                                centerY: shape.centerY + yDiff,
                            };
                            updatedShapes = updateShape(
                                newShape,
                                updatedShapes
                            );
                        });
                    setShapesList(updatedShapes);
                }

                // Handle hover logic
                const shapeUnderPointer = getShapeIdUnderPointer(
                    coords,
                    shapePaths,
                    // @ts-ignore
                    shapeCanvasRef.current?.getContext("2d")
                );
                if (
                    shapeUnderPointer &&
                    // Stop dragging from moving hovered shapes
                    !pointerIsDown &&
                    // Stop resetting of hovered shape to same value
                    shapeUnderPointer !== hoveredShapeId
                ) {
                    updateHoveredShapeId(shapeUnderPointer);
                }
                if (shapeUnderPointer === undefined) {
                    updateHoveredShapeId("");
                }
            }}
        >
            <canvas
                className="absolute z-0 pointer-events-none"
                width={500}
                height={500}
                ref={shapeCanvasRef}
            ></canvas>
            <canvas
                className="absolute z-10 pointer-events-none"
                width={500}
                height={500}
                ref={outlineCanvasRef}
            ></canvas>
        </div>
    );
};

export default ShapeCanvas;
