import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${API_BASE}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const summarizeText = async ({ text, use_cot, section_name }) => {
    const res = await axios.post(`${API_BASE}/summarize`, {
        text,
        use_cot,
        section_name,
    });
    return res.data;
};
