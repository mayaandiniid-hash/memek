import { EducationLevel, LearningModule } from '../types';

export function determineEducationLevel(age: number): EducationLevel {
  if (age <= 12) return 'SD';
  if (age <= 15) return 'SMP';
  if (age <= 18) return 'SMA';
  if (age <= 24) return 'KULIAH';
  return 'UMUM';
}

export function getEducationLevelLabel(level: EducationLevel): string {
  switch (level) {
    case 'SD':
      return 'Tingkat SD (Sekolah Dasar)';
    case 'SMP':
      return 'Tingkat SMP (Sekolah Menengah Pertama)';
    case 'SMA':
      return 'Tingkat SMA (Sekolah Menengah Atas)';
    case 'SMK':
      return 'Tingkat SMK (Kejuruan)';
    case 'KULIAH':
      return 'Tingkat Perguruan Tinggi / Mahasiswa';
    case 'UMUM':
      return 'Tingkat Umum & Pengembangan Keahlian';
  }
}

export function getAurelRecommendation(name: string, age: number, level: EducationLevel): {
  recommendationText: string;
  firstSubject: string;
  startingChapter: string;
} {
  if (level === 'SD') {
    return {
      recommendationText: `Berdasarkan usiamu yang ke-${age} tahun pada jenjang SD, materi pertama yang tersedia untukmu adalah Matematika Dasar. Kamu bisa mulai dari Bab 1 untuk membangun dasar logika berhitung yang kuat.`,
      firstSubject: 'Matematika Dasar SD',
      startingChapter: 'Bab 1: Bilangan & Operasi Hitung',
    };
  } else if (level === 'SMP') {
    return {
      recommendationText: `Melihat usiamu ${age} tahun pada jenjang SMP, materi pertama yang tersedia untukmu adalah Ilmu Pengetahuan Alam dan Aljabar. Kamu bisa mulai dari Bab 1 untuk memahami konsep sains terpadu.`,
      firstSubject: 'IPA Terpadu & Matematika SMP',
      startingChapter: 'Bab 1: Pengukuran & Besaran Fisika',
    };
  } else if (level === 'SMA') {
    return {
      recommendationText: `Untuk usiamu ${age} tahun di jenjang SMA, fokus materi pembelajaran disiapkan untuk penguatan penalaran sains dan logika analitis. Materi pertama yang tersedia untukmu adalah Matematika Saintek. Kamu bisa mulai dari Bab 1.`,
      firstSubject: 'Matematika Saintek SMA',
      startingChapter: 'Bab 1: Fungsi, Matriks & Logika Proposisi',
    };
  } else if (level === 'SMK') {
    return {
      recommendationText: `Sebagai pelajar jenjang SMK berusia ${age} tahun, materi difokuskan pada keterampilan terapan dan pemecahan masalah teknis. Kamu bisa mulai dari Bab 1.`,
      firstSubject: 'Matematika Terapan & Logika Komputasi',
      startingChapter: 'Bab 1: Algoritma Dasar & Aljabar Terapan',
    };
  } else if (level === 'KULIAH') {
    return {
      recommendationText: `Bagi mahasiswa berusia ${age} tahun di jenjang Perguruan Tinggi, kurikulum berpusat pada metodologi analisis kritis dan penalaran statistik. Materi pertama yang tersedia untukmu adalah Analisis Data & Logika Kritis. Mulailah dari Bab 1.`,
      firstSubject: 'Metodologi & Penalaran Kuantitatif',
      startingChapter: 'Bab 1: Statistika Inferensial & Metode Analitik',
    };
  } else {
    return {
      recommendationText: `Berdasarkan usiamu yang menginjak ${age} tahun, materi dirancang dengan kurikulum adaptif seumur hidup. Materi pertama yang tersedia untukmu adalah Literasi Digital dan Logika Penalaran. Kamu bisa mulai dari Bab 1.`,
      firstSubject: 'Literasi Digital & Pemikiran Terstruktur',
      startingChapter: 'Bab 1: Pemecahan Masalah Sistematis',
    };
  }
}

export const MODULES_BY_LEVEL: Record<EducationLevel, LearningModule[]> = {
  SD: [
    {
      id: 'sd-math-1',
      title: 'Matematika Dasar & Logika',
      subject: 'Matematika',
      description: 'Mengenal bilangan bulat, pecahan sederhana, dan operasi hitung sehari-hari.',
      targetLevel: 'SD',
      chaptersCount: 5,
      completedChapters: 1,
      questions: [
        {
          id: 'q1',
          question: 'Berapakah hasil dari 25 ditambah 18 dikurangi 13?',
          options: ['28', '30', '32', '35'],
          correctIndex: 1,
          explanation: '25 + 18 = 43. Kemudian 43 - 13 = 30.',
        },
        {
          id: 'q2',
          question: 'Sebuah toko memiliki 4 kotak apel. Setiap kotak berisi 12 apel. Berapa jumlah seluruh apel?',
          options: ['36', '42', '48', '52'],
          correctIndex: 2,
          explanation: '4 kotak dikali 12 apel = 48 apel.',
        },
        {
          id: 'q3',
          question: 'Bentuk desimal dari pecahan satu per empat (1/4) adalah...',
          options: ['0.25', '0.50', '0.75', '0.20'],
          correctIndex: 0,
          explanation: '1 dibagi 4 sama dengan 0.25.',
        },
        {
          id: 'q4',
          question: 'Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku disebut...',
          options: ['Persegi Panjang', 'Persegi', 'Trapesium', 'Belah Ketupat'],
          correctIndex: 1,
          explanation: 'Persegi memiliki keempat sisi sama panjang dan semua sudut 90 derajat.',
        },
        {
          id: 'q5',
          question: 'Ibu membeli 3 kg beras seharga Rp 36.000. Berapakah harga 1 kg beras?',
          options: ['Rp 10.000', 'Rp 11.000', 'Rp 12.000', 'Rp 13.000'],
          correctIndex: 2,
          explanation: 'Rp 36.000 dibagi 3 = Rp 12.000 per kg.',
        },
      ],
    },
    {
      id: 'sd-sci-1',
      title: 'Ilmu Alam & Lingkungan',
      subject: 'Sains',
      description: 'Memahami siklus air, bagian tumbuhan, dan adaptasi hewan.',
      targetLevel: 'SD',
      chaptersCount: 4,
      completedChapters: 0,
      questions: [
        {
          id: 'qs1',
          question: 'Bagian tumbuhan yang bertugas menyerap air dan zat hara dari tanah adalah...',
          options: ['Daun', 'Batang', 'Akar', 'Bunga'],
          correctIndex: 2,
          explanation: 'Akar berfungsi menyerap air dan unsur hara di dalam tanah.',
        },
        {
          id: 'qs2',
          question: 'Proses perubahan wujud dari benda cair menjadi gas disebut...',
          options: ['Membeku', 'Menguap', 'Mengembun', 'Menyublim'],
          correctIndex: 1,
          explanation: 'Air yang dipanaskan berubah menjadi uap melalui proses penguapan.',
        },
      ],
    },
  ],
  SMP: [
    {
      id: 'smp-math-1',
      title: 'Aljabar & Persamaan Linear',
      subject: 'Matematika',
      description: 'Pengenalan variabel, relasi fungsi, dan sistem persamaan linear dua variabel.',
      targetLevel: 'SMP',
      chaptersCount: 6,
      completedChapters: 1,
      questions: [
        {
          id: 'qm1',
          question: 'Jika 3x + 5 = 20, maka nilai x adalah...',
          options: ['3', '4', '5', '6'],
          correctIndex: 2,
          explanation: '3x = 20 - 5 = 15. x = 15 / 3 = 5.',
        },
        {
          id: 'qm2',
          question: 'Hasil pemfaktoran dari x² - 9 adalah...',
          options: ['(x - 3)(x - 3)', '(x + 3)(x - 3)', '(x + 9)(x - 1)', '(x - 9)(x + 1)'],
          correctIndex: 1,
          explanation: 'Selisih kuadrat a² - b² = (a + b)(a - b). Jadi x² - 9 = (x + 3)(x - 3).',
        },
        {
          id: 'qm3',
          question: 'Gradien garis dari persamaan y = 4x - 7 adalah...',
          options: ['-7', '4', '-4', '7'],
          correctIndex: 1,
          explanation: 'Bentuk y = mx + c memiliki gradien m = 4.',
        },
        {
          id: 'qm4',
          question: 'Keliling sebuah persegi panjang adalah 40 cm. Jika panjangnya 12 cm, berapa lebarnya?',
          options: ['6 cm', '8 cm', '10 cm', '14 cm'],
          correctIndex: 1,
          explanation: 'K = 2(p + l) -> 40 = 2(12 + l) -> 20 = 12 + l -> l = 8 cm.',
        },
        {
          id: 'qm5',
          question: 'Dalam sebuah diagram Venn, himpunan semesta memiliki 30 anggota. Himpunan A memiliki 15, B memiliki 18, dan irisan A dan B adalah 8. Berapa anggota yang bukan A maupun B?',
          options: ['3', '5', '7', '9'],
          correctIndex: 1,
          explanation: 'Gabungan A dan B = 15 + 18 - 8 = 25. Anggota di luar gabungan = 30 - 25 = 5.',
        },
      ],
    },
    {
      id: 'smp-sci-1',
      title: 'Gerak, Gaya & Energi Terpadu',
      subject: 'Fisika & IPA',
      description: 'Hukum Newton, usaha daya, dan perubahan energi kinetik serta potensial.',
      targetLevel: 'SMP',
      chaptersCount: 5,
      completedChapters: 0,
      questions: [
        {
          id: 'qsf1',
          question: 'Satuan standar internasional (SI) untuk gaya adalah...',
          options: ['Joule', 'Watt', 'Newton', 'Pascal'],
          correctIndex: 2,
          explanation: 'Satuan SI untuk gaya adalah Newton (N).',
        },
      ],
    },
  ],
  SMA: [
    {
      id: 'sma-math-1',
      title: 'Kalkulus & Analisis Fungsi',
      subject: 'Matematika Saintek',
      description: 'Limit fungsi aljabar, turunan pertama, integral tentu, dan penerapan optimum.',
      targetLevel: 'SMA',
      chaptersCount: 8,
      completedChapters: 1,
      questions: [
        {
          id: 'qsm1',
          question: 'Turunan pertama dari f(x) = 3x³ - 5x² + 4x - 2 adalah...',
          options: [
            '9x² - 10x + 4',
            '6x² - 10x + 4',
            '9x² - 5x + 4',
            '3x² - 10x + 2',
          ],
          correctIndex: 0,
          explanation: 'f\'(x) = 3*(3x²) - 2*(5x) + 4 = 9x² - 10x + 4.',
        },
        {
          id: 'qsm2',
          question: 'Nilai dari limit x mendekati 0 untuk (sin 2x) / x adalah...',
          options: ['0', '1', '2', 'Tidak terdefinisi'],
          correctIndex: 2,
          explanation: 'Limit (sin ax)/x saat x -> 0 adalah a, sehingga nilainya 2.',
        },
        {
          id: 'qsm3',
          question: 'Berapakah determinan dari matriks [[2, 4], [1, 5]]?',
          options: ['6', '8', '10', '14'],
          correctIndex: 0,
          explanation: 'Determinan = (2 * 5) - (4 * 1) = 10 - 4 = 6.',
        },
        {
          id: 'qsm4',
          question: 'Peluang munculnya jumlah mata dadu 7 pada pelemparan dua buah dadu bermata enam adalah...',
          options: ['1/6', '5/36', '7/36', '1/12'],
          correctIndex: 0,
          explanation: 'Kombinasi berjumlah 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 kombinasi. 6/36 = 1/6.',
        },
        {
          id: 'qsm5',
          question: 'Integral tentu dari 2x dx dari x = 0 sampai x = 3 adalah...',
          options: ['6', '9', '12', '18'],
          correctIndex: 1,
          explanation: 'Antiturunan 2x adalah x². Evaluasi dari 0 ke 3: 3² - 0² = 9.',
        },
      ],
    },
  ],
  SMK: [
    {
      id: 'smk-tech-1',
      title: 'Algoritma & Pemecahan Masalah Terapan',
      subject: 'Teknologi & Matematika Terapan',
      description: 'Struktur logika, alur diagram alir, dan optimasi kerja terapan.',
      targetLevel: 'SMK',
      chaptersCount: 6,
      completedChapters: 1,
      questions: [
        {
          id: 'qsk1',
          question: 'Dalam struktur algoritma percabangan, instruksi yang tepat untuk memeriksa kondisi bersyarat adalah...',
          options: ['Loop / While', 'If - Else', 'Break', 'Array Index'],
          correctIndex: 1,
          explanation: 'Struktur percabangan bersyarat menggunakan sintaks logika If - Else.',
        },
        {
          id: 'qsk2',
          question: 'Sebuah perangkat menyerap arus 2 Ampere pada tegangan 220 Volt. Berapa daya yang diserap?',
          options: ['110 Watt', '220 Watt', '440 Watt', '880 Watt'],
          correctIndex: 2,
          explanation: 'Daya P = V * I = 220 Volt * 2 Ampere = 440 Watt.',
        },
        {
          id: 'qsk3',
          question: 'Kompleksitas waktu pencarian biner (Binary Search) pada deret data terurut adalah...',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 1,
          explanation: 'Binary Search membagi ruang pencarian menjadi dua pada tiap iterasi, yaitu O(log n).',
        },
        {
          id: 'qsk4',
          question: 'Berapakah efisiensi mesin jika daya masukan 500 Watt dan daya keluaran berguna 400 Watt?',
          options: ['70%', '75%', '80%', '85%'],
          correctIndex: 2,
          explanation: 'Efisiensi = (400 / 500) * 100% = 80%.',
        },
        {
          id: 'qsk5',
          question: 'Bilangan biner 1010 bernilai desimal sama dengan...',
          options: ['8', '10', '12', '14'],
          correctIndex: 1,
          explanation: '1*2³ + 0*2² + 1*2¹ + 0*2⁰ = 8 + 0 + 2 + 0 = 10.',
        },
      ],
    },
  ],
  KULIAH: [
    {
      id: 'kuliah-stat-1',
      title: 'Statistika Inferensial & Metodologi Analitik',
      subject: 'Penalaran Kuantitatif',
      description: 'Pengujian hipotesis, signifikansi statistik (p-value), dan model regresi multivariat.',
      targetLevel: 'KULIAH',
      chaptersCount: 7,
      completedChapters: 1,
      questions: [
        {
          id: 'qk1',
          question: 'Dalam uji hipotesis, kesalahan tipe I (Type I Error) terjadi ketika...',
          options: [
            'Menolak H0 padahal H0 benar',
            'Menerima H0 padahal H0 salah',
            'Menentukan sampel terlalu sedikit',
            'Menghitung varians secara keliru',
          ],
          correctIndex: 0,
          explanation: 'Type I Error adalah penolakan terhadap hipotesis nol (H0) yang sesungguhnya benar.',
        },
        {
          id: 'qk2',
          question: 'Jika p-value yang diperoleh bernilai 0.012 pada taraf signifikansi alpha = 0.05, maka kesimpulannya adalah...',
          options: [
            'H0 diterima karena p-value > alpha',
            'Tolak H0 karena p-value < alpha',
            'Uji statistik tidak valid',
            'Perlu menambah variabel bebas',
          ],
          correctIndex: 1,
          explanation: 'Karena p-value (0.012) lebih kecil dari taraf signifikansi (0.05), bukti empiris cukup untuk menolak H0.',
        },
        {
          id: 'qk3',
          question: 'Koefisien determinasi (R²) mengukur...',
          options: [
            'Rata-rata kesalahan residu',
            'Proporsi variansi variabel dependen yang dijelaskan oleh variabel independen',
            'Korelasi linier tunggal antara dua variabel acak kontinu',
            'Kemiringan garis regresi optimal',
          ],
          correctIndex: 1,
          explanation: 'R² merefleksikan persentase variabilitas variabel terikat yang dapat diterangkan oleh model regresi.',
        },
        {
          id: 'qk4',
          question: 'Distribusi probabilitas kontinu yang simetris dan berbentuk lonceng dengan rata-rata 0 dan variansi 1 disebut...',
          options: ['Distribusi Poisson', 'Distribusi Normal Baku (Standard Normal)', 'Distribusi Binomial', 'Distribusi Eksponensial'],
          correctIndex: 1,
          explanation: 'Distribusi normal standar (Z-distribution) memiliki mean 0 dan variansi 1.',
        },
        {
          id: 'qk5',
          question: 'Metode pengambilan sampel acak di mana populasi dibagi menjadi strata homogen terlebih dahulu disebut...',
          options: ['Cluster Sampling', 'Stratified Random Sampling', 'Convenience Sampling', 'Snowball Sampling'],
          correctIndex: 1,
          explanation: 'Stratified Random Sampling membagi populasi ke dalam subkelompok/strata sebelum penarikan sampel.',
        },
      ],
    },
  ],
  UMUM: [
    {
      id: 'umum-crit-1',
      title: 'Pemikiran Kritis & Pemecahan Masalah Sistematis',
      subject: 'Logika & Keterampilan Analisis',
      description: 'Menganalisis bias kognitif, validitas argumen deduktif, dan pengambilan keputusan berbasis bukti.',
      targetLevel: 'UMUM',
      chaptersCount: 5,
      completedChapters: 1,
      questions: [
        {
          id: 'qu1',
          question: 'Kesesatan berpikir (logical fallacy) di mana seseorang menyerang pribadi lawan bicara dan bukan argumennya disebut...',
          options: ['Ad Hominem', 'Strawman Fallacy', 'False Dilemma', 'Slippery Slope'],
          correctIndex: 0,
          explanation: 'Ad Hominem adalah serangan langsung terhadap karakter pribadi lawan bicara untuk mendiskreditkan argumennya.',
        },
        {
          id: 'qu2',
          question: 'Kecenderungan untuk hanya mencari dan mempercayai informasi yang mengonfirmasi keyakinan awal disebut...',
          options: ['Availability Heuristic', 'Confirmation Bias', 'Sunk Cost Fallacy', 'Dunning-Kruger Effect'],
          correctIndex: 1,
          explanation: 'Confirmation Bias membuat individu mengabaikan bukti berlawanan dan memprioritaskan data yang selaras dengan persepsinya.',
        },
        {
          id: 'qu3',
          question: 'Metode root cause analysis yang berulang kali menanyakan penyebab hingga akar persoalan terungkap dikenal sebagai metode...',
          options: ['5 Whys', 'SWOT Analysis', 'Pareto 80/20', 'Fishbone Matrix'],
          correctIndex: 0,
          explanation: 'Teknik 5 Whys dikembangkan oleh Sakichi Toyoda untuk menggali sumber masalah melalui pengulangan pertanyaan mengapa.',
        },
        {
          id: 'qu4',
          question: 'Prinsip Pareto menyatakan bahwa sekitar 80% dampak umumnya disebabkan oleh...',
          options: ['80% penyebab acak', '20% penyebab utama', '50% faktor eksternal', '100% kondisi darurat'],
          correctIndex: 1,
          explanation: 'Prinsip Pareto (80/20) menunjukkan ketidakseimbangan di mana sebagian kecil penyebab (20%) menghasilkan mayoritas hasil (80%).',
        },
        {
          id: 'qu5',
          question: 'Dalam manajemen waktu, kuadran II pada matriks Eisenhower berfokus pada aktivitas yang bersifat...',
          options: ['Mendesak dan Penting', 'Tidak Mendesak tetapi Penting', 'Mendesak tetapi Tidak Penting', 'Tidak Mendesak dan Tidak Penting'],
          correctIndex: 1,
          explanation: 'Kuadran II berisi aktivitas pencegahan, perencanaan, dan pengembangan diri yang krusial bagi keberhasilan jangka panjang.',
        },
      ],
    },
  ],
};
