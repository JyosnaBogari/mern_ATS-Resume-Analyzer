import { ResumeContext } from './ResumeContext';
import { useResumeStore } from '../store/resumeStore';

function ResumeContextProvider({ children }) {
  const resumeStore = useResumeStore();

  return (
    <ResumeContext.Provider value={resumeStore}>
      {children}
    </ResumeContext.Provider>
  );
}

export default ResumeContextProvider;