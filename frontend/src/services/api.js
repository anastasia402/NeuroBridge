const BASE_URL = 'http://localhost:5294/api';

export const fetchMentors = async () => {
    const response = await fetch(`${BASE_URL}/users/mentors`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};