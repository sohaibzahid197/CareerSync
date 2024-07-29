'use client'
import React, { useEffect, useState } from 'react';
import {cn, HOST} from "@/lib/utils";
import { ImSpinner2 } from "react-icons/im";
import { JobCard } from "@/components/ui/bento-grid";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {useAppContext} from "@/Context/Candidate_Employer_Data";

function Page(props) {
    const [active, setActive] = useState(1);
    const {candidate, setCandidate} = useAppContext();
    const [itemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsData, setJobsData] = useState([
        {
            job_id: "22B_5hXYYVvdGa-oAAAAAA==",
            employer_name: "Wanile Technologies",
            employer_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROrp9bcYwR39WYJG6tls_pt0bHKxQ5cRQ_QkOj&s=0",
            employer_website: null,
            employer_company_type: null,
            job_publisher: "LinkedIn",
            job_employment_type: "FULLTIME",
            job_title: "MERN Stack Developer",
            job_apply_link: "https://pk.linkedin.com/jobs/view/mern-stack-developer-at-wanile-technologies-3957684150",
            job_apply_is_direct: false,
            job_apply_quality_score: 0.6309,
            apply_options: [
                {
                    publisher: "LinkedIn",
                    apply_link: "https://pk.linkedin.com/jobs/view/mern-stack-developer-at-wanile-technologies-3957684150",
                    is_direct: false
                }
            ],
            job_description: "Job Title: MERN Stack Developer (Frontend Expert)\n\nLocation: Johar Town, Lahore\n\nSalary Package: Rs 70,000 to Rs 100,000 per month\n\nWorking Hours: 10 am to 7 pm\n\nAbout Us:\n\nWe are a dynamic and rapidly growing tech company based in Johar Town, Lahore, specializing in cutting-edge web development solutions. Our innovative projects demand a talented and experienced MERN Stack Developer who is passionate about creating exceptional, high-quality web applications.\n\nPosition Overview:\n\nAs a MERN Stack Developer with 1 to 3 years of experience, you will play a pivotal role in our development team, contributing to the design, development, and implementation of web applications. The ideal candidate should be proficient in both MERN (MongoDB, Express.js, React, Node.js) and MEAN (MongoDB, Express.js, Angular, Node.js) stacks, with a strong focus on both frontend and backend development architectures.\n\nResponsibilities:\n• Collaborate with cross-functional teams to analyze project requirements and develop high-quality software solutions.\n• Design and implement robust and scalable web applications using the MERN and MEAN stack technologies.\n• Work on both frontend (React, Angular) and backend (Node.js, Express.js) development tasks.\n• Develop and maintain database structures (MongoDB) and API integrations.\n• Ensure the responsiveness and performance of applications across various devices and browsers.\n• Collaborate with UX/UI designers to implement visually appealing and intuitive user interfaces.\n• Troubleshoot, debug and optimize code to maximize performance and efficiency.\n• Stay updated on industry trends and emerging technologies to contribute innovative ideas.\n\nQualifications:\n• Bachelor's degree in Computer Science or a related field.\n• 1 to 3 years of hands-on experience with MERN and MEAN stack development.\n• Strong proficiency in frontend technologies such as React Js, Next Js.\n• In-depth knowledge of backend technologies including Node.js and Express.js.\n• Experience working with MongoDB and database design.\n• Solid understanding of RESTful APIs and microservices architecture.\n• Familiarity with version control systems, preferably Git.\n• Ability to work independently and as part of a collaborative team.\n• Excellent problem-solving and communication skills.\n\nBenefits:\n• Competitive salary package with regular performance reviews.\n• Opportunities for professional growth and career advancement.\n• Friendly and collaborative work environment.\n• Work on exciting and innovative projects at the forefront of technology.\n\nHow to Apply:\n\nIf you are a talented MERN Stack Developer looking for a challenging and rewarding opportunity, please submit your resume and portfolio to hr@wanile.com. Be sure to include examples of your work that showcase your skills\n\nand expertise.\n• Join us in shaping the future of web development!\n",
            job_is_remote: false,
            job_posted_at_timestamp: 1719218683,
            job_posted_at_datetime_utc: "2024-06-24T08:44:43.000Z",
            job_city: "لاہور",
            job_state: null,
            job_country: "PK",
            job_latitude: 31.52037,
            job_longitude: 74.35875,
            job_benefits: null,
            job_google_link: "https://www.google.com/search?gl=us&hl=en&rciv=jb&q=mern+stack+developer+in+lahore,+punjab,+pakistan&start=0&chips=date_posted:month&schips=date_posted;month&ibp=htl;jobs&htidocid=22B_5hXYYVvdGa-oAAAAAA%3D%3D#fpstate=tldetail&htivrt=jobs&htiq=mern+stack+developer+in+lahore,+punjab,+pakistan&htidocid=22B_5hXYYVvdGa-oAAAAAA%3D%3D",
            job_offer_expiration_datetime_utc: "2024-07-24T08:44:43.000Z",
            job_offer_expiration_timestamp: 1721810683,
            job_required_experience: {
                no_experience_required: false,
                required_experience_in_months: null,
                experience_mentioned: true,
                experience_preferred: false
            },
            job_required_skills: [
                "Relational Databases",
                "Debugging",
                "Concept Generation",
                "MERN Stack",
                "Troubleshooting",
                "Databases",
                "Programming",
                "Programming Languages",
                "Application Programming Interfaces (API)",
                "Software Development"
            ],
            job_required_education: {
                postgraduate_degree: false,
                professional_certification: false,
                high_school: false,
                associates_degree: false,
                bachelors_degree: true,
                degree_mentioned: true,
                degree_preferred: true,
                professional_certification_mentioned: false
            },
            job_experience_in_place_of_education: false,
            job_min_salary: null,
            job_max_salary: null,
            job_salary_currency: null,
            job_salary_period: null,
            job_highlights: {},
            job_job_title: null,
            job_posting_language: "en",
            job_onet_soc: "15113300",
            job_onet_job_zone: "4",
            job_occupational_categories: null,
            job_naics_code: null,
            job_naics_name: null
        },
        {
            job_id: "8BcbDpBo6shBpAoyAAAAAA==",
            employer_name: "Novatore Solutions",
            employer_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7mnUvcF0awwPK5OJV35cm5UY2PWCXwrMDI1eV&s=0",
            employer_website: null,
            employer_company_type: null,
            job_publisher: "LinkedIn",
            job_employment_type: "FULLTIME",
            job_title: "Sr. MERN Stack Developer",
            job_apply_link: "https://pk.linkedin.com/jobs/view/sr-mern-stack-developer-at-novatore-solutions-3957658606",
            job_apply_is_direct: false,
            job_apply_quality_score: 0.6218,
            apply_options: [
                {
                    publisher: "LinkedIn",
                    apply_link: "https://pk.linkedin.com/jobs/view/sr-mern-stack-developer-at-novatore-solutions-3957658606",
                    is_direct: false
                },
                {
                    publisher: "BeBee Pakistan",
                    apply_link: "https://pk.bebee.com/job/fa11bb16b6340c8cc11e2e3179cc5983",
                    is_direct: false
                },
                {
                    publisher: "Jobee.PK",
                    apply_link: "https://jobee.pk/jobdetail/senior-mern-stack-developer-688b46002f6b4ac6",
                    is_direct: false
                },
                {
                    publisher: "ایسی ملازمت تلاش کریں جو آپ کے خوابوں کو پورا کرتی ہو - Jobs-Search ORG - Jobs Search",
                    apply_link: "https://ur.jobs-search.org/other-jobs_lahore-c356414/mern-stack-developer_i2201488369",
                    is_direct: false
                }
            ],
            job_description: "We are seeking a skilled and experienced MERN Stack Developer (3+ years of experience) to join our dynamic team. As a MERN Stack Developer, you will be responsible for designing, implementing, and maintaining full-stack applications. You will collaborate with cross-functional teams to deliver high-quality software solutions.\n\nResponsibilities\n• Understand client requirements and functional specifications\n• Write well-designed, testable, efficient code\n• Responsible for solving complex technical issues\n• Ensure quality projects are delivered within defined timelines\n• Active involvement in client communication to understand functional requirements\n• Provide technical assistance to juniors within the team\n• Maintain high standards of quality for code, documentation and other deliverables\n• Adhere to industry best practices and contribute to internal coding standards\n\nRequirements\n• Having 3+ years of experience in react and node js is a must.\n• Hands-on experience with JavaScript Development on both client and server side\n• Good at HTML5, CSS3, jQuery\n• In-depth knowledge of Node JS, MongoDB, and React JS\n• Experience with modern frameworks and design patterns\n• Experience in Version control systems like GIT\n• Analytical and logical skills\n\nQualifications\n• Bachelor's degree or equivalent experience in Computer Science 4-6 years of industry experience\n• Technical depth across multiple languages\n• Able to meet deadlines\n• Leadership experience\n• Strong communications skills",
            job_is_remote: false,
            job_posted_at_timestamp: 1719212403,
            job_posted_at_datetime_utc: "2024-06-24T07:00:03.000Z",
            job_city: "لاہور",
            job_state: null,
            job_country: "PK",
            job_latitude: 31.52037,
            job_longitude: 74.35875,
            job_benefits: null,
            job_google_link: "https://www.google.com/search?gl=us&hl=en&rciv=jb&q=mern+stack+developer+in+lahore,+punjab,+pakistan&start=0&chips=date_posted:month&schips=date_posted;month&ibp=htl;jobs&htidocid=8BcbDpBo6shBpAoyAAAAAA%3D%3D#fpstate=tldetail&htivrt=jobs&htiq=mern+stack+developer+in+lahore,+punjab,+pakistan&htidocid=8BcbDpBo6shBpAoyAAAAAA%3D%3D",
            job_offer_expiration_datetime_utc: "2024-07-24T07:00:03.000Z",
            job_offer_expiration_timestamp: 1721804403,
            job_required_experience: {
                no_experience_required: false,
                required_experience_in_months: 48,
                experience_mentioned: true,
                experience_preferred: false
            },
            job_required_skills: [
                "MERN Stack",
                "Cascading Style Sheets (CSS)",
                "Stack",
                "Databases",
                "SQL",
                "HTML",
                "C#",
                "Software Development",
                "JavaScript",
                "Java"
            ],
            job_required_education: {
                postgraduate_degree: false,
                professional_certification: false,
                high_school: false,
                associates_degree: false,
                bachelors_degree: true,
                degree_mentioned: true,
                degree_preferred: false,
                professional_certification_mentioned: false
            },
            job_experience_in_place_of_education: false,
            job_min_salary: null,
            job_max_salary: null,
            job_salary_currency: null,
            job_salary_period: null,
            job_highlights: {},
            job_job_title: null,
            job_posting_language: "en",
            job_onet_soc: "15113300",
            job_onet_job_zone: "4",
            job_occupational_categories: null,
            job_naics_code: null,
            job_naics_name: null
        },
        {
            job_id: "qWo8NAFCizxSBskkAAAAAA==",
            employer_name: "Inventorx",
            employer_logo: null,
            employer_website: null,
            employer_company_type: null,
            job_publisher: "Whatjobs? Jobs In The Pakistan",
            job_employment_type: "FULLTIME",
            job_title: "MERN Stack Developer (Lahore)",
            job_apply_link: "https://en-pk.whatjobs.com/job/MERN-Stack-Developer/lahore/2821736",
            job_apply_is_direct: false,
            job_apply_quality_score: 0.3909,
            apply_options: [
                {
                    publisher: "Whatjobs? Jobs In The Pakistan",
                    apply_link: "https://en-pk.whatjobs.com/job/MERN-Stack-Developer/lahore/2821736",
                    is_direct: false
                },
                {
                    publisher: "School Counselor Jobs",
                    apply_link: "https://schoolcounselorjobs.info/job/senior-react-js-developers-lahore--lahore-northbay-solutions-1398-20468-pakistan/",
                    is_direct: false
                },
                {
                    publisher: "School Jobs Near Me",
                    apply_link: "https://schooljobsnearme.info/job/senior-react-js-developers-lahore--lahore-northbay-solutions-1398-20468-pakistan/",
                    is_direct: false
                },
                {
                    publisher: "Expertini | Pakistan Jobs Expertini",
                    apply_link: "https://pk.expertini.com/jobs/job/senior-react-js-developers-lahore--lahore-northbay-solutions-1398-20468/",
                    is_direct: false
                }
            ],
            job_description: "Danesh Publications is looking for Editors who will ensure the …Read More »National High School, requires the following staff: Math for O …Read More »We require Lead Sales Manager for our Sales Dept of …Read More »One of the reputable Shipping / Freight forwarding concern have …Read More »We are seeking all applicants who are fluent in both …Read More »The Lady Dufferin Hospital, one of the largest women’s hospitals …Read More »Resident Medical Officers: Required for alternate night shift. Candidate should …Read More »Kharadar General Hospital requires application for following positions: Sonologist (Female) …Read More »\n\n#J-18808-Ljbffr",
            job_is_remote: false,
            job_posted_at_timestamp: 1717372800,
            job_posted_at_datetime_utc: "2024-06-03T00:00:00.000Z",
            job_city: "لاہور",
            job_state: null,
            job_country: "PK",
            job_latitude: 31.52037,
            job_longitude: 74.35875,
            job_benefits: null,
            job_google_link: "https://www.google.com/search?gl=us&hl=en&rciv=jb&q=mern+stack+developer+in+lahore,+punjab,+pakistan&start=0&chips=date_posted:month&schips=date_posted;month&ibp=htl;jobs&htidocid=qWo8NAFCizxSBskkAAAAAA%3D%3D#fpstate=tldetail&htivrt=jobs&htiq=mern+stack+developer+in+lahore,+punjab,+pakistan&htidocid=qWo8NAFCizxSBskkAAAAAA%3D%3D",
            job_offer_expiration_datetime_utc: "2024-07-01T06:37:00.000Z",
            job_offer_expiration_timestamp: 1719815820,
            job_required_experience: {
                no_experience_required: false,
                required_experience_in_months: null,
                experience_mentioned: false,
                experience_preferred: false
            },
            job_required_skills: null,
            job_required_education: {
                postgraduate_degree: false,
                professional_certification: false,
                high_school: false,
                associates_degree: false,
                bachelors_degree: false,
                degree_mentioned: false,
                degree_preferred: false,
                professional_certification_mentioned: false
            },
            job_experience_in_place_of_education: false,
            job_min_salary: null,
            job_max_salary: null,
            job_salary_currency: null,
            job_salary_period: null,
            job_highlights: {},
            job_job_title: null,
            job_posting_language: "en",
            job_onet_soc: "15113300",
            job_onet_job_zone: "4",
            job_occupational_categories: null,
            job_naics_code: null,
            job_naics_name: null
        },

    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${HOST}/candidate/bookmarks/${candidate._id}`); // Replace with actual candidate id

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Saved Jobs", data)
                setJobsData(data);
            } catch (error) {
                console.error('Error fetching saved jobs:', error);
            }
        };
        fetchData();
    }, []);

    const next = () => {
        if (active === 5) return;
        setActive(active + 1);
        setCurrentPage(currentPage + 1);
    };

    const prev = () => {
        if (active === 1) return;
        setActive(active - 1);
        setCurrentPage(currentPage - 1);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = jobsData?.slice(startIndex, endIndex) || [];

    return (
        <div className={'flex flex-col p-8 gap-3 justify-center lg:justify-normal items-center lg:items-start'}>
            <h2 className={cn('text-3xl font-bold text-slate-50 dark:text-neutral-100', 'mt-10 mb-4')}>
                All Saved Jobs
            </h2>
            {!jobsData ? <ImSpinner2 size={30} className="animate-spin w-full text-slate-50"/> : jobsData.map((jobItem, index) => (
                <div className="p-1" key={jobItem.job_id}>
                    <JobCard
                        key={jobItem.job_id}
                        saved={true}
                        title={jobItem.job_title}
                        description={jobItem.job_description}
                        city={jobItem.job_city}
                        state={jobItem.job_state}
                        country={jobItem.job_country}
                        requiredSkills={jobItem.job_required_skills?.slice(0, 5) || []}
                        applyLink={jobItem.job_apply_link}
                        employerLogo={jobItem.employer_logo}
                        employerName={jobItem.employer_name}
                        employmentType={jobItem.job_employment_type?.toLowerCase()}
                        isRemote={jobItem.job_is_remote}
                        isDirect={jobItem.job_apply_is_direct}
                        publisher={jobItem.job_publisher}
                        qualification={jobItem.job_highlights.Qualifications}
                        responsiblity={jobItem.job_highlights.Responsibilities}
                        salary={{
                            min: jobItem.job_min_salary,
                            max: jobItem.job_max_salary,
                            currency: jobItem.job_salary_currency,
                            period: jobItem.job_salary_period,
                        }}
                        postedAt={jobItem.job_posted_at_datetime_utc}
                    />
                </div>
            ))}
            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <Button
                    variant="text"
                    className="items-center justify-center gap-2 active:bg-slate-400 flex bg-slate-50 hover:bg-slate-200 text-slate-950  bg-opacity-100"
                    onClick={prev}
                    disabled={currentPage === 1}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/> Previous
                </Button>
                <div className="flex items-center gap-2">
                    <IconButton
                        className={'items-center justify-center gap-2 active:bg-slate-400 flex bg-slate-50 hover:bg-slate-200 text-slate-950  font-bold bg-opacity-100'}
                        variant={'filled'}>
                        {currentPage}
                    </IconButton>
                </div>
                <Button
                    variant="text"
                    className="items-center justify-center gap-2 hover:bg-slate-200 active:bg-slate-400 flex bg-slate-50 text-slate-950 bg-opacity-100"
                    onClick={next}
                    disabled={currentPage === Math.ceil(jobsData?.length / itemsPerPage)}
                >
                    Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    );
}

export default Page;