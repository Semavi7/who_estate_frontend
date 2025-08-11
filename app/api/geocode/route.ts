import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
        return NextResponse.json(
            { error: 'Adres bilgisi eksik' },
            { status: 400 }
        )
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
        console.error('Google Maps API anahtarı sunucu tarafında tanımlanmamış')
        return NextResponse.json(
            { error: 'Sunucu yapılandırma hatası.' },
            { status: 500 }
        )
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.status !== 'OK' || !data.results[0]) {
            return NextResponse.json(
                { error: 'Geocoding başarısız oldu.', details: data.status },
                { status: 500 }
            )
        }

        const location = data.results[0].geometry.location
        return NextResponse.json({ location })
    } catch (error) {
        console.error('Geocoding API isteği hatası:', error);
        return NextResponse.json(
            { error: 'Dış API isteğinde hata oluştu.' },
            { status: 502 }
        );
    }
}