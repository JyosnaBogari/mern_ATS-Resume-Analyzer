
import { useForm } from "react-hook-form"
import { formCard, formTitle ,formGroup,labelClass,inputClass,submitBtn, subHeadingClass} from "../styles/common";

function UploadResume() {
// destructuring the handleSubmit,register,errors object from useForm
let {handleSubmit,register,formState:{errors}}=useForm();
const formSubmit=()=>{
    
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 ">
      <form onSubmit={handleSubmit(formSubmit)} className={formCard}>
  <h1 className={formTitle}>Upload Your Resume</h1>
  
  <div className={formGroup}>
    <label className={labelClass} htmlFor="file">Resume File</label>
    <input 
      type="file"
      id="file"
      {...register("file")}
      className={inputClass+"cursor-pointer"}
    />
  </div>
  <p><span className={subHeadingClass}>Supported File:</span>PDF,DOC</p>
  <p><span className={subHeadingClass}>Max File Sixe:</span>2MB</p>
  <button type="submit" className={submitBtn}>
    Submit
  </button>
</form>
    </div>
  )
}

export default UploadResume
