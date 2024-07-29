"use client";

import React, {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CgProfile} from "react-icons/cg";
import {Label} from "@/components/ui/label";
import {cn, HOST} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {MdDelete, MdOutlineAlternateEmail} from "react-icons/md";
import {Textarea} from "@/components/ui/textarea";
import {PiSignInBold} from "react-icons/pi";
import {IoIosCloseCircle} from "react-icons/io";
import {ReloadIcon} from "@radix-ui/react-icons";
import {AppContext, useAppContext} from "@/Context/Candidate_Employer_Data";
import DynamicAlert from "@/components/ui/DynamicAlert";
import {useRouter} from "next/navigation";
import {ImSpinner2} from "react-icons/im";

function Modal({onClose, onSave, type, children}) {
    const [entry, setEntry] = useState({
        companyName: "",
        position: "",
        details: "",
        institutionName: "",
        date: "",
        description: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEntry((prev) => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        onSave(entry);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-950 border-2 border-slate-700 p-5 rounded-3xl shadow-lg max-w-md w-full">
                {children(handleChange)}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={handleSave}
                        className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-slate-900 text-[1rem] w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProfileDetailsForm() {
    const {candidateData, candidate, setCandidateData} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        candidateId: candidate.id,
        fullName: candidateData.fullName ?? '',
        email: candidateData.email ?? '',
        preferredJobLocation: candidateData.preferredJobLocation ?? '',
        phone: candidateData.phone ?? [],
        profession:'',
        skills: candidateData.skills ?? [],
        currentSkill: "",
        workExperiences: candidateData.workExperiences ?? [],
        education: candidateData.education ?? [],
        profilePicture: null,
    });

    const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] =
        useState(false);
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result); // Log the Base64 string
                setFormData((prevState) => ({
                    ...prevState,
                    profilePicture: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteProfilePicture = () => {
        setFormData((prevState) => ({
            ...prevState,
            profilePicture: null,
        }));
    };

    const handleSkillChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            currentSkill: e.target.value,
        }));
    };

    const handleSkillKeyPress = (e) => {
        if (
            e.key === "Enter" &&
            formData.currentSkill.trim() !== "" &&
            formData.skills.length < 8
        ) {
            e.preventDefault();
            setFormData((prevState) => ({
                ...prevState,
                skills: [...prevState.skills, prevState.currentSkill.trim()],
                currentSkill: "", // Clear the input
            }));
        }
    };

    const addWorkExperience = (workExperience) => {
        if (!workExperience.title || !workExperience.companyName || !workExperience.location || !workExperience.duration) {
            alert("Kindly Fill Out the Required Fields.");
            return;
        }
        setFormData((prevState) => ({
            ...prevState,
            workExperiences: [...prevState.workExperiences, workExperience],
        }));
        setIsWorkExperienceModalOpen(false);
    };
    const isExperienceValid = (exp) => {
        return exp.title && exp.companyName && exp.location && exp.duration;
    };
    const addEducation = (educationEntry) => {
        if (
            !educationEntry.degree ||
            !educationEntry.universityName ||
            !educationEntry.duration ||
            !educationEntry.location
        ) {
            alert("Kindly Fill Out the Required Fields.");
            return;
        }

        setFormData((prevState) => ({
            ...prevState,
            education: [...prevState.education, educationEntry],
        }));
        setIsEducationModalOpen(false);
    };
    const isEducationValid = (edu) => {
        return edu.degree && edu.universityName && edu.location && edu.duration;
    };

    const handleDelete = (index, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: prevState[name].filter((_, i) => i !== index),
        }));
    };

    async function storeCompleteData(formData) {
        try {
            const response = await fetch(`${HOST}/candidate-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return "error";
            } else {
                setShowAlert(true);
                setTitle("Success");
                setAlertMessage(data.message);
                setIsLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
                window.scrollTo({top: 0, behavior: 'smooth'});
                setCandidateData({
                    fullName: data.profileData.fullName,
                    email: data.profileData.emails,
                    preferredJobLocation: data.profileData.preferredJobLocation,
                    phone: data.profileData.phone,
                    skills: data.profileData.skills,
                    workExperiences: data.profileData.workExperiences,
                    education: data.profileData.education,
                    profilePictureUrl: data.profileData.profilePictureUrl,
                    profession: data.profileData.profession,
                })
                return "success";
            }
        }
        catch (error){
            setShowAlert(true);
            setTitle("Error");
            setAlertMessage(error.message);
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return "error";
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!formData.fullName ||
            !formData.email ||
            !formData.preferredJobLocation ||
            !formData.phone ||
            !formData.profession ||
            !formData.skills ||
            !formData.workExperiences ||
            !formData.education ||
            !formData.profilePicture) {
            setShowAlert(true);
            setAlertMessage("All fields are required!");
            setTitle("Warning");
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            window.scrollTo({top: 0, behavior: 'smooth'});
            return null;
        }
        try {
            let imageData = new FormData();
            imageData.append("file", formData.profilePicture);
            imageData.append("upload_preset", "careersync");
            imageData.append("cloud_name", "dy5yzo1ji");
            await fetch("https://api.cloudinary.com/v1_1/dy5yzo1ji/upload", {
                method: "POST",
                body: imageData
            })
                .then((response) => response.json())
                .then(async (data) => {
                    formData.profilePicture = data.secure_url;
                    const message = await storeCompleteData(formData);
                    message === "success" && router.push("/candidate/dashboard");
                })
                .catch((error) => {
                    setShowAlert(true);
                    setTitle("Error");
                    setAlertMessage(error.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 7000);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
        } catch (error) {
            setShowAlert(true);
            setTitle("Error");
            setAlertMessage(error.message);
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            {
                showAlert && <DynamicAlert title={title} alertMessage={alertMessage}/>
            }
            <div
                className="bg-transparent shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full "
            >
                <h2 className="text-2xl font-bold text-slate-50 text-center mb-6">
                    Candidate Profile
                </h2>
                <div className="space-y-4">
                    <div className="flex flex-col justify-center items-center gap-5">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={formData.profilePicture}/>
                            <AvatarFallback>
                                <CgProfile className="text-slate-950" size={200}/>
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="profilePictureInput"
                            className="bg-slate-900 text-[0.8rem] text-center py-2 lg:text-[1rem] w-full lg::w-1/2 border-2 border-slate-50 font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                        >
                            Select Profile Picture
                        </label>
                        <input
                            id="profilePictureInput"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="fullName" className="text-slate-50">
                            Full Name
                        </Label>
                        <Input
                            id="fullName"
                            Icon={<MdOutlineAlternateEmail size={20}/>}
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Name"
                            className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email" className="text-slate-50">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="phone" className="text-slate-50">
                            Phone No.
                        </Label>
                        <Input
                            id="phone"
                            onChange={handleChange}
                            value={formData.phone}
                            name="phone"
                            placeholder="+923001234567"
                            type="name"
                            className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
            <Label htmlFor="profession" className="text-slate-50">
                Profession
            </Label>
            <Input
                id="profession"
                onChange={handleChange}
                value={formData.profession}
                name="profession"
                placeholder="Full Stack Developer"
                type="text"
                className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
            />
        </LabelInputContainer>
  
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="preferredJobLocation" className="text-slate-50">
                            Preferred Job Location
                        </Label>
                        <Input
                            id="preferredJobLocation"
                            type="text"
                            name="preferredJobLocation"
                            value={formData.preferredJobLocation}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="skills" className="text-slate-50">
                            Skills (Press Enter to add)
                        </Label>
                        <Input
                            id="skills"
                            type="text"
                            name="skills"
                            value={formData.currentSkill}
                            onChange={handleSkillChange}
                            onKeyPress={handleSkillKeyPress}
                            className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                            placeholder="Add a skill and press Enter"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className="bg-slate-600 flex justify-center items-center text-slate-50 text-sm font-semibold px-2 py-1 rounded">
                                        {skill}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </LabelInputContainer>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsWorkExperienceModalOpen(true)}
                            className="bg-slate-900 border-2 border-slate-700 text-[1rem] w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                        >
                            + Add Work Experience
                        </button>
                    </div>

                    {formData.workExperiences.map((exp, index) => (
                        isExperienceValid(exp) && (
                            <div
                                key={index}
                                className="p-2 border rounded mt-2 text-slate-50 bg-slate-800 relative"
                            >
                                <button
                                    onClick={() => handleDelete(index, "workExperiences")}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                >
                                    <MdDelete className="text-slate-50" size={20}/>
                                </button>

                                <p>
                                    <strong>
                                        {exp.title} | {exp.companyName}
                                    </strong>
                                </p>
                                <p>
                                    {exp.location} | <span className="italic">{exp.duration}</span>
                                </p>
                                <p>
                                    {exp.description}
                                </p>
                            </div>
                        )
                    ))}


                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsEducationModalOpen(true)}
                            className="bg-slate-900 text-[1rem] border-2 border-slate-700 w-full font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                        >
                            + Add Education
                        </button>
                    </div>

                    {formData.education.map((edu, index) => (
                        isEducationValid(edu) &&
                        (<div
                            key={index}
                            className="p-2 border rounded mt-2 text-slate-50 bg-slate-800 relative"
                        >
                            <button
                                onClick={() => handleDelete(index, "education")}
                                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                            >
                                <MdDelete className="text-slate-50" size={20}/>
                            </button>
                            <p>
                                <strong>
                                    {edu.degree} | {edu.universityName}
                                </strong>
                            </p>
                            <p>
                                <strong></strong> {edu.location} |{" "}
                                <span className="italic"> {edu.duration}</span>
                            </p>
                            <p>
                                <strong></strong> {edu.description}
                            </p>
                        </div>)
                    ))}

                    <button
                        className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <ImSpinner2 size={20} className="animate-spin mr-2"/>
                                Please wait
                            </div>
                        ) : (
                            <div className="flex gap-1 justify-center items-center">
                                Submit
                                <PiSignInBold size={20}/>
                            </div>
                        )}
                    </button>
                </div>
                {isWorkExperienceModalOpen && (
                    <Modal
                        type="workExperience"
                        onClose={() => setIsWorkExperienceModalOpen(false)}
                        onSave={addWorkExperience}
                    >
                        {(handleChange) => (
                            <>
                                <Input
                                    id="title"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    name="title"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                                />
                                <Input
                                    id="companyName"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    name="companyName"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />
                                <Input
                                    id="location"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    name="location"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />

                                <Input
                                    id="duration"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange} // This should be updating the correct part of the state
                                    placeholder="Duration (Ex: June 18 - Present)"
                                    name="duration"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />

                                <Textarea
                                    id="description"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Description (Press Enter for new line)"
                                    name="description"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />
                            </>
                        )}
                    </Modal>
                )}
                {isEducationModalOpen && (
                    <Modal
                        type="education"
                        onClose={() => setIsEducationModalOpen(false)}
                        onSave={addEducation}
                    >
                        {(handleChange) => (
                            <>
                                <Input
                                    id="degree"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Degree and Major"
                                    name="degree"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400"
                                />
                                <Input
                                    id="universityName"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="University Name"
                                    name="universityName"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />
                                <Input
                                    id="location"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    name="location"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />

                                <Input
                                    id="duration"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Duration (Ex: June 18 - Present)"
                                    name="duration"
                                    type="text"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />

                                <Textarea
                                    id="description"
                                    Icon={<MdOutlineAlternateEmail size={20}/>}
                                    onChange={handleChange}
                                    placeholder="Description (Press Enter for new line)"
                                    name="description"
                                    className="text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4"
                                />
                            </>
                        )}
                    </Modal>
                )}
            </div>
        </>
    );
}

export default ProfileDetailsForm;

const LabelInputContainer = ({children, className}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
