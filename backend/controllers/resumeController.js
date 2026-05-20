import { generateImprovedResume } from '../utils/resumeGenerator.js';

export const generateResume = async (
  req,
  res
) => {
  try {
    await generateImprovedResume(req.body, res);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).send({
        message: 'Resume generation failed'
      });
    }
  }
};