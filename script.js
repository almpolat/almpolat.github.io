/* =========================================================
   Alimert Polat – Portfolyo | Ortak JavaScript dosyası
   Etkileşimler:
   1) Karanlık / açık tema düğmesi (tercih hatırlanır)
   2) Mobil menü (aç/kapat, Esc ile kapanır)
   3) Proje filtreleme ve arama
   4) İletişim formu doğrulama + karakter sayacı + geri bildirim mesajı
   ========================================================= */

// DUZELTME: Kod bir fonksiyonun içine alındı: değişkenler (ör. form) sadece bu dosyada geçerli olur
// ve mini proje dosyalarındaki aynı isimli değişkenlerle çakışmaz.
(function () {
  "use strict";

  // JS çalışıyor: CSS'teki mobil menü kuralları bu sınıfa bağlı
  document.documentElement.classList.add("js");

  /* ---------- 1) Tema düğmesi ---------- */
  const TEMA_ANAHTARI = "tema";

  // Tarayıcı depolaması bazı durumlarda (gizli sekme vb.) hata verebilir
  function temaOku() {
    try { return localStorage.getItem(TEMA_ANAHTARI); } catch (e) { return null; }
  }
  function temaKaydet(deger) {
    try { localStorage.setItem(TEMA_ANAHTARI, deger); } catch (e) { /* yoksay */ }
  }

  function temaUygula(tema) {
    const temaBtn = document.querySelector(".theme-toggle");
    if (tema === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (temaBtn) {
      const acik = tema === "light";
      temaBtn.textContent = acik ? "☾" : "☀";
      temaBtn.setAttribute("aria-label", acik ? "Koyu temaya geç" : "Açık temaya geç");
    }
  }

  // Kayıtlı tercih yoksa ziyaretçinin sistem temasına uyulur
  function sistemTemasi() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  temaUygula(temaOku() || sistemTemasi());

  const temaBtn = document.querySelector(".theme-toggle");
  if (temaBtn) {
    temaBtn.hidden = false;
    temaBtn.addEventListener("click", function () {
      const yeni = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      temaUygula(yeni);
      temaKaydet(yeni);
    });
  }

  /* ---------- 2) Mobil menü ---------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-nav");

  function menuKapat() {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Menüyü aç");
    menuBtn.textContent = "☰";
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      const acik = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(acik));
      menuBtn.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
      menuBtn.textContent = acik ? "✕" : "☰";
    });

    // Esc tuşu menüyü kapatır ve odağı düğmeye geri verir
    document.addEventListener("keydown", function (olay) {
      if (olay.key === "Escape" && menu.classList.contains("open")) {
        menuKapat();
        menuBtn.focus();
      }
    });
  }

  /* ---------- 3) Proje filtreleme ve arama ---------- */
  const filtreGrubu = document.querySelector(".filter-group");
  const aramaKutusu = document.getElementById("proje-ara");

  if (filtreGrubu && aramaKutusu) {
    const kartlar = document.querySelectorAll("#proje-listesi .project-card");
    const filtreBtnleri = filtreGrubu.querySelectorAll(".filter-btn");
    const bosMesaj = document.getElementById("bos-mesaj");
    const durum = document.getElementById("sonuc-durumu");
    let seciliKategori = "all";

    // JS çalışınca filtre ve arama görünür hale gelir
    filtreGrubu.hidden = false;
    aramaKutusu.closest(".search-box").hidden = false;

    function projeleriGuncelle() {
      const aranan = aramaKutusu.value.trim().toLocaleLowerCase("tr");
      let gorunenSayisi = 0;

      kartlar.forEach(function (kart) {
        const kategoriUyuyor = seciliKategori === "all" || kart.dataset.category === seciliKategori;
        const metinUyuyor = kart.textContent.toLocaleLowerCase("tr").includes(aranan);
        const goster = kategoriUyuyor && metinUyuyor;
        kart.hidden = !goster;
        if (goster) gorunenSayisi++;
      });

      bosMesaj.hidden = gorunenSayisi > 0;
      durum.textContent = gorunenSayisi + " proje gösteriliyor.";
    }

    filtreBtnleri.forEach(function (btn) {
      btn.addEventListener("click", function () {
        seciliKategori = btn.dataset.filter;
        filtreBtnleri.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        projeleriGuncelle();
      });
    });

    aramaKutusu.addEventListener("input", projeleriGuncelle);
  }

  /* ---------- 4) İletişim formu doğrulama ---------- */
  const form = document.getElementById("iletisim-formu");

  if (form) {
    const adKutusu = document.getElementById("ad");
    const epostaKutusu = document.getElementById("eposta");
    const mesajKutusu = document.getElementById("mesaj");
    const sayac = document.getElementById("mesaj-sayac");
    const formDurumu = document.getElementById("form-durumu");
    const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Her alan için kural: hata varsa mesaj döndürür, yoksa boş metin
    const kurallar = {
      ad: function (deger) {
        if (deger === "") return "Lütfen adınızı yazın.";
        if (deger.length < 2) return "Ad en az 2 karakter olmalı.";
        return "";
      },
      eposta: function (deger) {
        if (deger === "") return "Lütfen e-posta adresinizi yazın.";
        if (!EPOSTA_DESENI.test(deger)) return "Geçerli bir e-posta girin (ör. ad@ornek.com).";
        return "";
      },
      mesaj: function (deger) {
        if (deger === "") return "Lütfen bir mesaj yazın.";
        if (deger.length < 10) return "Mesaj en az 10 karakter olmalı.";
        return "";
      }
    };

    // Bir alanı kontrol eder, hatayı alanın altına yazar; geçerliyse true döndürür
    function alanKontrol(kutu) {
      const hata = kurallar[kutu.name](kutu.value.trim());
      const hataYeri = document.getElementById(kutu.id + "-hata");
      hataYeri.textContent = hata;
      if (hata) {
        kutu.setAttribute("aria-invalid", "true");
      } else {
        kutu.removeAttribute("aria-invalid");
      }
      return hata === "";
    }

    [adKutusu, epostaKutusu, mesajKutusu].forEach(function (kutu) {
      // Kullanıcı alandan çıkınca kontrol et
      kutu.addEventListener("blur", function () { alanKontrol(kutu); });
      // Hatalı alan düzeltilirken hatayı canlı güncelle
      kutu.addEventListener("input", function () {
        if (kutu.getAttribute("aria-invalid") === "true") alanKontrol(kutu);
      });
    });

    // Karakter sayacı
    mesajKutusu.addEventListener("input", function () {
      sayac.textContent = mesajKutusu.value.length + " / 500";
    });

    form.addEventListener("submit", function (olay) {
      olay.preventDefault(); // Sayfa yenilenmesin; form bir sunucuya gönderilmiyor

      const sonuclar = [adKutusu, epostaKutusu, mesajKutusu].map(alanKontrol);
      const ilkHatali = [adKutusu, epostaKutusu, mesajKutusu].find(function (kutu, i) { return !sonuclar[i]; });

      if (ilkHatali) {
        formDurumu.className = "form-status error";
        formDurumu.textContent = "Lütfen işaretli alanları düzeltin.";
        ilkHatali.focus();
        return;
      }

      // textContent kullanılır: kullanıcının yazdığı metin HTML olarak çalıştırılmaz
      formDurumu.className = "form-status success";
      formDurumu.textContent = "Teşekkürler " + adKutusu.value.trim() + "! Mesajınız doğrulandı. (Bu bir demo formdur; mesaj bir yere gönderilmez.)";
      form.reset();
      sayac.textContent = "0 / 500";
    });
  }
})();
