import ResumeBuilder from './ResumeBuilder';
import { toast } from 'react-hot-toast';
import { resumeService } from '../services/resumeService';
import { useState } from 'react';

function CreateResume() {

  const [isGenerating, setIsGenerating] =
    useState(false);

  const handleSave = async (resumeData) => {

    try {

      setIsGenerating(true);

      toast.loading(
        'Generating your resume...'
      );

      const pdfBlob =
        await resumeService.generateResume(
          resumeData
        );

      const downloadUrl =
        window.URL.createObjectURL(
          new Blob(
            [pdfBlob],
            {
              type: 'application/pdf'
            }
          )
        );

      const link =
        document.createElement('a');

      link.href = downloadUrl;

      link.setAttribute(
        'download',
        'resume.pdf'
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );

      toast.dismiss();

      toast.success(
        'Resume generated successfully!'
      );

    } catch (err) {

      toast.dismiss();

      toast.error(
        'Failed to generate resume'
      );

      console.log(err);

    } finally {

      setIsGenerating(false);
    }
  };

  return (
  <div className="w-full max-w-[1100px] mx-auto px-4">
    <ResumeBuilder
      onSave={handleSave}
      isSaving={isGenerating}
    />
  </div>
);
}

export default CreateResume;