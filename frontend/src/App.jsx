import React, { useState } from "react";
import { uploadPdf, summarizeText, evaluateSummary } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [rawText, setRawText] = useState("");
  const [selectedSection, setSelectedSection] = useState("full");
  const [loading, setLoading] = useState(false);
  const [baselineSummary, setBaselineSummary] = useState("");
  const [cotSummary, setCotSummary] = useState("");
  const [error, setError] = useState("");

  // Evaluation state
  const [evalResults, setEvalResults] = useState(null); // { baseline_vs_cot, cot_vs_baseline }
  const [showEval, setShowEval] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setBaselineSummary("");
    setCotSummary("");
    setEvalResults(null);
    setShowEval(false);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setEvalResults(null);
    setShowEval(false);

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

  // Manual individual summary generation (still available)
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

      const summaryText = res.summary?.text || res.summary || "";
      if (use_cot) {
        setCotSummary(summaryText);
      } else {
        setBaselineSummary(summaryText);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  // New: Full evaluation flow (Option C: both directions)
  const handleEvaluate = async () => {
    if (!rawText) {
      setError("No text available. Upload and parse a PDF first.");
      return;
    }

    setError("");
    setLoading(true);
    setEvalResults(null);
    setShowEval(false);

    try {
      // 1) Generate both summaries
      const [baselineRes, cotRes] = await Promise.all([
        summarizeText({
          text: rawText,
          use_cot: false,
          section_name: selectedSection,
        }),
        summarizeText({
          text: rawText,
          use_cot: true,
          section_name: selectedSection,
        }),
      ]);

      const baseline = baselineRes.summary?.text || baselineRes.summary || "";
      const cot = cotRes.summary?.text || cotRes.summary || "";

      setBaselineSummary(baseline);
      setCotSummary(cot);

      // 2) Evaluate both directions: baseline->cot and cot->baseline
      const [baselineVsCot, cotVsBaseline] = await Promise.all([
        evaluateSummary({
          system_summary: baseline,
          reference_summary: cot,
          label: "baseline_vs_cot",
        }),
        evaluateSummary({
          system_summary: cot,
          reference_summary: baseline,
          label: "cot_vs_baseline",
        }),
      ]);

      setEvalResults({
        baseline_vs_cot: baselineVsCot,
        cot_vs_baseline: cotVsBaseline,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to run evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowEval = () => {
    if (!evalResults) return;
    setShowEval((prev) => !prev);
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
        Download the code on GitHub:{" "}
        <a href="https://github.com/blongho/cap5610-project">
          @blongho/cap5610-project
        </a>
      </p>
      {/* Thin Divider */}
      <div
        className="mx-auto mb-3"
        style={{ width: "140px", borderBottom: "1px solid #ccc" }}
      ></div>

      <div className="alert alert-secondary">
        Upload a PDF research paper and generate two summaries: a Baseline
        summary and a Chain-of-Thought (CoT) summary. Compare them side-by-side,
        and optionally run automatic ROUGE/BLEU evaluation.
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
          className="btn btn-primary me-2"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload & Parse
        </button>
        <button
          className="btn btn-outline-success"
          onClick={handleEvaluate}
          disabled={loading || !rawText}
        >
          {loading ? "Running evaluation..." : "Evaluate Baseline vs CoT"}
        </button>
        {error && <p className="mt-3 text-danger">{error}</p>}
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

      {/* Summary Buttons (manual triggers still available) */}
      <div className="text-center mb-4">
        <button
          className="btn btn-outline-dark me-2"
          onClick={() => generateSummary(false)}
          disabled={loading || !rawText}
        >
          Generate Baseline Summary
        </button>
        <button
          className="btn btn-warning"
          onClick={() => generateSummary(true)}
          disabled={loading || !rawText}
        >
          Generate CoT Summary
        </button>

        {loading && (
          <p className="mt-3 text-info">
            Processing... This may take a few seconds.
          </p>
        )}
      </div>

      {/* Summaries Comparison */}
      <div className="row g-4 mb-4">
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

      {/* Evaluation Results Toggle */}
      {evalResults && (
        <div className="text-center mb-3">
          <button className="btn btn-info" onClick={toggleShowEval}>
            {showEval ? "Hide Evaluation Results" : "See Evaluation Results"}
          </button>
        </div>
      )}

      {/* Evaluation Results */}
      {showEval && evalResults && (
        <div className="card p-4">
          <h4 className="mb-3 text-center">
            Evaluation Results (ROUGE & BLEU)
          </h4>
          <div className="row g-4">
            <div className="col-md-6">
              <h5>Baseline vs CoT (system: Baseline, reference: CoT)</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>ROUGE-1:</strong>{" "}
                  {evalResults.baseline_vs_cot.rouge.rouge1.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>ROUGE-2:</strong>{" "}
                  {evalResults.baseline_vs_cot.rouge.rouge2.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>ROUGE-L:</strong>{" "}
                  {evalResults.baseline_vs_cot.rouge.rougeL.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>BLEU:</strong>{" "}
                  {evalResults.baseline_vs_cot.bleu.toFixed(2)}
                </li>
              </ul>
            </div>

            <div className="col-md-6">
              <h5>CoT vs Baseline (system: CoT, reference: Baseline)</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>ROUGE-1:</strong>{" "}
                  {evalResults.cot_vs_baseline.rouge.rouge1.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>ROUGE-2:</strong>{" "}
                  {evalResults.cot_vs_baseline.rouge.rouge2.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>ROUGE-L:</strong>{" "}
                  {evalResults.cot_vs_baseline.rouge.rougeL.toFixed(4)}
                </li>
                <li className="list-group-item">
                  <strong>BLEU:</strong>{" "}
                  {evalResults.cot_vs_baseline.bleu.toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
