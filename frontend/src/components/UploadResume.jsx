import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function UploadResume() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const formSubmit = async (data) => {
    const file = data.file[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, and DOCX files are supported.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Please upload a file smaller than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/resume-api/upload",
        formData,
        { withCredentials: true }
      );

      setError(null);
      setSuccess("Resume uploaded successfully. Check your dashboard for results.");
      console.log("Success:", res.data);
    } catch (err) {
      setSuccess(null);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-slate-900 via-slate-950 to-transparent opacity-80" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-sky-200 ring-1 ring-sky-500/20">
                AI Resume Builder
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Build a recruiter-ready resume with smart ATS optimization.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  ATS Resume Checker combines document upload, AI analysis, and polished templates to transform your resume into a compelling, applicant-tracking-friendly profile.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Instant feedback</p>
                  <p className="mt-3 text-sm text-slate-300">Get immediate resume scoring and targeted improvement suggestions.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Premium export</p>
                  <p className="mt-3 text-sm text-slate-300">Download a polished PDF with improved structure, content, and style.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Smart templates</p>
                  <p className="mt-3 text-sm text-slate-300">Choose from modern resume templates built for recruiters and ATS systems.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Easy workflow</p>
                  <p className="mt-3 text-sm text-slate-300">Upload, analyze, and download with a few clicks on a clean, responsive interface.</p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="mb-6 rounded-3xl bg-slate-800/80 px-5 py-6 text-slate-100 shadow-inner shadow-slate-950/30">
                <h2 className="text-xl font-semibold">Start with your resume</h2>
                <p className="mt-2 text-sm text-slate-300">Upload your file and get AI-driven improvement recommendations instantly.</p>
              </div>

              <form onSubmit={handleSubmit(formSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    {success}
                  </div>
                )}

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-200">Choose resume file</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    {...register("file", { required: true })}
                    className="w-full cursor-pointer rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-sm shadow-slate-950/30 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:text-white"
                  />
                  {errors.file && (
                    <p className="mt-2 text-sm text-red-300">Please choose a valid resume file.</p>
                  )}
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">Upload details</p>
                  <p>Supported file types: PDF, DOC, DOCX</p>
                  <p>Max size: 2MB</p>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:scale-[1.01]"
                >
                  Upload & Analyze
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:border-slate-500 hover:text-white"
                >
                  Sign In to Create Resume
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">About this project</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                ATS Resume Checker is built to help you present experience clearly and land interviews.
              </h2>
              <p className="mt-6 max-w-xl text-slate-300">
                This tool analyzes resume content, improves wording, and exports a polished PDF layout so your resume performs better in ATS systems and stands out to hiring managers.
              </p>
            </div>
            <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
              <div>
                <h3 className="text-lg font-semibold text-white">How it works</h3>
                <p className="mt-3 text-slate-300">Upload your resume, receive AI-driven feedback, and choose a polished template to generate the final version.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Step 1</p>
                  <p className="mt-2 text-sm text-slate-300">Upload your file and select the target role.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Step 2</p>
                  <p className="mt-2 text-sm text-slate-300">AI reviews structure, keywords, and formatting.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Step 3</p>
                  <p className="mt-2 text-sm text-slate-300">Download the improved resume or create a fresh document.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Step 4</p>
                  <p className="mt-2 text-sm text-slate-300">Use it to apply with confidence and get noticed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UploadResume;
