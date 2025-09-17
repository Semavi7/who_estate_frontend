# WhoEstate: Modern Emlak Yönetim Platformu

WhoEstate, emlak sektörünün dijital ihtiyaçlarına yönelik olarak tasarlanmış, yüksek performanslı ve modern bir web uygulamasıdır. Bu platform, en son web teknolojilerinden faydalanarak hem potansyel alıcı ve kiracılar için sezgisel bir kullanıcı deneyimi sunar, hem de emlak profesyonellerine iş süreçlerini optimize eden güçlü bir yönetim paneli sağlar. Proje, Next.js'in sunduğu sunucu tarafı render (SSR) ve statik site oluşturma (SSG) yetenekleri sayesinde arama motoru optimizasyonu (SEO) ve hız konusunda üstün bir performans sergiler.

---

## 🌟 Temel Özellikler

Platform, iki ana bileşenden oluşur: halka açık vitrin ve özel yönetim paneli.

### 🏡 Kullanıcı Dostu Vitrin (Public Interface)

Son kullanıcıların emlak arama sürecini kolaylaştırmak ve keyifli hale getirmek için tasarlanmıştır.

-   **Etkileşimli Arama ve Listeleme:** Kullanıcılar, gelişmiş filtreleme seçenekleriyle (fiyat aralığı, konum, mülk tipi vb.) aradıkları kriterlere uygun ilanları kolayca bulabilirler.
-   **Detaylı İlan Sayfaları:** Her ilan, yüksek çözünürlüklü fotoğraflar, interaktif harita üzerinde konum, mülk özellikleri, sanal tur (varsa) ve sorumlu danışman bilgileri gibi zengin içeriklerle sunulur.
-   **SEO Optimizasyonu:** Next.js'in gücüyle oluşturulan sunucu taraflı render edilmiş sayfalar ve yapısal veri (Structured Data) entegrasyonları sayesinde, ilanlar arama motorlarında üst sıralarda yer alır.

###  dashboards Kapsamlı Yönetim Paneli (Admin Panel)

Emlak danışmanlarının ve yöneticilerin tüm operasyonel süreçleri tek bir noktadan yönetebilmesi için geliştirilmiş, güvenli ve fonksiyonel bir arayüzdür.

-   **Veri Odaklı Gösterge Paneli:** Yönetim paneli, anlık verilerle beslenen interaktif grafikler sunar. Toplam ilan sayısı, aylık görüntülenme metrikleri, yeni müşteri kazanım oranları ve ilan tipi dağılımları gibi kritik veriler, stratejik kararlar alınmasını kolaylaştırır.
-   **Akıllı İlan Yönetimi:** Yeni ilan ekleme, mevcut ilanları güncelleme ve yayından kaldırma işlemleri, zengin metin editörü ve kolaylaştırılmış formlar sayesinde verimli bir şekilde gerçekleştirilir.
-   **Müşteri ve İletişim Yönetimi:** Potansyel müşterilerden gelen mesajlar anında panele düşer ve buradan yönetilebilir. Müşteri kayıtları oluşturularak, her bir müşteriyle olan etkileşim geçmişi takip edilebilir.

### 🚀 Gerçek Zamanlı İletişim

-   **Anlık Web Bildirimleri (Push Notifications):** OneSignal entegrasyonu, platformun iletişim yeteneklerini bir üst seviyeye taşır. Yönetici panele yeni bir mesaj düştüğünde veya bir müşteri önemli bir aksiyon aldığında, ilgili danışmanlara anında web push bildirimi gönderilir. Bu proaktif yaklaşım, müşteri memnuniyetini artırır ve hiçbir fırsatın kaçırılmamasını sağlar.

### 📱 Progressive Web App (PWA) Desteği

Yönetim paneli, modern bir PWA olarak tasarlanmıştır. Bu özellik, kullanıcılara platformu bir masaüstü veya mobil uygulama gibi cihazlarına yükleme imkanı tanır, böylece daha hızlı ve entegre bir deneyim sunar.

-   **Uygulama Gibi Deneyim:** Yöneticiler, tarayıcı sekmeleriyle uğraşmadan, doğrudan cihazlarının ana ekranındaki veya masaüstündeki ikondan panele anında erişebilirler.
-   **Hızlı ve Akıcı Performans:** Bir PWA olarak, uygulama kaynakları verimli bir şekilde önbelleğe alınır, bu da tekrarlanan ziyaretlerde daha hızlı yükleme süreleri ve daha akıcı bir kullanıcı deneyimi sağlar.
-   **Platformlar Arası Tutarlılık:** PWA, herhangi bir modern tarayıcıyı destekleyen tüm işletim sistemlerinde (Windows, macOS, Android, iOS) tutarlı ve güvenilir bir şekilde çalışır.

---

## 🔐 Güvenlik ve Kimlik Doğrulama (Security & Authentication)

Platform, yönetim paneline yetkisiz erişimleri engellemek için JSON Web Token (JWT) tabanlı, çok katmanlı bir güvenlik mimarisi kullanır.

1.  **Token Tabanlı Oturum Yönetimi:** Kullanıcı, yönetim paneline giriş yaptığında, backend servisi tarafından güvenli bir `accessToken` (JWT) oluşturulur. Bu token, `HttpOnly` ve `Secure` flag'leri ile tarayıcının cookie'sine kaydedilir. Bu yöntem, token'ın JavaScript aracılığıyla erişilmesini engelleyerek XSS (Cross-Site Scripting) saldırılarına karşı koruma sağlar.

2.  **Middleware ile Rota Koruması:** Next.js `middleware` katmanı, `/admin` altındaki tüm sayfalara erişim için bir kontrol noktası görevi görür. Bir kullanıcı bu rotalara gitmeye çalıştığında, middleware isteği yakalar ve `accessToken` cookie'sinin varlığını kontrol eder. Eğer token mevcut değilse, kullanıcı anında ana sayfaya yönlendirilir ve korumalı alana erişimi engellenir.

3.  **Oturum Durumunun Senkronizasyonu (`AuthInitializer`):** Uygulama ilk yüklendiğinde veya sayfa yenilendiğinde, `AuthInitializer` adında özel bir component devreye girer. Bu component, sunucuya (`/api/auth/login`) bir istek göndererek `accessToken` cookie'sinin geçerliliğini proaktif olarak doğrular. Eğer cookie geçersiz veya süresi dolmuş ise, sunucudan `401` hatası döner. Bu durumda, `AuthInitializer` Redux üzerinden `logout` eylemini tetikleyerek istemci tarafındaki oturum bilgilerini anında temizler. Bu mekanizma, istemci ve sunucu oturum durumlarının her zaman tutarlı kalmasını garanti eder.

4.  **İstemci Taraflı Durum Yönetimi:** Kullanıcının kimlik doğrulama durumu, **Redux Toolkit** kullanılarak istemci tarafında global bir state içinde yönetilir. Başarılı girişin ardından kullanıcının bilgileri ve "doğrulandı" durumu bu state'e işlenir. Bu sayede, arayüz component'leri kullanıcının oturum durumuna göre dinamik olarak render edilebilir (örneğin, "Giriş Yap" yerine "Profilim" göstermek gibi).

5.  **Otomatik Oturum Sonlandırma:** **Axios Interceptor**, backend API'sine yapılan tüm istekleri izler. Eğer API, süresi dolmuş veya geçersiz bir token nedeniyle `401 Unauthorized` hatası döndürürse, interceptor bu durumu otomatik olarak yakalar. Ardından, Redux üzerinden `logout` eylemini tetikleyerek istemci tarafındaki oturum durumunu temizler ve kullanıcıya oturumunun sona erdiğine dair bir bildirim gösterir. Bu mekanizma, uygulama kullanılırken bile oturumun güvenli bir şekilde yönetilmesini sağlar.

---

## 🛠️ Teknik Mimari

Proje, sürdürülebilir, ölçeklenebilir ve bakımı kolay bir yazılım mimarisi üzerine inşa edilmiştir.

-   **Frontend Çatısı:** **Next.js** ve **React**, hibrit render (SSR/SSG/CSR) yetenekleri, dosya tabanlı yönlendirme (App Router) ve component tabanlı mimari sayesinde projenin temelini oluşturur. **TypeScript**, kod tabanında tip güvenliği sağlayarak geliştirme sürecindeki hataları en aza indirir.
-   **Stil ve Arayüz:** **Tailwind CSS**, "utility-first" yaklaşımıyla hızlı ve tutarlı bir şekilde modern arayüzler geliştirmeyi sağlar. **Shadcn/UI**, yeniden kullanılabilir ve erişilebilirlik standartlarına uygun componentler sunarak tasarım sistemini güçlendirir.
-   **Durum Yönetimi (State Management):** **Redux Toolkit**, özellikle kullanıcı oturum bilgileri ve global UI durumları gibi uygulama genelindeki verilerin merkezi ve öngörülebilir bir şekilde yönetilmesini sağlar.
-   **API İletişimi:** **Axios**, backend servisleriyle olan HTTP iletişimini yönetmek için kullanılır. **DTO (Data Transfer Object)** katmanı, API'den gelen ve API'ye gönderilen verilerin yapısını tanımlayarak tip güvenliğini garanti altına alır.

---

## 📈 Arama Motoru Optimizasyonu (SEO)

Platform, organik arama sonuçlarında maksimum görünürlük elde etmek için çok yönlü bir SEO stratejisi ile donatılmıştır.

-   **Dinamik Metadata Üretimi:** Next.js'in `generateMetadata` fonksiyonu sayesinde, her bir emlak ilanı sayfası için sunucu tarafında dinamik olarak meta etiketleri (`title`, `description`, `keywords`) oluşturulur. Bu etiketler, ilanın başlığı, konumu, fiyatı ve özellikleri gibi verilerden beslenerek her sayfanın arama motorları için benzersiz ve optimize edilmiş olmasını sağlar.

-   **Yapısal Veri (Structured Data - Schema.org):** Arama motorlarının sayfa içeriğini daha derinlemesine anlaması için JSON-LD formatında yapısal veriler kullanılır.
    -   **`RealEstateListing` Şeması:** Her ilan sayfası, fiyat, konum (coğrafi koordinatlar dahil), oda sayısı, metrekare gibi detayları içeren bu şema ile zenginleştirilmiştir. Bu, Google gibi arama motorlarının sonuçlarda "zengin snippet'ler" (rich snippets) göstermesine olanak tanır.
    -   **`Organization` ve `Website` Şemaları:** Ana sayfa ve genel site yapısı için kurumsal kimlik ve site arama kutusu gibi bilgileri arama motorlarına iletir.

-   **Otomatik Site Haritası (`sitemap.xml`):** Proje, `sitemap.ts` dosyası aracılığıyla dinamik bir site haritası oluşturur. Bu dosya, tüm statik sayfaları (hakkımızda, iletişim vb.) ve veritabanındaki tüm emlak ilanlarının URL'lerini içerir. Site haritası, yeni bir ilan eklendiğinde veya güncellendiğinde otomatik olarak güncellenir, böylece arama motorları tüm içeriği hızlı ve verimli bir şekilde keşfedebilir.

-   **Arama Motoru Yönergeleri (`robots.txt`):** `robots.ts` dosyası, arama motoru botlarına hangi dizinleri taramaları veya taramamaları gerektiğini bildiren bir `robots.txt` dosyası üretir. Bu sayede, yönetim paneli (`/admin`) ve API rotaları (`/api`) gibi halka açık olmaması gereken kısımların indekslenmesi engellenir.

-   **Sosyal Medya Optimizasyonu (Open Graph):** Tüm sayfalarda, özellikle ilan detaylarında, Open Graph (`og:title`, `og:description`, `og:image` vb.) etiketleri dinamik olarak ayarlanır. Bu, platformdaki linkler Facebook, Twitter gibi sosyal medya platformlarında paylaşıldığında zengin ve dikkat çekici önizlemeler oluşmasını sağlar.

---

## ☁️ Dağıtım ve Altyapı (Deployment & Infrastructure)

WhoEstate, **Google Cloud Platform (GCP)** üzerinde modern, sunucusuz (serverless) bir altyapı ile çalışmaktadır. Bu mimari, yüksek performans ve maliyet verimliliği sunar.

-   **Konteynerleştirme:** Uygulama, `Dockerfile` ile bir **Docker** konteyner imajına dönüştürülür. Bu, geliştirme ve üretim ortamları arasında tam bir tutarlılık sağlar.
-   **İmaj Depolama:** Docker imajları, güvenli ve özel bir depo olan **Google Artifact Registry**'de saklanır.
-   **Sunucusuz Çalıştırma:** **Google Cloud Run**, Artifact Registry'deki imajı kullanarak uygulamayı çalıştırır. Cloud Run, gelen trafik yüküne göre otomatik olarak ölçeklenir (scale-to-zero dahil), bu da uygulamanın her zaman optimum kaynak kullanmasını ve maliyetlerin düşük kalmasını sağlar.
-   **Alan Adı ve Erişim:** Cloud Run servisine bağlanan özel bir subdomain, uygulamanın dünya çapında hızlı ve güvenli bir şekilde erişilebilir olmasını sağlar.

---

## 📁 Proje Yapısı

Proje, modülerliği ve okunabilirliği ön planda tutan bir dizin yapısına sahiptir.

```
who_estate_frontend/
├── app/                      # Next.js App Router: Sayfalar, API rotaları ve layout'lar
│   ├── (public)/             # Halka açık sayfalar (Ana sayfa, ilanlar vb.)
│   ├── (admin)/              # Kimlik doğrulaması gerektiren yönetim paneli sayfaları
│   ├── api/                  # Sunucu tarafı API rotaları
│   └── layout.tsx            # Kök layout component'i
├── components/               # Yeniden kullanılabilir React component'leri
│   ├── public/               # Halka açık arayüzde kullanılan component'ler
│   ├── admin/                # Yönetim panelinde kullanılan component'ler
│   └── ui/                   # Shadcn/UI tarafından sağlanan temel UI component'leri
├── lib/                      # Yardımcı modüller ve kütüphane yapılandırmaları
│   ├── axios.ts              # Axios istemcisinin merkezi yapılandırması
│   └── redux/                # Redux store, slice'lar ve provider'lar
├── dto/                      # API veri yapılarını tanımlayan DTO'lar
├── public/                   # Statik varlıklar (resimler, ikonlar vb.)
├── middleware.ts             # Yetkilendirme ve yönlendirme mantığını yöneten middleware
└── ...                       # Diğer yapılandırma dosyaları (package.json, tsconfig.json vb.)