"use client";

import React, { useRef, useState, useEffect } from "react";

export default function AnalysisPage() {
  const [files, setFiles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  function handleFilesDrop(list) {
    const next = Array.from(list).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...next]);

    if (!selectedId && next.length) {
      setSelectedId(next[0].id);
    }
  }

  function onFileInput(e) {
    handleFilesDrop(e.target.files);
    e.target.value = null;
  }

  function removeImage(id) {
    setFiles((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.url);

      const next = prev.filter((p) => p.id !== id);

      if (selectedId === id) {
        setSelectedId(next.length ? next[0].id : null);
      }

      return next;
    });
  }

  async function runAnalysis() {
    if (!files.length) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const fd = new FormData();
      fd.append("file", files[0].file);

      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // 🔥 FIX: store backend response directly
      setReport(data);

      setSelectedId(files[0].id);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function downloadReportJSON() {
    if (!report) return;

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `dentalai_report.json`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      handleFilesDrop(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  const selected = files.find((f) => f.id === selectedId);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold mb-4">
          DentalAI — Analysis
        </h1>

        {/* Upload */}
        <section
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="mb-6 border-2 border-dashed p-4 rounded-lg bg-white"
        >
          <div className="flex gap-3 overflow-x-auto">

            <label
              className="min-w-[160px] h-36 flex items-center justify-center border bg-gray-50 cursor-pointer rounded"
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileInput}
                className="hidden"
              />
              Select images
            </label>

            {files.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={`relative min-w-[160px] h-36 border rounded cursor-pointer ${
                  f.id === selectedId ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <img src={f.url} className="w-full h-full object-cover" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(f.id);
                  }}
                  className="absolute top-1 right-1 bg-white px-2 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={runAnalysis}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>

            <button
              onClick={() => {
                setFiles([]);
                setReport(null);
                setSelectedId(null);
              }}
              className="px-4 py-2 border rounded"
            >
              Clear
            </button>

            <button
              onClick={downloadReportJSON}
              disabled={!report}
              className="px-4 py-2 border rounded"
            >
              Download JSON
            </button>
          </div>
        </section>

        {/* Preview */}
        <section className="bg-white p-4 border rounded">
          <h2 className="mb-2 font-semibold">Preview</h2>

          <div className="h-80 bg-gray-100 flex items-center justify-center">
            {selected ? (
              <img src={selected.url} className="h-full object-contain" />
            ) : (
              "No image selected"
            )}
          </div>
        </section>

        {/* Report */}
        <section className="bg-white p-4 border rounded mt-4">
          <h2 className="font-semibold mb-2">Report</h2>

          {!report && "No report yet"}

          {report && (
            <div className="border p-3 mt-2 flex items-center gap-4">

              {files[0] && (
                <img
                  src={files[0].url}
                  className="w-24 h-24 object-cover rounded"
                />
              )}

             <div className="flex-1">

  <div className="text-md font-semibold text-blue-600">
    {report.report?.condition}
  </div>

  <div className="text-sm mt-1">
    <b>Confidence:</b>{" "}
    {(report.confidence * 100).toFixed(2)}%
  </div>

  <div className="text-sm mt-1">
    <b>Severity:</b> {report.report?.severity}
  </div>

  <div className="text-sm mt-1">
    <b>Recommendation:</b> {report.report?.recommendation}
  </div>

  <div className="text-xs text-gray-500 mt-1">
    {report.report?.advice}
  </div>

  <div className="text-sm mt-1">
    <b>Follow-up:</b> {report.report?.follow_up}
  </div>

</div>

            </div>
          )}
        </section>

      </div>
    </main>
  );
}