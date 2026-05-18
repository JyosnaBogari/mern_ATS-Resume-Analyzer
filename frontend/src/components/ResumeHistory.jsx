import React, {
  useState,
  useEffect,
  useContext
} from "react";

import axios from "axios";

import { ResumeContext }
  from "../contexts/ResumeContext";

import HistoryFilters
  from "./HistoryFilters";

import DownloadButton
  from "./DownloadButton";

import LoadingSpinner
  from "./LoadingSpinner";

import ErrorMessage
  from "./ErrorMessage";

import {
  cardClass,
  headingClass,
  bodyText,
  primaryBtn,
  secondaryBtn
} from "../styles/common";
import { useNavigate } from "react-router";

function ResumeHistory() {

  const {
    resumeHistory,
    fetchResumeHistory,
    loading,
    error
  } = useContext(ResumeContext);

  //use navigate
  const navigate = useNavigate();

  const [
    filteredResumes,
    setFilteredResumes
  ] = useState([]);

  const [
    deletingId,
    setDeletingId
  ] = useState(null);

  useEffect(() => {

    fetchResumeHistory();

  }, []);

  useEffect(() => {

    setFilteredResumes(resumeHistory);

  }, [resumeHistory]);

  const handleFilterChange = (filters) => {

    let filtered = [...resumeHistory];

    // Search
    if (filters.search) {

      filtered = filtered.filter(
        (resume) =>
          resume.extractedText
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            ) ||

          resume.targetRole
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            )
      );
    }

    // Sort
    filtered.sort((a, b) => {

      let aValue;
      let bValue;

      switch (filters.sortBy) {

        case "date":

          aValue = new Date(
            a.createdAt
          );

          bValue = new Date(
            b.createdAt
          );

          break;

        case "score":

          aValue = a.atsScore || 0;
          bValue = b.atsScore || 0;

          break;

        case "role":

          aValue =
            a.targetRole || "";

          bValue =
            b.targetRole || "";

          break;

        default:
          return 0;
      }

      if (
        filters.sortOrder === "asc"
      ) {

        return aValue > bValue
          ? 1
          : -1;

      } else {

        return aValue < bValue
          ? 1
          : -1;
      }
    });

    setFilteredResumes(filtered);
  };

  // ✅ DELETE FUNCTION
  const handleDelete =
    async (resumeId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this resume?"
        );

      if (!confirmDelete) return;

      try {

        setDeletingId(resumeId);

        await axios.delete(
          `http://localhost:3000/resume-api/delete/${resumeId}`,
          {
            withCredentials: true
          }
        );

        // Refresh history
        await fetchResumeHistory();

      } catch (err) {

        console.error(
          "Delete error:",
          err
        );

        alert(
          "Failed to delete resume"
        );

      } finally {

        setDeletingId(null);
      }
    };

  const formatDate = (
    dateString
  ) => {

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  };

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1
        className={
          headingClass + " mb-6"
        }
      >
        Resume History
      </h1>

      <ErrorMessage
        message={error}
      />

      <HistoryFilters
        onFilterChange={
          handleFilterChange
        }
      />

      {filteredResumes.length === 0 ? (

        <p className={bodyText}>
          No resumes found.
        </p>

      ) : (

        <div className="grid gap-4">

          {filteredResumes.map(
            (resume) => (

              <div
                key={resume._id}
                className={cardClass}
              >

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h3 className="font-semibold text-lg">
                      Resume Analysis
                    </h3>

                    <p className="text-sm text-gray-600">
                      Uploaded:
                      {" "}
                      {formatDate(
                        resume.createdAt
                      )}
                    </p>

                    <p className="text-sm text-gray-600">
                      Target Role:
                      {" "}
                      {resume.targetRole || "General"}
                    </p>

                  </div>

                  <div className="text-right">

                    <div className="text-2xl font-bold text-blue-600">
                      {resume.atsScore || 0}%
                    </div>

                    <div className="text-sm text-gray-600">
                      ATS Score
                    </div>

                  </div>

                </div>

                <p
                  className={
                    bodyText +
                    " mb-4 line-clamp-3"
                  }
                >
                  {
                    resume.extractedText
                      ?.substring(0, 200)
                  }
                  ...
                </p>

                <div className="flex gap-2 flex-wrap">

                

                  {/* ✅ VIEW IMPROVED */}
                  <button
                    onClick={() => {
                      if (!resume.improvedResume) {
                        alert("Improved resume is not available yet.");
                        return;
                      }

                      const blob = new Blob(
                        [resume.improvedResume],
                        { type: 'text/plain' }
                      );
                      const url = window.URL.createObjectURL(blob);
                      window.open(url, '_blank', 'noopener,noreferrer');
                      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                    }}
                    className={secondaryBtn + " text-sm px-3 py-1"}
                     className={primaryBtn}
                  >
                    View Original
                    
                  </button>

                  {/* ✅ DOWNLOAD IMPROVED */}
                  <DownloadButton
                    resumeId={
                      resume._id
                    }
                    fileName={`improved-resume-${resume._id}.pdf`}
                    className="text-sm px-3 py-1"
                  />

                  {/* ✅ EDIT */}
                  <button
                    onClick={() =>
                      navigate(
                        `/edit-resume/${resume._id}`
                      )
                    }
                    className={
                      secondaryBtn +
                      " text-sm px-3 py-1"
                    }
                  >
                    Edit
                  </button>
                  
                  {/* ✅ DELETE */}
                  <button
                    onClick={() =>
                      handleDelete(
                        resume._id
                      )
                    }
                    disabled={
                      deletingId ===
                      resume._id
                    }
                    className={
                      secondaryBtn +
                      " text-sm px-3 py-1"
                    }
                  >

                    {deletingId ===
                      resume._id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}
    </div>
  );
}

export default ResumeHistory;