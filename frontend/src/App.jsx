import React, { useState } from "react";
import { uploadPdf, summarizeText } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [rawText, setRawText] = useState("");
  const [selectedSection, setSelectedSection] = useState("full");
  const [loading, setLoading] = useState(false);
  const [baselineSummary, setBaselineSummary] = useState("");
  const [cotSummary, setCotSummary] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setBaselineSummary("");
    setCotSummary("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    try {
      const data = await uploadPdf(file);
      setSections(data.sections || []);
      setRawText(data.text_preview || "");
      setSelectedSection(data.sections?.[0] || "full");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload or parse PDF.");
    }
  };

  const generateSummary = async (use_cot) => {
    if (!rawText) {
      setError("No text available. Upload and parse a PDF first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await summarizeText({
        text: rawText,
        use_cot,
        section_name: selectedSection,
      });

      if (use_cot) {
        setCotSummary(res.summary.text || res.summary);
      } else {
        setBaselineSummary(res.summary.text || res.summary);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "90%" }}>
      <h1 className="text-center mb-1">AI Research Assistant</h1>
      <p
        className="text-center text-muted mb-1"
        style={{ fontSize: "0.95rem" }}
      >
        Longho Bernard Che &mdash; lo476158@ucf.edu <br />
        University of Central Florida &mdash; Autum 2025
      </p>
      {/* Course Title */}
      <p
        className="text-center text-secondary mb-4"
        style={{ fontSize: "0.95rem" }}
      >
        CAP5610 &mdash; Machine Learning (Course Project) <br />
        Document Summarization with Chain-of-Thought Prompting <br />
        Download the code on GitHub:
        <a href="https://github.com/blongho/cap5610-project">
          @blongho/blongho/cap5610-project
        </a>
      </p>
      {/* Thin Divider */}
      <div
        className="mx-auto mb-3"
        style={{ width: "140px", borderBottom: "1px solid #ccc" }}
      ></div>
      <div className="alert alert-secondary">
        Upload a PDF research paper and generate two summaries: a Baseline
        summary and a Chain-of-Thought (CoT) summary. Compare them side-by-side.
      </div>
      {/* Upload Section */}
      <div className="card p-4 mb-4">
        <h5>Upload PDF</h5>
        <input
          type="file"
          className="form-control mb-3"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload & Parse
        </button>
      </div>
      {/* Section Select */}
      {sections.length > 0 && (
        <div className="card p-4 mb-4">
          <h5>Select Section</h5>
          <select
            className="form-select"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Text Preview */}
      {rawText && (
        <div className="card p-4 mb-4">
          <h5>Text Preview</h5>
          <pre
            className="border p-3 bg-light"
            style={{
              maxHeight: "250px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {rawText}
          </pre>
        </div>
      )}

      {/* Summary Buttons */}
      <div className="text-center mb-4">
        <button
          className="btn btn-outline-dark me-2"
          onClick={() => generateSummary(false)}
          disabled={loading}
        >
          Generate Baseline Summary
        </button>
        <button
          className="btn btn-warning"
          onClick={() => generateSummary(true)}
          disabled={loading}
        >
          Generate CoT Summary
        </button>

        {loading && <p className="mt-3 text-info">Generating summary...</p>}
        {error && <p className="mt-3 text-danger">{error}</p>}
      </div>
      {/* Summaries Comparison */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="text-center">Baseline Summary</h5>
            <div
              className="border p-3 bg-light"
              style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
            >
              {baselineSummary || "No baseline summary yet."}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="text-center">Chain-of-Thought Summary</h5>
            <div
              className="border p-3 bg-light"
              style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
            >
              {cotSummary || "No CoT summary yet."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
