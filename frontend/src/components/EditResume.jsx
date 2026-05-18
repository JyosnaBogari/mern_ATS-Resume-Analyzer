import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { resumeService } from '../services/resumeService';
import {
  cardClass,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  bodyText,
} from '../styles/common';

function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [improvedResume, setImprovedResume] = useState('');
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

  let ignore = false;

  const loadResume = async () => {

    try {

      const data =
        await resumeService.getResumeById(id);

      if (!ignore) {

        setResume(data);

        setImprovedResume(
          data.improvedResume || ''
        );

        setTemplate(
          data.template || 'modern'
        );
      }

    } catch (error) {

      console.error(error);

      toast.error(
        'Unable to load resume for editing.'
      );

      navigate('/dashboard/history');

    } finally {

      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadResume();

  return () => {
    ignore = true;
  };

}, [id, navigate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await resumeService.updateResume(id, {
        improvedResume,
        template,
      });
      setResume(updated);
      toast.success('Saved changes successfully.');
      navigate('/dashboard/history');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleSave();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className={bodyText}>Loading resume...</div>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
      <div className={cardClass}>
        <h1 className={formTitle}>Edit Resume</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className={formGroup}>
              <label className={labelClass} htmlFor="resumeId">
                Resume ID
              </label>
              <input
                id="resumeId"
                type="text"
                value={resume._id}
                disabled
                className={inputClass}
              />
            </div>
            <div className={formGroup}>
              <label className={labelClass} htmlFor="templateSelect">
                Resume Template
              </label>
              <select
                id="templateSelect"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className={inputClass}
              >
                <option value="modern">Modern</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass} htmlFor="improvedResume">
              Improved Resume Text
            </label>
            <textarea
              id="improvedResume"
              value={improvedResume}
              onChange={(e) => setImprovedResume(e.target.value)}
              className={inputClass + ' min-h-80'}
            />
            <p className="mt-2 text-sm text-[#6e6e73]">
              Edit the improved resume text directly. The downloaded PDF will reflect this content.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard/history')}
              className="inline-flex w-full sm:w-auto justify-center rounded-2xl border border-[#d5dae3] bg-white px-5 py-3 text-sm font-semibold text-[#1d1d1f] hover:bg-[#f7f8fa] transition duration-200"
            >
              Back to History
            </button>
            <button
              type="submit"
              disabled={saving}
              className={submitBtn + ' w-full sm:w-auto'}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResume;
