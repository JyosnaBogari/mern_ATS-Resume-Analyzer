import axios from 'axios';

const API =
  'http://localhost:3000/resume-api';

export const resumeService = {

  generateResume: async (resumeData) => {

    const response =
      await axios.post(
        `${API}/generate`,
        resumeData,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );

    return response.data;
  }
};