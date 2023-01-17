import "./App.css";
import ShapeEditorContainer from "./components/editors/ShapeEditorContainer";
import { RectangleData, ShapeData } from "./types/ShapeType";

function App() {
    const fakeShapeData: RectangleData = {
        id: "yeet",
        type: "rectangle",
        centerX: 0,
        centerY: 0,
        color: "red",
        height: 50,
        width: 100,
    };

    const fakeShapeUpdate = (newShapeData: ShapeData) => {
        console.log(
            `fake update worked with id ${newShapeData.id}, and new data ${newShapeData}`
        );
    };

    return (
        <div className="App">
            <div className="testChamber">
                <ShapeEditorContainer
                    shapeData={fakeShapeData}
                    onShapeUpdate={fakeShapeUpdate}
                ></ShapeEditorContainer>
            </div>
        </div>
    );
}

export default App;
