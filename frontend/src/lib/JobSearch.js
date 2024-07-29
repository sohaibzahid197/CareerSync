import {jobs} from "@/lib/dummyData";
import {HOST} from "@/lib/utils";

export const searchJobs = async (querySearch, location, giveRecommended) => {
    let formattedSkills = "";
    // if(giveRecommended) formattedSkills = querySearch.map(skill => encodeURIComponent(skill)).join('%20OR%20');
    const formattedLocation = encodeURIComponent(location);

    // const url = `https://jsearch.p.rapidapi.com/search?query=${giveRecommended ? formattedSkills : querySearch}%20in%20${formattedLocation}&page=10&num_pages=10`;
    const url = `https://jsearch.p.rapidapi.com/search?query=${querySearch}%20in%20${formattedLocation}&page=1&num_pages=10&date_posted=month`;

    const options = {
        method: 'GET',
        // headers: {
        //     'x-rapidapi-key': 'b769a2752amsh3b98805aac28d99p1104edjsne4034e2cf194',
        //     'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        // }
        headers: {
            'x-rapidapi-key': '687c38f401msh4af25a8aa9e835dp140282jsnf5aa0c555561',
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // const data = await response.json();
        console.log(result)
        return  result.data; //replace with actual data

    } catch (error) {
        console.log(error)
    }
};



export const getMostRecommendedJobs = async (jobsData, resumeData) => {
    try {
        const response = await fetch('http://localhost:8080/recommend-jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jobsData,
                resumeData
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommended jobs');
        }

        const recommendedJobs = await response.json();
        return recommendedJobs;
    } catch (error) {
        console.error('Error fetching recommended jobs:', error.message);
        return null;
    }
};

export const getMostRecommendedCandidates = async (candidatesData, jobDescription) => {
    try {
        const response = await fetch('http://localhost:8080/recommend-candidates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                candidatesData,
                jobDescription
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommended Candidate');
        }

        const recommendedCandidates = await response.json();
        return recommendedCandidates;
    } catch (error) {
        console.error('Error fetching recommended Candidates:', error.message);
        return null;
    }
};

export const getSearchedCandidates = async (candidatesData, searchQuery, location) => {
    try {
        const response = await fetch('http://localhost:8080/search-candidates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                candidatesData,
                searchQuery,
                location
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommended Candidate');
        }

        const searchedCandidates = await response.json();
        return searchedCandidates;
    } catch (error) {
        console.error('Error fetching recommended Candidates:', error.message);
        return null;
    }
};
export async function allCandidates() {
    const response = await fetch(`${HOST}/candidates`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    try {
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching candidates:', error.message);
        return null;
    }
}