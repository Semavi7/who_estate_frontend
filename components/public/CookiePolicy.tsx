import React, { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface CookiePolicy {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

const CookiePolicy = ({ open, onOpenChange }: CookiePolicy) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl'>
                        Kullanım Şartları
                    </DialogTitle>
                </DialogHeader>
                <article className="p-2 space-y-6">
                    <p>Bu politika, <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">[alanadiniz.com]</span> üzerinde kullanılan çerezler ve benzeri teknolojilere ilişkindir.</p>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">1. Çerez Nedir?</h2>
                        <p>Çerezler, tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Siteyi çalıştırmak, tercihleri hatırlamak, performansı ölçmek ve ilgi alanlarınıza uygun içerik sunmak için kullanılır.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">2. Kullandığımız Çerez Türleri</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Zorunlu:</strong> Oturum ve güvenlik amaçlı temel çerezler.</li>
                            <li><strong>Performans/Analitik:</strong> Ziyaret ve kullanım istatistikleri (örn. sayfa görüntüleme).</li>
                            <li><strong>İşlevsel:</strong> Dil/tema tercihleri gibi kişiselleştirme.</li>
                            <li><strong>Reklam/Hedefleme:</strong> İlgi alanı bazlı içerik ve reklam (açık rızaya tabidir).</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">3. Üçüncü Taraf Çerezleri</h2>
                        <p>Analitik ve reklam hizmetleri kapsamında üçüncü taraf çerezleri kullanılabilir (örn. [Google Analytics], [Meta], [Hotjar]). Bu tarafların kendi politikalarını inceleyin.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">4. Çerez Süreleri</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Oturum çerezleri:</strong> Tarayıcı kapanınca silinir.</li>
                            <li><strong>Kalıcı çerezler:</strong> Belirli bir süre tarayıcınızda kalır.</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">5. Çerezleri Yönetme</h2>
                        <p>Tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz. Zorunlu çerezler devre dışı bırakılamaz.</p>
                    </section>
                </article>
            </DialogContent>
        </Dialog>

    )
}

export default CookiePolicy