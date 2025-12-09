import axios from 'axios';

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { post_link, reacts } = req.body;
        
        if (!post_link || !reacts) {
            return res.status(400).json({ 
                error: 'Link dan emoji harus diisi' 
            });
        }

        // Gunakan environment variables
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
            message: 'Gas! Reaction berhasil dikirim',
            data: response.data
        });

    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        
        res.status(500).json({
            success: false,
            error: 'Kalo error, berarti credit habis. Tunggu aja di update.',
            details: error.response?.data?.message || error.message
        });
    }
}
