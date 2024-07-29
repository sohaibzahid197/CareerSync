"use client";

import React, {useState, useEffect} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {MdDelete, MdSave, MdAdd} from "react-icons/md";
import {ImSpinner2} from "react-icons/im";
import {Label} from "@/components/ui/label";
import {useAppContext} from "@/Context/Candidate_Employer_Data";
import {cn} from "@/lib/utils";
import {PiSignInBold} from "react-icons/pi";
import {GoProjectSymlink} from "react-icons/go";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import { FaGithub, FaLink  } from "react-icons/fa";
import DynamicAlert from "@/components/ui/DynamicAlert";


function CandidatePortfolio() {
    const [project, setProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [title, setTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const {candidate} = useAppContext();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProject({...project, [name]: value});
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProject({...project, thumbnailUrl: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    const addNewProject = () => {
        setProject({
            thumbnailUrl: "",
            projectName: "",
            projectType: "",
            projectDescription: "",
            repoUrl: "",
            liveUrl: ""
        });
    };

    async function saveCurrentProject() {
        if (!project) {
            setShowAlert(true);
            setAlertMessage(`No project to save`);
            setTitle("Error");
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const {projectName, projectType, projectDescription, repoUrl, liveUrl, thumbnailUrl} = project;

        if (!projectName || !projectType || !projectDescription || !repoUrl || !liveUrl) {
            setShowAlert(true);
            setAlertMessage(`All fields are required to save the project`);
            setTitle("Error");
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsLoading(true);

        try {
            let uploadedImageUrl = thumbnailUrl;

            if (thumbnailUrl && typeof thumbnailUrl === "object") {
                const formData = new FormData();
                formData.append("file", thumbnailUrl);
                formData.append("upload_preset", "careersync");
                formData.append("cloud_name", "dy5yzo1ji");

                const response = await fetch("https://api.cloudinary.com/v1_1/dy5yzo1ji/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    setShowAlert(true);
                    setAlertMessage(`Failed to upload image. Please try again later`);
                    setTitle("Error");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const data = await response.json();
                uploadedImageUrl = data.secure_url;
            }

            const updatedProject = {...project, thumbnailUrl: uploadedImageUrl};

            const submitResponse = await fetch(`http://localhost:3001/candidate/setProjects/${candidate.id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({projects: [updatedProject]}),
            });

            if (!submitResponse.ok) {
                setShowAlert(true);
                setAlertMessage(`Failed to save project. Please try again later`);
                setTitle("Error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const result = await submitResponse.json();
            setShowAlert(true);
            setAlertMessage(`Project submitted successfully: ${result.message}`);
            setTitle("Success");
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            setProjects([...projects, updatedProject]);
            setProject(null);

        } catch (error) {
            setShowAlert(true);
            setAlertMessage(`Failed to save project. Please try again later: ${error.message}`);
            setTitle("Error");
            setTimeout(() => {
                setShowAlert(false);
            }, 4000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    }


    const deleteProject = async (projectId, index) => {

        try {
            const response = await fetch(`http://localhost:3001/candidate/deleteProject/${candidate.id}/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the project');
            }

            const updatedProjects = projects.filter((_, i) => i !== index);
            setProjects(updatedProjects);

            console.log('Project deleted successfully');
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };


    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/candidate/getProjects/660a89b1c16089e0e1433a6b`);
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();

                if (Array.isArray(data.data) && data.data.length > 0) {
                    setProjects(data.data[0].projects);
                } else {
                    console.error("Received data is not in the expected format:", data);
                    setProjects([]);
                }

            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProjects();
    }, []);
    console.log("Rendering projects:", projects);

    return (
        <>
            {showAlert && (
                <DynamicAlert title={title} alertMessage={alertMessage} />
            )}
            <div className="p-5 w-full">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Candidate Portfolio</h2>
                <button onClick={addNewProject}
                        className="bg-slate-900 text-[1rem] border-2 border-slate-700 w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50">

                    <MdAdd className="mr-2"/> Add Project
                </button>

                {project && (
                    <div className="mb-6">
                        <div className="flex flex-col items-center gap-5 mb-6">
                            <div
                                className="w-[200px] h-[150px] flex justify-center items-center bg-transparent overflow-hidden">
                                {!project.thumbnailUrl ? (
                                    <GoProjectSymlink className="text-gray-500" size={128}/>
                                ) : (
                                    <img src={project.thumbnailUrl} alt="Project Thumbnail"
                                         className="object-contain w-full h-full"/>
                                )}
                            </div>
                            <label htmlFor="portfolioPictureInput"
                                   className="bg-slate-900 text-[0.8rem] text-center py-2 lg:text-[1rem] w-full lg:w-1/2 font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:text-slate-50">
                                Add Thumbnail Picture
                            </label>
                            <input
                                id="portfolioPictureInput"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <LabelInputContainer>
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                                id="projectName"
                                name="projectName"
                                value={project.projectName}
                                onChange={handleInputChange}
                                placeholder="Project Name"
                                className="bg-slate-900 text-slate-50 placeholder:text-slate-400"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer>
                            <Label htmlFor="projectType">Project Type</Label>
                            <Input
                                id="projectType"
                                name="projectType"
                                value={project.projectType}
                                onChange={handleInputChange}
                                placeholder="Project Type"
                                className="bg-slate-900 text-slate-50 placeholder:text-slate-400"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer>
                            <Label htmlFor="projectDescription">Project Description</Label>
                            <Textarea
                                id="projectDescription"
                                name="projectDescription"
                                value={project.projectDescription}
                                onChange={handleInputChange}
                                placeholder="Project Description"
                                className="bg-slate-900 text-slate-50 placeholder:text-slate-400"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer>
                            <Label htmlFor="repoUrl">Repository URL</Label>
                            <Input
                                id="repoUrl"
                                name="repoUrl"
                                value={project.repoUrl}
                                onChange={handleInputChange}
                                placeholder="Repository URL"
                                className="bg-slate-900 text-slate-50 placeholder:text-slate-400"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer>
                            <Label htmlFor="liveUrl">Live URL</Label>
                            <Input
                                id="liveUrl"
                                name="liveUrl"
                                value={project.liveUrl}
                                onChange={handleInputChange}
                                placeholder="Live URL"
                                className="bg-slate-900 text-slate-50 placeholder:text-slate-400"
                            />
                        </LabelInputContainer>

                        <div className="flex justify-center mt-4 space-x-4">
                            <button onClick={saveCurrentProject} disabled={isLoading}
                                    className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50">
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <ImSpinner2 size={20} className="animate-spin mr-2"/>
                                        Please wait
                                    </div>
                                ) : (
                                    <div className="flex gap-1 justify-center items-center">
                                        <MdSave className="mr-2"/>
                                        Save Project
                                    </div>
                                )}
                            </button>
                            <button onClick={() => setProject(null)}
                                    className="bg-slate-900 text-[1rem] w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            >
                                <MdDelete className="mr-2"/>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <h3 className="text-xl font-bold text-center text-white mt-6 mb-4">Saved Projects</h3>

                <div
                    className={`${projects.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 '} gap-4`}>
                    {projects.map((project, index) => (
                        <div key={index} className="mb-6 bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                            <div className="flex justify-center bg-black">
                                <div style={{width: '100%', paddingTop: '56.25%', position: 'relative'}}>
                                    <img src={project.thumbnailUrl} alt={project.projectName} style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}/>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-2xl font-semibold text-blue-400 mb-3">{project.projectName}</h4>
                                <p className="text-slate-50 mb-2"><strong>Type:</strong> {project.projectType}</p>
                                <p className="text-slate-50 mb-4"><strong>Description:</strong> {project.projectDescription}
                                </p>
                                <div className='flex flex-col lg:flex-row gap-5 justify-center items-center'>
                                    <Link href={project.repoUrl} target="_blank" className='w-full lg:w-auto'
                                          rel="noopener noreferrer">
                                        <button
                                            className="inline-flex rounded-lg w-full justify-center items-center px-4 py-2 bg-slate-950 text-white hover:bg-slate-900">
                                            <FaGithub className="mr-2"/>GitHub
                                        </button>
                                    </Link>
                                    <Link href={project.liveUrl} target="_blank" className='w-full lg:w-auto'
                                          rel="noopener noreferrer">
                                        <button
                                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-600">
                                            <FaLink  className="mr-2"/>Live
                                        </button>
                                    </Link>
                                    <button onClick={() => deleteProject(project._id, index)}
                                            className="inline-flex justify-center items-center w-full lg:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400">
                                        <MdDelete className="mr-2"/> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CandidatePortfolio;

const LabelInputContainer = ({children}) => {
    return <div className={cn("flex flex-col space-y-2 w-full")}>{children}</div>;
};
