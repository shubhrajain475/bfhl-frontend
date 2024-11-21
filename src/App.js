import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleSubmit = async () => {
    try {
      const payload = JSON.parse(jsonInput);  // Parse the JSON input

      // Send POST request to backend
      const response = await axios.post("https://bfhl-backend-l0p7.onrender.com/bfhl", payload);
      setResponseData(response.data);
      setError(null);  // Clear any previous errors
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format. Please check your input.");
      } else if (err.response) {
        setError(`Server Error: ${err.response.status} - ${err.response.data.message || err.message}`);
      } else {
        setError("Server Error or Network Issue. Please try again.");
      }
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    // Filter response data based on selected options
    const filteredData = selectedOptions.map((opt) => ({
      key: opt.value,
      value: responseData[opt.value] || [],
    }));

    return (
      <div>
        <h3>Response:</h3>
        <div><strong>User ID:</strong> {responseData.user_id}</div>
        <div><strong>Email:</strong> {responseData.email}</div>
        <div><strong>Roll Number:</strong> {responseData.roll_number}</div>
        {filteredData.map((item) => (
          <div key={item.key}>
            <strong>{item.key}:</strong> {JSON.stringify(item.value)}
          </div>
        ))}
        <div><strong>Prime Found:</strong> {responseData.is_prime_found ? "Yes" : "No"}</div>
        <div><strong>File Valid:</strong> {responseData.file_valid ? "Yes" : "No"}</div>
        <div><strong>File MIME Type:</strong> {responseData.file_mime_type || "Not provided"}</div>
        <div><strong>File Size (KB):</strong> {responseData.file_size_kb || "Not provided"}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ABCD123</h1>
      <textarea
        rows="5"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder='Enter JSON e.g., {"data": ["A", "1", "z"]}'
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button onClick={handleSubmit} style={{ marginBottom: "10px" }}>
        Submit
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Select
        options={options}
        isMulti
        onChange={setSelectedOptions}
        placeholder="Select filters"
      />
      {renderResponse()}
    </div>
  );
}

export default App;
