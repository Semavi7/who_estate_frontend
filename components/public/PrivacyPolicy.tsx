import React, { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface PrivacyPolicy {
    open: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

const PrivacyPolicy = ({ open, onOpenChange }: PrivacyPolicy) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl'>
                        Gizlilik Politikası
                    </DialogTitle>
                </DialogHeader>
                <article className="p-1 space-y-6">
                    <p><strong>Derya Emlak WhoEstate</strong> biz olarak kullanıcılarımızın kişisel verilerinin gizliliğini önemsiyoruz. Bu politika,
                        <a href="[https://alanadiniz.com]" className="text-blue-600 underline">[alanadiniz.com]</a> ve mobil/web hizmetlerimizi kullanırken işlenen kişisel verilere ilişkindir.
                    </p>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">1. Veri Sorumlusu</h2>
                        <p><strong>Derya Emlak WhoEstate</strong> <br />
                            Adres: Bağlarbaşı Mah. Selahattin Bey Sok. No:1/A, <br /> Maltepe/İstanbul, Türkiye
                            <br />E-posta: <a href="mailto:[kvkk@alanadiniz.com]" className="text-blue-600 underline">kvkk@alanadiniz.com</a> | Tel: +90 216 399 34 43
                        </p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">2. İşlediğimiz Kişisel Veriler</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Kimlik/İletişim:</strong> Ad-soyad, e-posta, telefon.</li>
                            <li><strong>Hesap ve İşlem:</strong> giriş/çıkış kayıtları, favoriler, ilan etkileşimleri.</li>
                            <li><strong>İşlem Güvenliği:</strong> IP, tarayıcı/cihaz bilgisi, log kayıtları, hata kayıtları.</li>
                            <li><strong>Pazarlama:</strong> izinli bildirim tercihleri, kampanya etkileşimleri.</li>
                            <li><strong>Konum (opsiyonel):</strong> yakın ilan/harita için paylaşmanız hâlinde yaklaşık konum.</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">3. Amaçlar ve Hukuki Sebepler (KVKK md.5/6)</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Hizmet sunumu, üyelik ve sözleşmenin ifası (md.5/2-c).</li>
                            <li>Hukuki yükümlülüklerimizin yerine getirilmesi (md.5/2-ç).</li>
                            <li>Meşru menfaatlerimiz (güvenlik, dolandırıcılık önleme, iyileştirme) (md.5/2-f).</li>
                            <li>Açık rıza gerektiren durumlar (pazarlama, konum, çerez kategorileri) (md.5/1, md.6).</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">4. Toplama Yöntemleri</h2>
                        <p>Web ve mobil arayüzler, destek kanalları, çerez ve benzeri teknolojiler, sistem logları.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">5. Aktarımlar ve Alıcı Grupları</h2>
                        <p>Yalnızca amaçla sınırlı olmak üzere; barındırma/e-posta/SMS sağlayıcıları, güvenlik ve analitik hizmet sağlayıcıları, hukuki zorunluluk hâlinde yetkili merciler. Yurt dışına aktarım gerektiğinde KVKK md.9 uyarınca açık rızanız veya Kurulca ilan edilen yeterli koruma mekanizmalarından biri aranır.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">6. Saklama Süreleri</h2>
                        <p>İlgili mevzuatta öngörülen süreler veya işleme amacının gerekli kıldığı süre boyunca; ardından mevzuata uygun yöntemlerle silinir, yok edilir veya anonimleştirilir.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">7. Haklarınız (KVKK md.11)</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>İşlenip işlenmediğini ve buna ilişkin bilgi talep etme</li>
                            <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
                            <li>Silinmesini/yok edilmesini isteme</li>
                            <li>Aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                            <li>Otomatik sistemlerle analiz sonucu aleyhinize bir durum doğmasına itiraz etme</li>
                            <li>Zarar doğması hâlinde giderilmesini talep etme</li>
                        </ul>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">8. Başvuru Yöntemi</h2>
                        <p>Taleplerinizi <a href="mailto:[kvkk@alanadiniz.com]" className="text-blue-600 underline">[kvkk@alanadiniz.com]</a> adresine veya “<em>İlgili Kişi Başvuru Formu</em>” ile [Şirket Adresi]’ne iletebilirsiniz. Başvurular en geç 30 gün içinde sonuçlandırılır.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">9. Güvenlik</h2>
                        <p>Uygun teknik ve idari tedbirler (erişim kontrolü, şifreleme, loglama, yetkilendirme) uygulanır.</p>
                    </section>


                    <section className="space-y-2">
                        <h2 className="text-2xl font-semibold">10. Değişiklikler</h2>
                        <p>Bu politika güncellenebilir. Güncel sürüm bu sayfada yayımlanır.</p>
                    </section>


                </article>
            </DialogContent>
        </Dialog>

    )
}

export default PrivacyPolicy