// Oyun Fikri Üreteci: üç diziden birer rastgele eleman seçip birleştirir.
const turler = ["Roguelike", "Platform", "Bulmaca", "Kule savunması", "Ritim", "Hayatta kalma", "Kart oyunu", "Yarış"];
const mekanikler = ["zamanı geri sarma", "yer çekimini değiştirme", "tek tuşla oynanış", "klonlarla iş birliği", "ışık ve gölge", "her ölümde harita değişir", "sesle kontrol", "eşya birleştirme"];
const temalar = ["deniz altı", "uzay istasyonu", "terk edilmiş lunapark", "mikro dünya (karınca boyutu)", "rüya alemi", "kıyamet sonrası İstanbul", "piksel orman", "buzul çağı"];

// Bir diziden rastgele bir eleman döndürür
function rastgeleSec(dizi) {
  const indeks = Math.floor(Math.random() * dizi.length);
  return dizi[indeks];
}

const cikti = document.getElementById("fikir");
document.getElementById("fikir-btn").addEventListener("click", function () {
  const fikir = rastgeleSec(turler) + " + " + rastgeleSec(mekanikler) + " + " + rastgeleSec(temalar);
  cikti.textContent = fikir; // textContent: metin HTML olarak yorumlanmaz
});
