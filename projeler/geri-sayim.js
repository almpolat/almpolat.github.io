// Game Jam Geri Sayım: girilen saat kadar geri sayar.

(function () {
  "use strict";

  const form = document.getElementById("sayac-formu");
  const saatKutusu = document.getElementById("saat");
  const kalanYazi = document.getElementById("kalan");
  const durum = document.getElementById("sayac-durum");
  const hata = document.getElementById("sayac-hata");
  const durdurBtn = document.getElementById("durdur-btn");

  let zamanlayici = null;
  let bitisZamani = 0;

  // Saniyeyi "SS:DD:ss" biçimine çevirir (ör. 3725 -> 01:02:05)
  function bicimlendir(saniye) {
    const s = Math.floor(saniye / 3600);
    const d = Math.floor((saniye % 3600) / 60);
    const sn = saniye % 60;
    return [s, d, sn].map(function (x) { return String(x).padStart(2, "0"); }).join(":");
  }

  function guncelle() {
    const kalan = Math.max(0, Math.round((bitisZamani - Date.now()) / 1000));
    kalanYazi.textContent = bicimlendir(kalan);
    if (kalan === 0) {
      durdur();
      durum.textContent = "Süre doldu! Oyununu teslim etmeyi unutma.";
    }
  }

  function durdur() {
    clearInterval(zamanlayici);
    zamanlayici = null;
    durdurBtn.disabled = true;
  }

  form.addEventListener("submit", function (olay) {
    olay.preventDefault();
    const saat = Number(saatKutusu.value);
    if (!Number.isInteger(saat) || saat < 1 || saat > 72) {
      hata.textContent = "Süre 1 ile 72 saat arasında bir tam sayı olmalı.";
      saatKutusu.setAttribute("aria-invalid", "true");
      saatKutusu.focus();
      return;
    }
    hata.textContent = "";
    saatKutusu.removeAttribute("aria-invalid");

    durdur();
    bitisZamani = Date.now() + saat * 3600 * 1000;
    durum.textContent = saat + " saatlik geri sayım başladı.";
    guncelle();
    zamanlayici = setInterval(guncelle, 1000);
    durdurBtn.disabled = false;
  });

  durdurBtn.addEventListener("click", function () {
    durdur();
    durum.textContent = "Geri sayım durduruldu.";
  });
})();
