import { SetStateAction, useState } from "react";
import Plot from "./Plot";
import "./styles/App.css"

function App() {
  const [expression, setExpression] = useState("");
  const onChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setExpression(e.target.value);
  }
  return (
    <div className="w-screen h-screen">
      <div className="w-full max-w-md mx-auto my-4">
        <input
          type="text"
          placeholder="Enter text here"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={onChange}
        />
      </div>
      <div className="w-full h-full">
        <Plot f={expression} margin={40} range={{ x: [-10, 10], y: [-10, 10] }} />
      </div>
    </div>
  );
}

export default App;
