import {
    isCircleData,
    isRectangleData,
    ShapeData,
} from "../../utils/ShapeType";
import CircleEditor from "./CircleEditor";
import RectEditor from "./RectEditor";

type Props = {
    shapeData: ShapeData;
    onShapeUpdate: (newShapeData: ShapeData) => void;
    onShapeDelete: () => void;
};

const ShapeEditorContainer: React.FC<Props> = ({
    shapeData,
    onShapeUpdate,
    onShapeDelete,
}: Props) => {
    const shapeSpecificOptions = () => {
        // If more shapes were added, a Record of type Record<ShapeType, () => React.FC>
        // would be better for storing this logic
        if (shapeData.type === "rectangle" && isRectangleData(shapeData)) {
            return (
                <RectEditor
                    shapeData={shapeData}
                    onShapeUpdate={onShapeUpdate}
                ></RectEditor>
            );
        }

        if (shapeData.type === "circle" && isCircleData(shapeData)) {
            return (
                <CircleEditor
                    shapeData={shapeData}
                    onShapeUpdate={onShapeUpdate}
                ></CircleEditor>
            );
        }
    };

    return (
        <div className="card w-96 bg-base-300 shadow-xl">
            <div className="card-body flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <div
                        className="btn btn-error"
                        onClick={() => onShapeDelete()}
                    >
                        Delete
                    </div>
                    <div className="capitalize text-xl">{shapeData.type}</div>
                </div>
                <div className="flex flex-row gap-8 pl-4 items-center">
                    <div className="font-bold">Center x</div>
                    <div>{shapeData.centerX}</div>
                </div>
                <div className="flex flex-row gap-8 pl-4 items-center">
                    <div className="font-bold">Center y</div>
                    <div>{shapeData.centerY}</div>
                </div>
                <div className="flex flex-row gap-8 pl-4 items-center">
                    {shapeSpecificOptions()}
                </div>
                <div className="flex flex-row gap-8 pl-4 items-center">
                    <div className="font-bold">Color</div>
                    <input
                        type="color"
                        name="color"
                        value={shapeData.color}
                        onChange={(e) => {
                            const newShapeData = {
                                ...shapeData,
                                color: e.currentTarget.value,
                            };
                            onShapeUpdate(newShapeData);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShapeEditorContainer;
