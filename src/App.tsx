import Plot from "./Plot";

function App() {
  return (
    <>
      <Plot
        f="sin(2x + 4)"
        margin={40}
        width={400}
        height={300}
        range={{ x: [-4, 4], y: [-1, 1] }}
      />
    </>
  );
}

export default App;
