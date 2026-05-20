import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import axios from "axios";

function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const previewRef = useRef(null);

  const [resumeText, setResumeText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [template, setTemplate] = useState("classic");
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/resume-api/resume/${id}`, {
        withCredentials: true,
      });

    const data =res.data.data ||res.data.payload?.resume ||res.data.payload ||res.data.resume ||res.data;

const text =
  location.state?.resumeText ||
  data.improvedResume ||
  data.extractedText ||
  data.originalResume ||
  data.resumeText ||
  "";

setResumeText(text);
setOriginalText(text);
setTemplate(location.state?.template || data.template || "classic");
    } catch (err) {
      console.error("Fetch resume error:", err);
      alert("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    try {
      setSaving(true);

      await axios.put(
        `http://localhost:3000/resume-api/resume/${id}`,
        {
          improvedResume: resumeText,
          template,
        },
        { withCredentials: true }
      );

      alert("Resume saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  //download PDF
  const downloadPDF = async () => {
  try {
    setDownloading(true);

    await axios.put(
      `http://localhost:3000/resume-api/resume/${id}`,
      {
        improvedResume: resumeText,
        extractedText: resumeText,
        originalResume: resumeText,
        template,
      },
      { withCredentials: true }
    );

    const response = await axios.get(
      `http://localhost:3000/resume-api/download/${id}`,
      {
        responseType: "blob",
        withCredentials: true,
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err.response?.data || err.message);
    alert("Failed to download resume");
  } finally {
    setDownloading(false);
  }
};

  const structuredResume = useMemo(() => {
    return parseResumeText(resumeText);
  }, [resumeText]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1d] flex items-center justify-center text-white">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d1d] text-white flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen z-40 bg-[#0d1426] border-r border-white/10 p-5 transition-all duration-300
        ${sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <h2 className="text-xs tracking-[0.4em] text-blue-300">
              NAVIGATION
            </h2>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-2xl border border-white/10 px-3 py-2 text-white hover:bg-white/10"
          >
            ☰
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab("editor")}
            className={`group relative rounded-2xl px-4 py-3 text-left font-semibold transition ${activeTab === "editor"
              ? "bg-blue-600 text-white"
              : "text-blue-100 hover:bg-white/10"
              }`}
          >
            {sidebarOpen ? "Edit Content" : "✎"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Edit
              </span>
            )}
          </button>
          {/* preview */}
          <button
            onClick={() => setActiveTab("preview")}
            className={`group relative rounded-2xl px-4 py-3 text-left font-semibold transition ${activeTab === "preview"
              ? "bg-blue-600 text-white"
              : "text-blue-100 hover:bg-white/10"
              }`}
          >
            {sidebarOpen ? "Preview" : "👁"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Preview
              </span>
            )}
          </button>
          {/* template */}
          <button
            onClick={() => setActiveTab("template")}
            className={`group relative rounded-2xl px-4 py-3 text-left font-semibold transition ${activeTab === "template"
              ? "bg-blue-600 text-white"
              : "text-blue-100 hover:bg-white/10"
              }`}
          >
            {sidebarOpen ? "Template" : "▣"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Template
              </span>
            )}
          </button>

          <button
            onClick={saveResume}
            disabled={saving}
            title="Save"
            className="group relative rounded-2xl px-4 py-3 font-semibold bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-60"
          >
            {sidebarOpen ? (saving ? "Saving..." : "Save") : "💾"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Save
              </span>
            )}
          </button>

          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="group relative rounded-2xl px-4 py-3 text-left font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {sidebarOpen ? (downloading ? "Downloading..." : "Download") : "⬇"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Download
              </span>
            )}
          </button>

          <div className="border-t border-white/10 my-4" />

          <button
            onClick={() => navigate("/dashboard/history")}
            className="group relative rounded-2xl px-4 py-3 text-left border border-white/10 hover:bg-white/10 transition"
          >
            {sidebarOpen ? "Back to History" : "←"}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                Back to History
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 h-screen overflow-y-auto p-4 lg:p-6">
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">


          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-white/10 px-4 py-2 rounded-xl"
            >
              ☰ Menu
            </button>
          </div>
        </div>

        {/* Layout */}
        <div
  className={`grid grid-cols-1 gap-6 h-[calc(100vh-120px)] ${
    activeTab === "preview"
      ? "xl:grid-cols-1"
      : "xl:grid-cols-[0.85fr_1.15fr]"
  }`}
>
          {/* Editor Section */}
          <section
            className={`bg-[#10182b] border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col ${activeTab === "editor" || activeTab === "template" ? "block" : "hidden"
              }`}
          >
            <div className="border-b border-white/10 p-5">
              <h2 className="text-xl font-bold">
                {activeTab === "template" ? "Choose Template" : "Edit Content"}
              </h2>
              <p className="text-blue-200 text-sm">
                Edit resume content and select template style.
              </p>
            </div>

            {activeTab === "template" ? (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["classic", "modern", "minimal"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setTemplate(item)}
                    className={`rounded-2xl border p-5 text-left capitalize transition ${template === item
                      ? "border-blue-500 bg-blue-600/20"
                      : "border-white/10 bg-[#0d1426] hover:bg-white/10"
                      }`}
                  >
                    <h3 className="font-bold text-lg">{item}</h3>
                    <p className="text-sm text-blue-200 mt-2">
                      {item === "classic" &&
                        "Clean ATS-friendly professional format."}
                      {item === "modern" &&
                        "Two-column modern resume layout."}
                      {item === "minimal" &&
                        "Simple elegant minimal resume style."}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-5 flex-1 min-h-0">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-[70vh] resize-none rounded-2xl bg-[#0b1222] border border-white/10 p-5 text-white leading-8 outline-none focus:border-blue-500"
                  placeholder="Edit your resume content here..."
                />
              </div>
            )}
          </section>

          {/* Preview Section */}
          {/* Preview Section */}
          <section
            className={`bg-[#10182b] border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col ${activeTab === "preview" || activeTab === "editor" || activeTab === "template"
                ? "block"
                : "hidden"
              }`}
          >
            <div className="border-b border-white/10 p-5">
              <h2 className="text-xl font-bold">A4 Resume Preview</h2>
            </div>
<div className="flex-1 min-h-0 overflow-hidden">
  <div className="h-full w-full overflow-auto flex justify-center items-start p-6">
    <ResumePreview
      refEl={previewRef}
      data={structuredResume}
      rawText={resumeText}
      template={template}
    />
  </div>
</div>
          </section>
        </div>
      </main>
    </div>
  );
}

function parseResumeText(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {
    contact: [],
    summary: [],
    skills: [],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    coursework: [],
  };

  const sectionMap = {
    SUMMARY: "summary",
    "PROFESSIONAL SUMMARY": "summary",
    SKILLS: "skills",
    PROJECTS: "projects",
    EDUCATION: "education",
    CERTIFICATIONS: "certifications",
    CERTIFICATION: "certifications",
    ACHIEVEMENTS: "achievements",
    ACHIEVEMENT: "achievements",
    LANGUAGES: "languages",
    LANGUAGE: "languages",
    COURSEWORK: "coursework",
  };

  let current = "contact";

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (sectionMap[upper]) {
      current = sectionMap[upper];
      continue;
    }

    sections[current].push(line);
  }

  return sections;
}

function ResumePreview({ refEl, data, rawText, template }) {
  if (template === "modern") {
    return <ModernTemplate refEl={refEl} data={data} />;
  }

  if (template === "minimal") {
    return <MinimalTemplate refEl={refEl} data={data} />;
  }

  return <ClassicTemplate refEl={refEl} data={data} />;
}

function ClassicTemplate({ refEl, data }) {
  return (
    <div
      ref={refEl}
    className="bg-white text-black w-[900px] min-h-[1200px] p-12 font-serif leading-relaxed shadow-xl"
    >
      <Header data={data} center />

      <ResumeSection title="Professional Summary" items={data.summary} paragraph />
      <ResumeSection title="Skills" items={data.skills} inline />
      <ResumeSection title="Projects" items={data.projects} />
      <ResumeSection title="Education" items={data.education} />
      <ResumeSection title="Certifications" items={data.certifications} />
      <ResumeSection title="Achievements" items={data.achievements} />
      <ResumeSection title="Coursework" items={data.coursework} inline />
      <ResumeSection title="Languages" items={data.languages} inline />
    </div>
  );
}

function ModernTemplate({ refEl, data }) {
  return (
    <div
      ref={refEl}
className="bg-white text-black w-[900px] min-h-[1200px] grid grid-cols-[280px_1fr] font-sans shadow-xl"
    >
      <aside className="bg-[#172554] text-white p-8">
        <Header data={data} dark />
        <ResumeSection title="Skills" items={data.skills} inline dark />
        <ResumeSection title="Coursework" items={data.coursework} dark />
        <ResumeSection title="Languages" items={data.languages} dark />
      </aside>

      <main className="p-8">
        <ResumeSection title="Professional Summary" items={data.summary} paragraph />
        <ResumeSection title="Projects" items={data.projects} />
        <ResumeSection title="Education" items={data.education} />
        <ResumeSection title="Certifications" items={data.certifications} />
        <ResumeSection title="Achievements" items={data.achievements} />
      </main>
    </div>
  );
}

function MinimalTemplate({ refEl, data }) {
  return (
    <div
      ref={refEl}
     className="bg-white text-black w-[900px] min-h-[1200px] p-14 font-sans shadow-xl"
    >
      <Header data={data} center />

      <div className="border-t-2 border-black mt-4 pt-4">
        <ResumeSection title="Summary" items={data.summary} paragraph />
        <ResumeSection title="Skills" items={data.skills} inline />
        <ResumeSection title="Projects" items={data.projects} />
        <ResumeSection title="Education" items={data.education} />
        <ResumeSection title="Certifications" items={data.certifications} />
        <ResumeSection title="Achievements" items={data.achievements} />
        <ResumeSection title="Languages" items={data.languages} inline />
      </div>
    </div>
  );
}

function Header({ data, center = false, dark = false }) {
  const contact = data.contact || [];

  const name =
    contact.find((x) => /^[A-Z ]{5,}$/.test(x)) ||
    contact[0] ||
    "YOUR NAME";

  const other = contact.filter((x) => x !== name);

  return (
    <header className={`${center ? "text-center" : ""} mb-6`}>
      <h1 className="text-2xl font-bold tracking-wide uppercase">{name}</h1>

      <div
        className={`text-sm mt-2 space-y-1 ${dark ? "text-blue-100" : "text-gray-700"
          }`}
      >
        {other.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </header>
  );
}

function ResumeSection({ title, items, paragraph, inline, dark }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-5">
      <h2
        className={`text-sm font-bold uppercase tracking-widest border-b pb-1 mb-2 ${dark ? "border-blue-200 text-white" : "border-black text-black"
          }`}
      >
        {title}
      </h2>

      {paragraph ? (
        <p className={`text-sm leading-7 ${dark ? "text-blue-50" : "text-gray-800"}`}>
          {items.join(" ")}
        </p>
      ) : inline ? (
        <p className={`text-sm leading-7 ${dark ? "text-blue-50" : "text-gray-800"}`}>
          {items.join(" • ")}
        </p>
      ) : (
        <ul className="list-disc ml-5 space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              className={`text-sm leading-6 ${dark ? "text-blue-50" : "text-gray-800"
                }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EditResume;