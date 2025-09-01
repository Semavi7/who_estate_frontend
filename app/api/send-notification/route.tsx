import axios from "axios";

export async function POST(request: Request) {
    const { title, message } = await request.json()
    const url = 'https://onesignal.com/api/v1/notifications';
        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Basic ${process.env.ONE_SIGNAL_API_KEY}`
        };

        const data = {
            "app_id": process.env.ONE_SIGNAL_KEY,
            "target_channel": "push",
            "name": "Testing basic setup",
            "headings": {
                "en": title
            },
            "contents": {
                "en": message
            },
            "included_segments": [
                "All"
            ],
            "chrome_web_image": "http://localhost:3000/favicon.png"
        };

        try {
            const response = await axios.post(url, data, { headers });
            console.log('Bildirim başarıyla gönderildi:', response.data);
            return new Response(JSON.stringify({ message: 'Bildirim başarıyla gönderildi', data: response.data }), { status: 200 });
        } catch (error) {
            let errorMessage = 'Beklenmedik bir hata oluştu.';
            if (axios.isAxiosError(error)) {
                errorMessage = `Bildirim gönderme hatası: ${error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : error.message}`;
                console.error('Bildirim gönderme hatası:', error.response?.data || error.message);
            } else {
                console.error('Beklenmedik bir hata oluştu:', error);
            }
            return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
        }
}