import axios from 'axios';

/**
 * Base URL for all backend API requests.
 */
const API_BASE = 'http://localhost:8000';

/**
 * Uploads a PDF file for processing.
 * @param {File} file - The PDF file to upload.
 * @returns {Promise<object>} Parsed response payload.
 */
export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${API_BASE}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

/**
 * Requests a summary for the provided text.
 * @param {{ text: string, use_cot?: boolean, section_name?: string }} params - Summary options.
 * @returns {Promise<object>} Parsed response payload.
 */
export const summarizeText = async ({ text, use_cot, section_name }) => {
    const res = await axios.post(`${API_BASE}/summarize`, {
        text,
        use_cot,
        section_name,
    });
    return res.data;
};

/**
 * Evaluates a generated summary against references and criteria.
 * @param {object} payload - Evaluation request body expected by the backend.
 * @returns {Promise<object>} Parsed response payload.
 * @throws {Error} When the backend responds with an error.
 */
export const evaluateSummary = async (payload) => {
    try {
        const res = await axios.post(`${API_BASE}/evaluate`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (err) {
        const message = err.response?.data || err.message || 'Evaluation failed';
        throw new Error(typeof message === 'string' ? message : 'Evaluation failed');
    }
};
