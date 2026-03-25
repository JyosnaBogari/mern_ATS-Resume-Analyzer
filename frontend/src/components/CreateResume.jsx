
import ResumeBuilder from './ResumeBuilder';
import { toast } from 'react-hot-toast';

function CreateResume() {
  const handleSave = (resumeData) => {
    // Here you would typically send the data to the backend to generate a PDF
    console.log('Resume data:', resumeData);
    toast.success('Resume data saved! PDF generation would happen here.');
    // TODO: Implement PDF generation and download
  };

  return <ResumeBuilder onSave={handleSave} />;
}

export default CreateResume;
