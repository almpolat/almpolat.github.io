// Zar Atıcı: seçilen türde, istenen sayıda zar atar ve toplamı gösterir.
const form = document.getElementById("zar-formu");
const adetKutusu = document.getElementById("zar-adet");
const turKutusu = document.getElementById("zar-tur");
const sonuc = document.getElementById("zar-sonuc");
const hata = document.getElementById("zar-hata");

// 1 ile yuz arasında rastgele bir tam sayı döndürür
function zarAt(yuz) {
  return Math.floor(Math.random() * yuz) + 1;
}

form.addEventListener("submit", function (olay) {
  olay.preventDefault();
  const adet = Number(adetKutusu.value);
  const yuz = Number(turKutusu.value);

  // Girdi doğrulama: 1-10 arası tam sayı olmalı
  if (!Number.isInteger(adet) || adet < 1 || adet > 10) {
    hata.textContent = "Zar sayısı 1 ile 10 arasında bir tam sayı olmalı.";
    adetKutusu.setAttribute("aria-invalid", "true");
    adetKutusu.focus();
    return;
  }
  hata.textContent = "";
  adetKutusu.removeAttribute("aria-invalid");

  const atislar = [];
  let toplam = 0;
  for (let i = 0; i < adet; i++) {
    const deger = zarAt(yuz);
    atislar.push(deger);
    toplam += deger;
  }
  sonuc.textContent = adet + "d" + yuz + ": " + atislar.join(" + ") + " = " + toplam;
});
