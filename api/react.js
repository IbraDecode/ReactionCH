import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { post_link, reacts } = req.body;
        
        if (!post_link || !reacts) {
            return res.status(400).json({ 
                error: 'Post link dan emoji harus diisi' 
            });
        }

        const response = await axios.post(
            process.env.API_URL,
            {
                post_link,
                reacts
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Reaction berhasil dikirim',
            data: response.data
        });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || 'Gagal mengirim reaction',
            details: error.message
        });
    }
}
