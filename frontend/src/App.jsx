import { useState } from "react";

function App() {
  const [response, setResponse] = useState(null);

  const handlePing = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/ping", {
        method: "POST",
      });

      const data = await res.json();

      setResponse(data);
    } catch (err) {
      setResponse({
        err: 500,
        message: err.message,
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ping Demo</h1>

      <button onClick={handlePing}>Ping</button>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <b>err:</b> {response.err}
          </p>

          <p>
            <b>message:</b> {response.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
