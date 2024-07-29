from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np


def preprocess_text(text):
    # Tokenization
    tokens = text.split()
    # Lowercasing
    tokens = [token.lower() for token in tokens]
    # Stop words removal
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    # Stemming
    stemmer = PorterStemmer()
    tokens = [stemmer.stem(token) for token in tokens]
    return ' '.join(tokens)


def recommend_jobs(jobs_data, resume_data_list):
    # Initialize empty lists for resume information
    resume_skills = []
    resume_experience = []
    resume_education = []

    # Preprocess resume data
    for resume_data in resume_data_list:
        # Preprocess skills
        if 'skills' in resume_data:
            resume_skills.append(preprocess_text(' '.join(str(skill) for skill in resume_data['skills'])))
        # Preprocess work experiences
        if 'workExperiences' in resume_data:
            resume_experience.extend(
                [preprocess_text(str(exp.get('description', ''))) for exp in resume_data['workExperiences']])
        # Preprocess education
        if 'education' in resume_data:
            resume_education.extend(
                [preprocess_text(str(edu.get('description', ''))) for edu in resume_data['education']])

    # Create a single text representation for each job
    job_texts = []
    for job in jobs_data:
        job_desc = preprocess_text(job['job_description'])
        job_qualifications = ' '.join(job['job_highlights'].get('Qualifications', []))
        job_texts.append(job_desc + ' ' + job_qualifications)

    # Apply TF-IDF vectorization
    tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), min_df=2, max_df=0.8, sublinear_tf=True)
    tfidf_matrix_jobs = tfidf.fit_transform(job_texts)

    # Create a text representation for the resume
    resume_text = ' '.join(resume_skills + resume_experience + resume_education)
    tfidf_matrix_resume = tfidf.transform([resume_text])

    # Calculate cosine similarity using linear_kernel for faster computation
    cosine_sim = linear_kernel(tfidf_matrix_resume, tfidf_matrix_jobs)
    similarities = cosine_sim[0]
    sorted_indices = np.argsort(similarities)[::-1]
    recommended_jobs = [jobs_data[idx] for idx in sorted_indices]
    return recommended_jobs


def recommend_candidates(candidate_data, job_description):
    # Preprocess search query and location
    preprocessed_keyword = preprocess_text(job_description)

    # Preprocess candidate data and calculate their similarity to the search query and location
    candidate_scores = []
    for candidate in candidate_data:
        candidate_skills = preprocess_text(' '.join(candidate.get('skills', [])))
        candidate_profession = preprocess_text(candidate.get('profession', ''))
        candidate_experience = [preprocess_text(exp.get('description', '')) for exp in
                                candidate.get('workExperiences', [])]
        candidate_education = [preprocess_text(edu.get('description', '')) for edu in candidate.get('education', [])]

        # Combine all text fields for comparison
        candidate_text = ' '.join([candidate_skills, candidate_profession] + candidate_experience + candidate_education)

        # Calculate a score for the candidate based on similarity to the search query and location
        score = calculate_similarity_score_for_recommendation(candidate_text, preprocessed_keyword)
        candidate_scores.append((candidate, score))

    # Sort candidates based on their scores
    sorted_candidates = sorted(candidate_scores, key=lambda x: x[1], reverse=True)
    recommended_candidates = [candidate[0] for candidate in sorted_candidates]
    return recommended_candidates


def recommend_candidates_by_search_query(candidate_data, keyword, location):
    # Preprocess search query and location
    preprocessed_keyword = preprocess_text(keyword)
    preprocessed_location = preprocess_text(location)

    # Preprocess candidate data and calculate their similarity to the search query and location
    candidate_scores = []
    for candidate in candidate_data:
        candidate_skills = preprocess_text(' '.join(candidate.get('skills', [])))
        candidate_profession = preprocess_text(candidate.get('profession', ''))
        candidate_experience = [preprocess_text(exp.get('description', '')) for exp in
                                candidate.get('workExperiences', [])]
        candidate_education = [preprocess_text(edu.get('description', '')) for edu in candidate.get('education', [])]

        # Combine all text fields for comparison
        candidate_text = ' '.join([candidate_skills, candidate_profession] + candidate_experience + candidate_education)

        # Calculate a score for the candidate based on similarity to the search query and location
        score = calculate_similarity_score(candidate_text, preprocessed_keyword, preprocessed_location)
        candidate_scores.append((candidate, score))

    # Sort candidates based on their scores
    sorted_candidates = sorted(candidate_scores, key=lambda x: x[1], reverse=True)
    recommended_candidates = [candidate[0] for candidate in sorted_candidates]
    return recommended_candidates


def calculate_similarity_score_for_recommendation(candidate_text, keyword):
    # Combine keyword and location for comparison
    query_combined = ' '.join([keyword])

    # Apply TF-IDF vectorization and cosine similarity calculation
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_df=0.8)
    tfidf_matrix = tfidf_vectorizer.fit_transform([candidate_text, query_combined])
    similarity = cosine_similarity(tfidf_matrix)[0, 1]  # Similarity between candidate and query
    return similarity


# Helper function to calculate similarity score
def calculate_similarity_score(candidate_text, keyword, location):
    # Combine keyword and location for comparison
    query_combined = ' '.join([keyword, location])

    # Apply TF-IDF vectorization and cosine similarity calculation
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_df=0.8)
    tfidf_matrix = tfidf_vectorizer.fit_transform([candidate_text, query_combined])
    similarity = cosine_similarity(tfidf_matrix)[0, 1]  # Similarity between candidate and query
    return similarity
