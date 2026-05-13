const BASE_URL = 'http://localhost:5294/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// ==========================================
// Mentori
export const fetchMentors = async () => {
    const response = await fetch(`${BASE_URL}/users/mentors`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return response.json();
};

// ==========================================
// Materiale
export const fetchMaterials = async (uploaderId = null) => {
    const url = uploaderId ? `${BASE_URL}/materials?uploaderId=${uploaderId}` : `${BASE_URL}/materials`;
    const response = await fetch(url, {
        headers: getAuthHeaders() 
    });
    return response.json();
};

export const fetchMaterialById = async (id) => {
    const response = await fetch(`${BASE_URL}/materials/${id}`, { headers: getAuthHeaders() });
    return response.json();
};

export const uploadMaterial = async (formData) => {
    const response = await fetch(`${BASE_URL}/materials`, {
        method: 'POST',
        headers: { 
            ...getAuthHeaders() 
        },
        body: formData
    });
    return response.json();
};

export const updateMaterial = async (id, materialData) => {
    const response = await fetch(`${BASE_URL}/materials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(materialData)
    });
    return response;
};

export const deleteMaterial = async (id) => {
    const response = await fetch(`${BASE_URL}/materials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return response;
};

export const assignMaterial = async (materialId, assignmentData) => {
    const response = await fetch(`${BASE_URL}/materials/${materialId}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData)
    });
    return response.json();
};

// ==========================================
// Chat
export const fetchChatMessages = async (sessionId) => {
    const response = await fetch(`${BASE_URL}/chat/session/${sessionId}/messages`, {
        headers: getAuthHeaders()
    });
    return response.json();
};

export const fetchUnreadMessages = async (userId) => {
    const response = await fetch(`${BASE_URL}/chat/user/${userId}/unread`, {
        headers: getAuthHeaders()
    });
    return response.json();
};

export const markAsRead = async (sessionId, userId) => {
    const response = await fetch(`${BASE_URL}/chat/session/${sessionId}/mark-read?userId=${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return response;
};

// ==========================================
// AI
export const generateAIQuiz = async (quizRequest) => {
    const response = await fetch(`${BASE_URL}/ai/generate-quiz`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders() 
        },
        body: JSON.stringify(quizRequest)
    });
    return response.json();
};

export const summarizeContent = async (summarizeRequest) => {
    const response = await fetch(`${BASE_URL}/ai/summarize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(summarizeRequest)
    });
    return response.json();
};

export const getMaterialSummary = async (materialId) => {
    const response = await fetch(`${BASE_URL}/ai/summary/${materialId}`, {
        headers: getAuthHeaders()
    });
    return response.json();
};