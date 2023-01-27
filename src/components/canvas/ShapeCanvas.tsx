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
    const [mouseIsDown, setMouseIsDown] = useState(false);

    const [shapePaths, setShapePaths] = useState<Map<string, Path2D>>(
        new Map()
    );
    const [currentMouseCoordinates, setCurrentMouseCoordinates] =
        useState<Coordinate>({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const shapeCanvasRef = useRef<HTMLCanvasElement>(null);
    // Used to avoid re-drawing entire canvas on hover
    // and ensure hover outline is always on top of everything
    const hoverOutlineCanvasRef = useRef<HTMLCanvasElement>(null);

    const mouseDownHandler = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setMouseIsDown(true);

        // ? good method to fix ts-ignores in this file

        // Setting active shape logic
        const clickedShapeId = getShapeIdUnderPointer(
            currentMouseCoordinates,
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
            // Keep selected shapes if we shift + click
            const newSelectedShapeIds: string[] = e.shiftKey
                ? [...selectedShapeIds]
                : [];
            newSelectedShapeIds.push(clickedShapeId);
            setSelectedShapeIds(newSelectedShapeIds);
        } else if (clickedShapeId && containerRef.current) {
            // Handle deselection behavior. Only deselect on mouseup if we're not dragging.
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
    };

    const mouseMoveHandler = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        // Handle moving logic
        const coords = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        };
        setCurrentMouseCoordinates(coords);

        if (mouseIsDown) {
            const xDiff = e.nativeEvent.movementX;
            const yDiff = e.nativeEvent.movementY;

            // ? could do the declaration here and map instead of foreach
            let updatedShapes = [...shapes];
            shapes
                .filter(
                    ({ id }) =>
                        selectedShapeIds.includes(id) || id === hoveredShapeId
                )
                .forEach((shape) => {
                    const newShape: ShapeData = {
                        ...shape,
                        centerX: shape.centerX + xDiff,
                        centerY: shape.centerY + yDiff,
                    };
                    updatedShapes = updateShape(newShape, updatedShapes);
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
            !mouseIsDown &&
            // Stop resetting of hovered shape to same value
            shapeUnderPointer !== hoveredShapeId
        ) {
            updateHoveredShapeId(shapeUnderPointer);
        }
        if (shapeUnderPointer === undefined) {
            updateHoveredShapeId("");
        }
    };

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

        const newPathMap = new Map<string, Path2D>();

        // Draw the non selected shapes first to avoid any artifacting
        // when selected shapes overlap non-selected shapes

        const unSelectedShapes = [...shapes].filter(
            ({ id }) => !selectedShapeIds.includes(id)
        );
        const selectedShapes = [...shapes].filter(({ id }) =>
            selectedShapeIds.includes(id)
        );

        // ? could just re-use unselected shape entries, as they won't change
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

    // Update hover outline on shapes
    useEffect(() => {
        if (!hoverOutlineCanvasRef.current?.getContext("2d")) {
            return;
        }
        const path = shapePaths.get(hoveredShapeId);
        const outlineContext = hoverOutlineCanvasRef.current.getContext("2d");

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
        // Since we have 2 canvases (1 extra for hover outlines),
        // we listen to all events on the container
        <div
            className="h-[500px] w-[500px] bg-white relative"
            ref={containerRef}
            onMouseDown={(e) => mouseDownHandler(e)}
            onMouseUp={() => setMouseIsDown(false)}
            onMouseMove={(e) => mouseMoveHandler(e)}
            // Ensure we don't get state mismatch when mouse leaves the container
            onMouseLeave={() => setMouseIsDown(false)}
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
                ref={hoverOutlineCanvasRef}
            ></canvas>
        </div>
    );
};

export default ShapeCanvas;
