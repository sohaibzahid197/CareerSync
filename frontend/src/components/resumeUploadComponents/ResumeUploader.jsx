'use client'
// Import necessary components
import React, {useState} from 'react';
import {BackgroundGradient} from "@/components/ui/background-gradient";
import {MdInsertDriveFile, MdOutlineCloudUpload, MdOutlineUploadFile} from "react-icons/md";
import {PiSignInBold} from "react-icons/pi";
import {ReloadIcon} from "@radix-ui/react-icons"
import {AppContext, useAppContext} from "@/Context/Candidate_Employer_Data";
import {useRouter} from "next/navigation";
import {ImSpinner2} from "react-icons/im";
import {CgSpinner} from "react-icons/cg";
import DynamicAlert from "@/components/ui/DynamicAlert";
import {HOST} from "@/lib/utils";


function ResumeUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const allowedFormats = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const {setCandidateData, candidate} = useAppContext();
    const router = useRouter();
    const handleDragEnter = (e) => {
        e.preventDefault(); // Prevent default browser behavior
    };

    const handleDragLeave = () => {
        // No specific action needed for drag leave in this case
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0]; // Get the first file
        if (file) {
            setSelectedFile(file);
            setErrorMessage('');
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file && !allowedFormats.includes(file.type)) {
            setErrorMessage('Invalid file format. Only PDF, DOC, PNG, and JPEG are allowed.');
            setSelectedFile(null); // Clear selection for invalid format
        } else {
            setErrorMessage('');
            setSelectedFile(file);
        }
    };

    const ATSscanner = async () =>{
        const formData = new FormData();
        formData.append('wait', 'true');
        formData.append('file', selectedFile);
        formData.append('workspace', 'FJvoemOB');

        const url = 'https://api.affinda.com/v3/documents';
        const options = {
            method: 'POST', headers: {
                accept: 'application/json', authorization: 'Bearer aff_e57330de9159cafd151e1ab2f3d7e73d7947f327' // Replace with your authorization token
            }, body: formData
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const {data} = await response.json();
        console.log('Upload successful:', data);

        const skillNames = data.skills.map(skill => skill.name ? skill.name : null);
        const workExperiences = data.workExperience.map(exp => ({
            title: exp.jobTitle ? exp.jobTitle : null,
            companyName: exp.organization ? exp.organization : null,
            location: exp.location ? exp.location.formatted : null,
            duration: exp.dates ? `${exp.dates.startDate} - ${exp.dates.endDate}` : null,
            description: exp.jobDescription ? exp.jobDescription : null
        }));

        const education = data.education ? data.education.map(edu => ({
            degree: edu.accreditation ? edu.accreditation.inputStr : null,
            universityName: edu.organization ? edu.organization : null,
            location: edu.location ? edu.location.formatted : null,
            duration: edu.dates ? `${edu.dates.startDate ? new Date(edu.dates.startDate).toLocaleDateString() : ''} - ${edu.dates.completionDate ? new Date(edu.dates.completionDate).toLocaleDateString() : (edu.dates.isCurrent ? 'Present' : '')}` : null,
            description: edu.grade ? `Grade: ${edu.grade.raw || ''}` : null
        })) : null;

        setCandidateData({
            fullName: data.name ? data.name.raw : null,
            email: data.emails ? data.emails[0] : null,
            preferredJobLocation: data.location ? data.location.formatted : null,
            phone: data.phoneNumbers ? data.phoneNumbers[0] : null,
            skills: skillNames,
            workExperiences: workExperiences,
            education: education
        })

    }

    async function storeCompleteData(candidateId, size, contentType, protectedUrl) {
        try {
            const response = await fetch(`${HOST}/candidate/uploadResume`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ candidateId, size, contentType, protectedUrl }),
            });
            const data = await response.json();

            if (data.error) {
                setShowAlert(true);
                setTitle("Error");
                setAlertMessage(data.error);
                setIsLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                }, 7000);
                return "error";
            } else {
                setShowAlert(true);
                setTitle("Success");
                setAlertMessage(data.message);
                setIsLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
                return "success";
            }
        } catch (error) {
            setShowAlert(true);
            setTitle("Error");
            setAlertMessage(error.message);
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            return "error";
        }
    }

    const handleFileSubmission = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!selectedFile) {
            setShowAlert(true);
            setAlertMessage("Please Select a File First!");
            setTitle("Warning");
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            return null;
        }
        try {
            let resume = new FormData();
            resume.append("file", selectedFile);
            resume.append("upload_preset", "careersync");
            resume.append("cloud_name", "dy5yzo1ji");
            await fetch("https://api.cloudinary.com/v1_1/dy5yzo1ji/upload", {
                method: "POST",
                body: resume
            })
                .then((response) => response.json())
                .then(async (data) => {
                    setErrorMessage('');
                    const message = await storeCompleteData(candidate.id, data.bytes, data.format, data.secure_url);
                    if (message === "success") {
                        await ATSscanner();
                        await router.push("/candidate/profile");
                        setSelectedFile(null);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    setShowAlert(true);
                    setTitle("Error");
                    setAlertMessage(error.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 7000);
                });
        } catch (error) {
            setShowAlert(true);
            setTitle("Error");
            setAlertMessage(error.message);
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
        }
    };
    return (<BackgroundGradient
        className="rounded-3xl flex justify-center items-center p-4 h-full w-[80vw] md:w-[40vw] lg:w-[30vw] bg-slate-950">
        {showAlert && <DynamicAlert title={title} alertMessage={alertMessage}/> }
        <div
            className={`bg-transparent text-center rounded w-full px-3 flex flex-col items-center justify-center cursor-pointer mx-auto ${selectedFile ? 'border-2 border-slate-200 border-dashed rounded-xl' : ''}`}
            onDragOver={(e) => e.preventDefault()} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <div className="py-6 flex w-full flex-col justify-center items-center gap-3 ">
                {selectedFile ? (<MdInsertDriveFile className='text-slate-50' size={50}/> // Display selected file icon
                ) : (<MdOutlineCloudUpload className='text-slate-50' size={50}/> // Display upload icon
                )}
                {selectedFile ? (<div>
                        <p className="text-slate-300 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>) :
                    <h4 className="text-base font-semibold text-slate-50">Drag and drop or select a resume</h4>}
            </div>
            <hr className="w-full border-slate-100 my-2"/>
            <div className="py-6 w-full">
                {selectedFile ? (<div className='flex flex-col justify-center items-center gap-3'>
                        <input type="file" id="uploadFile1" className="hidden" onChange={handleFileInputChange}
                               accept={allowedFormats.join(',')}/>
                        <label htmlFor="uploadFile1"
                               className="bg-slate-900 text-[1rem] w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50">
                            Replace File
                            <MdOutlineUploadFile size={20}/>
                        </label>
                        <button
                            className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            onClick={handleFileSubmission} disabled={isLoading}
                        >
                            {isLoading ? <div className='flex gap-1 justify-center items-center'>
                                <ImSpinner2 className="mr-2 w-5 h-5 animate-spin"/>
                                Please wait
                            </div> : <div className='flex gap-1 justify-center items-center'>
                                Submit
                                <PiSignInBold size={20}/>
                            </div>}
                        </button>

                    </div>

                ) : (<div>
                    <input type="file" id="uploadFile1" className="hidden" onChange={handleFileInputChange}
                           accept={allowedFormats.join(',')}/>
                    <label htmlFor="uploadFile1"
                           className="bg-slate-50 text-[1rem] font-medium flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50">
                        Upload Resume
                        <MdOutlineUploadFile size={20}/>
                    </label>
                    {errorMessage ? (<p className="text-xs text-red-500 mt-2">{errorMessage}</p>) : (
                        <p className="text-xs text-gray-400 mt-4">PDF, DOC, PNG, and JPEG are Allowed.</p>)}
                </div>)}


            </div>
        </div>
    </BackgroundGradient>);
}

export default ResumeUploader;
