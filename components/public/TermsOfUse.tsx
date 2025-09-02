import React, { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface TermsOfUse {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

const TermsOfUse = ({ open, onOpenChange }: TermsOfUse) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl'>
                        Kullanım Şartları
                    </DialogTitle>
                </DialogHeader>
                <article className="p-2 space-y-6">
                    <p><strong>Derya Emlak WhoEstate</strong> hizmetlerine erişerek bu şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.</p>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">1) Tanımlar</h2>
                        <p><strong>Platform:</strong> [alanadiniz.com] alan adı ve ilgili dijital varlıklar.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">2) Hizmetin Kapsamı</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Emlak ilanlarının görüntülenmesi, listeleme ve arama fonksiyonları</li>
                            <li>Hesap oluşturma, favorilere ekleme, iletişim formları</li>
                            <li>Opsiyonel bildirimler ve pazarlama iletileri (açık rızaya tabi)</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">3) Üyelik ve Hesap Güvenliği</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Hesap bilgilerinizin gizliliği ve hesabınız üzerinden yapılan işlemlerden siz sorumlusunuz.</li>
                            <li>Şüpheli kullanım tespitinde hesabı askıya alma/sonlandırma hakkımız saklıdır.</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">4) Kabul Edilebilir Kullanım</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Yanıltıcı, hukuka aykırı, üçüncü kişi haklarını ihlal eden ilan/yorum paylaşılamaz.</li>
                            <li>Spam, zararlı yazılım, otomatik erişim (bot, scraper) yasaktır.</li>
                            <li>Güvenlik açıklarını kötüye kullanmak kesinlikle yasaktır.</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">5) İlan Sorumlulukları</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>İlan içerik/doğruluk sorumluluğu ilan verene aittir.</li>
                            <li>Gayrimenkul mevzuatı, aracılık ve tanıtım ilkelerine uyum kullanıcının yükümlülüğüdür.</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">6) Fikri ve Sınai Haklar</h2>
                        <p>Platforma ait yazılım, tasarım, marka ve içerikler bize veya lisans verenlere aittir. Yazılı izin olmaksızın kopyalanamaz, çoğaltılamaz, türev eser oluşturulamaz.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">7) Sorumluluk Reddi</h2>
                        <p>Platform “olduğu gibi” sunulur. Dolaylı/sonuç olarak doğan zararlardan ve kesinti/kayıp veriden sorumlu değiliz. Mevzuatın zorunlu tuttuğu haller saklıdır.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">8) Üçüncü Taraf Bağlantılar</h2>
                        <p>Üçüncü taraf sitelere verilen bağlantılar onların sorumluluğundadır; içerik ve güvenliklerinden biz sorumlu değiliz.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">9) Değişiklikler</h2>
                        <p>Şartlar zaman zaman güncellenebilir. Güncel sürüm yayım anında yürürlüğe girer.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">10) Uygulanacak Hukuk ve Yetki</h2>
                        <p>Türkiye Cumhuriyeti hukuku uygulanır. Uyuşmazlıklarda İstanbul (Anadolu) Mahkemeleri ve İcra Daireleri yetkilidir.</p>
                    </section>
                </article>
            </DialogContent>
        </Dialog>

    )
}

export default TermsOfUse