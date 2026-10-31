# Yapay Zekâ ile Çalışma Günlüğü

Araç: Claude (Anthropic), claude.ai
Aşağıdaki prompt'ları sohbette aynen bu şekilde gönderdim. Her birinde YZ'nin ne yaptığını ve benim kararımı yazdım.

---

### Prompt 1
> Portfolyom için site haritası ve hedef kitle öner, tasarım için iki seçenek sun.

**YZ ne yaptı:**
- Hedef kitleyi sıraladı: oyun stüdyoları/işverenler, game jam takım arkadaşları, ders hocası.
- 4 sayfalık site haritası çıkardı.
- İki tasarım önerdi: A) koyu "oyun stüdyosu", B) açık "sade profesyonel".
- Google Fonts'un üçüncü taraf hizmeti olduğunu, gizlilik için sistem fontu kullanmayı önerdi.
- Proje kartları için iki kaynak sundu: kendi oyun projelerim ya da sitede çalışan 3 mini proje.

**Kararım:**
- Tasarımda **A**: oyun sektörüne hitap ediyor.
- Kartlarda **B**: ders kapsamında kalması için Ödev 1 + 3 mini proje.
- Sistem fontu önerisini kabul ettim.

---

### Prompt 2
> Seçtiğim tasarımla 4 sayfayı oluştur.

**YZ ne yaptı:**
- 4 sayfayı, ortak `style.css` dosyasını, SVG avatarı ve proje görsellerini üretti.
- Mini proje seçimini ona bıraktım. Oyun Fikri Üreteci, Zar Atıcı ve Game Jam Geri Sayım'ı seçip yaptı.

**Yakalanan YZ hatası:** Tema ve filtre düğmeleri JS yüklenene kadar `hidden` ile gizli olmalıydı. Ama CSS'teki `display: inline-flex` tanımı `hidden`'ı ezdi. Ekranda tıklanınca hiçbir şey yapmayan düğmeler göründü.
**Düzeltme:** `[hidden] { display: none !important; }` kuralı eklendi.
**Kararım:** Kabul (düzeltme sonrası).

---

### Prompt 3
> Siteye en az 4 JavaScript etkileşimi ekle.

**YZ ne yaptı:** 4 etkileşim ekledi: tema düğmesi, mobil menü, proje filtreleme/arama, form doğrulama (karakter sayacı ve geri bildirim mesajıyla).

**Yakalanan YZ hatası:** `script.js` ile mini proje dosyaları aynı sayfada `const form` adında değişken tanımlıyordu. Tarayıcı "Identifier 'form' has already been declared" hatası verdi. Zar Atıcı ve Geri Sayım tamamen çalışmaz hale geldi.
**Düzeltme:** Her JS dosyasının içeriği ayrı bir fonksiyonun içine alındı (`(function () { ... })();`). Böylece değişkenler dosya dışına taşmıyor.

**Kararım:**
- Düzeltme sonrası kabul.
- Tema için iki seçenek sundu: A) sistem temasına uy, B) her zaman koyu başla. **A**'yı seçtim.

---

### Prompt 4
> Siteyi erişilebilirlik ve güvenlik açısından kontrol et, eksikleri listele.

**YZ ne yaptı:** axe-core aracıyla 7 sayfayı iki temada taradı. Klavye ve güvenlik kontrollerini elle yaptı. **Kendi ürettiği kodda 5 eksik buldu:**

1. **Mobil menü açılınca Tab menüye gitmiyor.** Klavye kullanıcısı menü linklerine ulaşamıyordu.
2. **Projeler sayfasında başlık seviyesi atlıyor** (`h1` → `h3`).
3. **3 farklı sayfaya giden 3 link de sadece "Dene" diyor.** Ekran okuyucuda ayırt edilemiyordu.
4. **İçerik Güvenlik Politikası (CSP) yok.**
5. **E-posta adresi 5 sayfada açık duruyor.** Spam botları için risk.

**Kararım: B, hepsini düzelt.**
1. Menü açılınca odak ilk bağlantıya taşındı.
2. Gizli `h2` başlık eklendi.
3. Linkler ekran okuyucuya "Dene: Zar Atıcı" olarak okunuyor.
4. Her sayfaya CSP eklendi.
5. E-posta tüm sayfalardan kaldırıldı.

CSP, satır içi `style=""` kullanımını engellediği için o stil CSS sınıfına taşındı. Sonraki taramada test aracının kendi script'i de CSP tarafından engellendi. Kuralın çalıştığı böylece görüldü. Tekrar taramada axe: 0 hata.

---

### Prompt 5
> Siteyi telefon, tablet ve masaüstünde test et.

**YZ ne yaptı:** 390px, 820px ve 1440px genişlikte 5 sayfayı test etti. Hiçbir boyutta yatay taşma ve JS hatası yok. Kart sütunları 1/2/3, menü telefonda açılır şekilde çalışıyor.

İki sorun buldu:
1. Alt bilgi ve "Projelere dön" gibi yazı linklerinin dokunma alanı 24px'in altında.
2. Tablette "Neler yapıyorum?" bölümündeki 3. kart tek başına kalıyor.

**Kararım: B.** Sadece erişilebilirlikle ilgili olan 1. sorun düzeltildi (linklere dolgu eklendi). Kart düzeni görsel bir tercih olduğu için olduğu gibi kaldı.

---

### Prompt 6
> İletişim formunu hatalı girdilerle test et.

**YZ ne yaptı:** Formu 12 senaryoyla test etti:
- boş ve sadece boşluklu alanlar
- 1 karakterlik ad
- 4 farklı geçersiz e-posta
- kısa mesaj, 600 karakterlik mesaj
- Türkçe karakter
- `<script>` ve `<img onerror>` girişi

Hepsi beklendiği gibi çalıştı. Kod girişi çalıştırılmadı, düz metin olarak gösterildi. Ancak ad alanının `<script>alert(1)</script>` ifadesini geçerli bir ad olarak kabul ettiğini belirtti ve sadece harf kabul eden bir kural önerdi.

**Kararım: Red (B).** Girdi zaten `textContent` ile yazıldığı için güvenlik riski yok. Yabancı isimleri yanlışlıkla reddetmemek için kural eklemedim.
