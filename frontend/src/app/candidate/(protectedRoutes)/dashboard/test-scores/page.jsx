'use client'
import React, { useState, useEffect } from 'react';
import {HOST} from "@/lib/utils";
import {useAppContext} from "@/Context/Candidate_Employer_Data";

// Function to fetch test scores
async function getTestScores(email) {
    const url = `${HOST}/get-scores/${email}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.tests;
    } catch (error) {
        console.error('Error fetching test results:', error);
        return []; // Return an empty array in case of an error
    }
}

// React Component
const TestScores = () => {
    const [tests, setTests] = useState([]);
    const {candidateData} = useAppContext();

    useEffect(() => {
        //getTestScores(candidateData.email).then(setTests);
        setTests([
            {testName: 'Software Development', score: 90},
            {testName: 'Problem Solving', score: 85},
            {testName: 'Communication', score: 95},
        ])
    }, []);

    return (
        <div className='container mx-auto mt-10'>
            {tests.length > 0 ? (
                <div className='max-w-lg mx-auto shadow-xl p-5 bg-white rounded-lg'>
                    <h1 className='text-2xl font-semibold mb-4 text-center'>Test Scores</h1>
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            <th className="text-left p-2 border-b-2 font-bold">Test Name</th>
                            <th className="text-right p-2 border-b-2 font-bold">Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tests.map((item, index) => (
                            <tr key={index} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="p-2 border-b">{item.testName}</td>
                                <td className="p-2 border-b text-right">{item.score}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='text-center text-2xl font-bold text-slate-500'>No test scores available</div>
            )}
        </div>
    );
}

export default TestScores;
