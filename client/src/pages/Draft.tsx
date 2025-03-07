import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import "../quillStyles.css";
import { useNavigate } from "react-router-dom";

export default function Draft() {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        debug: "info",
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ link: "link" }],
          ],
        },
      });
    }
  }, []);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter a title before saving.");
      return;
    }

    if (!quillInstance.current) {
      console.warn("No editor instance found");
      return;
    }

    const contentDelta = quillInstance.current.getContents();

    // Check if content is empty
    const isEmpty = contentDelta.ops.length === 1 && contentDelta.ops[0].insert === "\n";
    if (isEmpty) {
      alert("Please write something before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const url = "/api/v1/blog";
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        url,
        { title, content: contentDelta.ops },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Saved successfully:", data);
      navigate("/");
    } catch (error) {
      console.error("Failed to save editor data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with subtle animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl text-gray-500 font-normal mb-4">Draft your story</h1>
          <input
            type="text"
            placeholder="Untitled..."
            className="w-full text-4xl font-bold py-4 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Editor with improved styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Custom toolbar styling will come from quillStyles.css */}
          <div ref={editorRef} className="editor-container min-h-[500px]" />
        </div>

        {/* Actions footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex gap-4">
            <button
              className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              Save draft
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>Publish</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}