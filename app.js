// ====================================================================
// URL APPS SCRIPT
// ====================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2QHLfpMW-LN8NKybSdG6i9giPrL7luHgSJIauIzxxduhephhBR3FQTTFA7nCNPKNslQ/exec'; 

const form = document.getElementById('anamnesaForm');
const pesanStatus = document.getElementById('pesanStatus');

// Tambahan untuk halaman sukses
const formContainer = document.getElementById('form-container');
const thankYouPage = document.getElementById('thank-you-page');
const participantNameDisplay = document.getElementById('participant-name-display');


// ========================================================
// 1. CONDITIONAL DISPLAY — KELUHAN SEKARANG
// ========================================================
const keluhanAda = document.getElementById('keluhan_ada');
const keluhanTidak = document.getElementById('keluhan_tidak');
const keluhanContainer = document.getElementById('keluhan_sebutkan_container');
const keluhanInput = document.getElementById('keluhan_sebutkan_input');

function toggleKeluhanField() {
    if (keluhanAda.checked) {
        keluhanContainer.style.display = 'block';
        keluhanInput.required = true;
    } else {
        keluhanContainer.style.display = 'none';
        keluhanInput.value = '';
        keluhanInput.required = false;
    }
}

keluhanAda.addEventListener('change', toggleKeluhanField);
keluhanTidak.addEventListener('change', toggleKeluhanField);
toggleKeluhanField();


// ========================================================
// 2. CONDITIONAL DISPLAY — PENYAKIT KELUARGA LAINNYA
// ========================================================
const radioYa = document.getElementById('kel_lainnya_ya');
const radioTidak = document.getElementById('kel_lainnya_tidak');
const sebutkanContainer = document.getElementById('sebutkan_lainnya_container');
const sebutkanInput = document.getElementById('kel_lainnya_sebutkan_input');

function toggleSebutkanField() {
    if (radioYa.checked) {
        sebutkanContainer.style.display = 'block';
        sebutkanInput.required = true;
    } else {
        sebutkanContainer.style.display = 'none';
        sebutkanInput.value = '';
        sebutkanInput.required = false;
    }
}

radioYa.addEventListener('change', toggleSebutkanField);
radioTidak.addEventListener('change', toggleSebutkanField);
toggleSebutkanField();


// ========================================================
// 3. CONDITIONAL DISPLAY — RIWAYAT PENYAKIT SENDIRI (ALERGI & LAIN-LAIN)
// ========================================================

function setupRiwayatSebutkan(radioAdaId, radioTidakId, containerId, inputId) {
    const radioAda = document.getElementById(radioAdaId);
    const radioTidak = document.getElementById(radioTidakId);
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);

    function toggleField() {
        if (radioAda.checked) {
            container.style.display = 'block';
            input.required = true;
        } else {
            container.style.display = 'none';
            input.value = '';
            input.required = false;
        }
    }

    radioAda.addEventListener('change', toggleField);
    radioTidak.addEventListener('change', toggleField);
    toggleField();
    return toggleField; 
}

// Terapkan untuk H. Alergi Obat/makanan
const toggleAlergiField = setupRiwayatSebutkan(
    'riw_alergi_ada', 
    'riw_alergi_tidak', 
    'riw_alergi_sebutkan_container', 
    'riw_alergi_sebutkan_input'
);

// Terapkan untuk I. Riwayat Penyakit Lainnya
const toggleRiwLainField = setupRiwayatSebutkan(
    'riw_lain_ada', 
    'riw_lain_tidak', 
    'riw_lain_sebutkan_container', 
    'riw_lain_sebutkan_input'
);


// ========================================================
// 4. CONDITIONAL DISPLAY — KEBIASAAN (ALKOHOL, ROKOK)
// ========================================================
function setupConditionalInput(radioYesId, radioNoId, textInputSelector) {
    const yes = document.getElementById(radioYesId);
    const no = document.getElementById(radioNoId);
    const input = document.querySelector(textInputSelector);

    function toggle() {
        if (yes.checked) {
            input.style.display = 'inline-block';
            input.required = true;
        } else {
            input.style.display = 'none';
            input.value = '';
            input.required = false;
        }
    }

    yes.addEventListener('change', toggle);
    no.addEventListener('change', toggle);
    toggle();
}

// Alkohol
setupConditionalInput("alk_ya", "alk_tidak", "input[name='jumlah_alkohol']");

// Merokok
setupConditionalInput("rokok_ya", "rokok_tidak", "input[name='jumlah_rokok']");


// ========================================================
// 4B. CONDITIONAL DISPLAY — OLAHRAGA (frekuensi + jenis)
// ========================================================
const olYa = document.getElementById("ol_ya");
const olTidak = document.getElementById("ol_tidak");
const freqInput = document.querySelector("input[name='frekuensi_olahraga']");
const jenisContainer = document.createElement("div");

// Buat container jenis olahraga
jenisContainer.id = "jenis_olahraga_container";
jenisContainer.style.display = "none";
jenisContainer.innerHTML = `
    <label>Jenis Olahraga yang dilakukan:</label>
    <input type="text" name="jenis_olahraga" id="jenis_olahraga_input">
`;

// Sisipkan setelah frekuensi olahraga
freqInput.parentElement.insertAdjacentElement("afterend", jenisContainer);

const jenisInput = document.getElementById("jenis_olahraga_input");

function toggleOlahraga() {
    if (olYa.checked) {
        // tampilkan frekuensi
        freqInput.style.display = 'inline-block';
        freqInput.required = true;

        // tampilkan jenis olahraga
        jenisContainer.style.display = 'block';
        jenisInput.required = true;

    } else {
        // sembunyikan frekuensi
        freqInput.style.display = 'none';
        freqInput.value = '';
        freqInput.required = false;

        // sembunyikan jenis olahraga
        jenisContainer.style.display = 'none';
        jenisInput.value = '';
        jenisInput.required = false;
    }
}

olYa.addEventListener("change", toggleOlahraga);
olTidak.addEventListener("change", toggleOlahraga);
toggleOlahraga();


// ========================================================
// 5. SUBMIT FORM KE GOOGLE SHEETS & TAMPILKAN HALAMAN SUKSES (UPDATED FOR ALL DATA QR)
// ========================================================
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        // Client-side validation: let browser show messages
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.origText = submitBtn.innerText;
            submitBtn.innerText = 'Mengirim...';
        }

        pesanStatus.textContent = 'Mengirim data... Mohon tunggu.';
        pesanStatus.style.color = 'blue';

    const formData = new FormData(form);
        
        // Sebelum kirim, kosongkan input 'frekuensi_olahraga' dan 'jenis_olahraga' 
        // jika 'olahraga' adalah 'Tidak'
        if (olTidak.checked) {
            formData.set('frekuensi_olahraga', '');
            formData.set('jenis_olahraga', '');
        }

        // Try fast background send using navigator.sendBeacon with URL-encoded body.
        // This provides a quicker perception (we redirect immediately). Fallback to fetch when unavailable.
        const params = new URLSearchParams();
        for (const pair of formData.entries()) {
            params.append(pair[0], pair[1]);
        }

        const blob = new Blob([params.toString()], { type: 'application/x-www-form-urlencoded' });

        if (navigator.sendBeacon) {
            const queued = navigator.sendBeacon(SCRIPT_URL, blob);
            if (queued) {
                // Assume queued for delivery; show success UX and redirect immediately for fast flow
                try {
                    const namaPeserta = (formData.get('nama_peserta') || 'NAMA TIDAK ADA').toString();
                    const nipNikPeserta = (formData.get('nip_nik') || 'NIP/NIK TIDAK ADA').toString();
                    const tglLahir = (formData.get('tanggal_lahir') || 'TGL LAHIR TIDAK ADA').toString();
                    const jenisKelamin = (formData.get('jenis_kelamin') || 'JK TIDAK ADA').toString();
                    const noHP = (formData.get('no_handphone') || 'HP TIDAK ADA').toString();
                    const unitKerja = (formData.get('departemen') || 'UNIT KERJA TIDAK ADA').toString();

                    const dataQR =
                        `NAMA: ${namaPeserta.toUpperCase().trim()} | ` +
                        `NIP/NIK: ${nipNikPeserta.trim()} | ` +
                        `TGL LAHIR: ${tglLahir} | ` +
                        `JK: ${jenisKelamin} | ` +
                        `HP: ${noHP} | ` +
                        `UNIT: ${unitKerja.toUpperCase().trim()} | ` +
                        `WAKTU SUBMIT: ${new Date().toLocaleString('id-ID')}`;

                    localStorage.setItem('anamnesa_qr', dataQR);
                    localStorage.setItem('anamnesa_name', namaPeserta ? namaPeserta.toUpperCase() : 'PESERTA');
                } catch (err) {
                    console.warn('Gagal menyimpan ke localStorage (sendBeacon path):', err);
                }
                pesanStatus.textContent = '✅ Proses Penyimpanan Data';
                pesanStatus.style.color = 'green';
                window.location.href = 'thankyou.html';
                return;
            }
            // else fallthrough to fetch
        }

        // If sendBeacon not available or failed, fallback to fetch
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                // Ambil data penting untuk QR dan simpan ke localStorage,
                // lalu redirect ke halaman thankyou.html sehingga QR ditampilkan di halaman terpisah.
                const namaPeserta = document.querySelector('input[name="nama_peserta"]').value || 'NAMA TIDAK ADA';
                const nipNikPeserta = document.querySelector('input[name="nip_nik"]').value || 'NIP/NIK TIDAK ADA';
                const tglLahir = document.querySelector('input[name="tanggal_lahir"]').value || 'TGL LAHIR TIDAK ADA';
                const jenisKelamin = document.querySelector('select[name="jenis_kelamin"]').value || 'JK TIDAK ADA';
                const noHP = document.querySelector('input[name="no_handphone"]').value || 'HP TIDAK ADA';
                const unitKerja = document.querySelector('input[name="departemen"]').value || 'UNIT KERJA TIDAK ADA';

                const dataQR =
                    `NAMA: ${namaPeserta.toUpperCase().trim()} | ` +
                    `NIP/NIK: ${nipNikPeserta.trim()} | ` +
                    `TGL LAHIR: ${tglLahir} | ` +
                    `JK: ${jenisKelamin} | ` +
                    `HP: ${noHP} | ` +
                    `UNIT: ${unitKerja.toUpperCase().trim()} | ` +
                    `WAKTU SUBMIT: ${new Date().toLocaleString('id-ID')}`;

                // Simpan ke localStorage supaya halaman thankyou.html dapat membacanya
                try {
                    localStorage.setItem('anamnesa_qr', dataQR);
                    localStorage.setItem('anamnesa_name', namaPeserta ? namaPeserta.toUpperCase() : 'PESERTA');
                } catch (err) {
                    console.warn('Gagal menyimpan ke localStorage:', err);
                }

                pesanStatus.textContent = '✅ Data anamnesa berhasil tersimpan! Mengalihkan ke halaman Terima Kasih...';
                pesanStatus.style.color = 'green';

                // Redirect ke halaman terima kasih (thanks + QR)
                window.location.href = 'thankyou.html';
                return;
            } else {
                throw new Error(data.message || 'Gagal menyimpan data ke Apps Script.');
            }
        })
        .catch(error => {
            console.error('Error saat mengirim:', error);
            pesanStatus.textContent = `❌ Gagal menyimpan data: ${error.message}.`;
            pesanStatus.style.color = 'red';
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = submitBtn.dataset.origText || 'Simpan Data';
            }
        });
    });
}

// ========================================================
// Add visual required markers to labels and question headings
// ========================================================
function addRequiredMarkers() {
    const f = document.getElementById('anamnesaForm');
    if (!f) return;

    // Helper to append marker
    function appendStar(el) {
        if (!el || el.querySelector('.required-star')) return;
        const span = document.createElement('span');
        span.className = 'required-star';
        span.textContent = '*';
        el.appendChild(span);
        el.classList.add('label-required');
    }

    // Mark item-labels (radio group headings) when their group contains required inputs
    const itemLabels = Array.from(f.querySelectorAll('.item-label'));
    itemLabels.forEach(lbl => {
        const parent = lbl.parentElement;
        if (!parent) return;
        if (parent.querySelector('input[required], select[required], textarea[required]')) {
            appendStar(lbl);
        }
    });

    // Mark normal labels if the following input/select/textarea is required
    const allLabels = Array.from(f.querySelectorAll('label'));
    allLabels.forEach(lbl => {
        if (lbl.classList.contains('visually-hidden') || lbl.classList.contains('item-label')) return;
        // check for for/id association
        if (lbl.htmlFor) {
            const target = document.getElementById(lbl.htmlFor);
            // Do not add stars to the small inline keluhan pilihan labels (name="keluhan_pilih")
            if (target && target.name === 'keluhan_pilih') return;
            if (target && target.required) { appendStar(lbl); return; }
        }
        // check next siblings (limit depth to avoid scanning far)
        let el = lbl.nextElementSibling;
        let steps = 0;
        while (el && steps < 5) {
            if (el.matches && (el.matches('input[required], select[required], textarea[required]') || el.querySelector && el.querySelector('input[required], select[required], textarea[required]'))) {
                appendStar(lbl);
                break;
            }
            el = el.nextElementSibling;
            steps++;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Add required markers after DOM ready
    addRequiredMarkers();
    // keep existing button wiring
    const btnSendiri = document.getElementById('btn-set-tidak-sendiri');
    const btnKeluarga = document.getElementById('btn-set-tidak-keluarga');
    if (btnSendiri) btnSendiri.addEventListener('click', () => setAllRadiosToTidak('#section-penyakit-sendiri'));
    if (btnKeluarga) btnKeluarga.addEventListener('click', () => setAllRadiosToTidak('#section-penyakit-keluarga'));
});

// ========================================================
// Utility: set all radio groups inside a container to the option containing 'tidak'
// ========================================================
function setAllRadiosToTidak(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const radios = Array.from(container.querySelectorAll('input[type="radio"]'));
    // group by name
    const groups = radios.reduce((acc, r) => {
        if (!acc[r.name]) acc[r.name] = [];
        acc[r.name].push(r);
        return acc;
    }, {});

    Object.values(groups).forEach(group => {
        // prefer radio whose value includes 'tidak' (case-insensitive)
        let candidate = group.find(r => /tidak/i.test(String(r.value)));
        if (!candidate) candidate = group[group.length - 1]; // fallback
        if (candidate) {
            candidate.checked = true;
            candidate.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// Set defaults on load for both sections (so default is 'Tidak')
document.addEventListener('DOMContentLoaded', () => {
    const btnSendiri = document.getElementById('btn-set-tidak-sendiri');
    const btnKeluarga = document.getElementById('btn-set-tidak-keluarga');
    if (btnSendiri) btnSendiri.addEventListener('click', () => setAllRadiosToTidak('#section-penyakit-sendiri'));
    if (btnKeluarga) btnKeluarga.addEventListener('click', () => setAllRadiosToTidak('#section-penyakit-keluarga'));
});


