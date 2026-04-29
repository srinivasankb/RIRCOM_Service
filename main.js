const hams = [
    { callsign: "VU2KLG", name: "KALUGUMALAI RAJA", phone: "9443388056", isIC: true },
    { callsign: "VU2VET", name: "SUDHINDRA", phone: "8747802616" },
    { callsign: "VU2JFF", name: "RAMESH KUMAR", phone: "9600297002" },
    { callsign: "VU35KB", name: "SRINIVASAN", phone: "9042284142" },
    { callsign: "VU3XDB", name: "MANIKANDAN", phone: "9486839734" },
    { callsign: "VU3LQH", name: "MARIMUTHU", phone: "9488454235" },
    { callsign: "VU3TIU", name: "MURUGAN", phone: "9965446718" },
    { callsign: "VU3JZT", name: "MURUGESAN", phone: "9994360615" },
    { callsign: "VU3OTF", name: "PADMANABAN", phone: "8940083002" }
];

const hamGrid = document.getElementById('hamGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('contactModal');
const modalDetails = document.getElementById('modalDetails');
const closeButton = document.querySelector('.close-button');

// Load Notes from Local Storage
function getNotes() {
    return JSON.parse(localStorage.getItem('rircom_notes_v2') || '{}');
}

function saveNote(callsign, noteText) {
    const notes = getNotes();
    if (noteText.trim()) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        notes[callsign] = {
            text: noteText,
            time: timeString
        };
    } else {
        delete notes[callsign];
    }
    localStorage.setItem('rircom_notes_v2', JSON.stringify(notes));
    renderCards(searchInput.value);
}

// Roll Call Implementation
function getRollCall() {
    return JSON.parse(localStorage.getItem('rircom_rollcall') || '[]');
}

function toggleRollCall(callsign, event) {
    event.stopPropagation();
    let checked = getRollCall();
    if (checked.includes(callsign)) {
        checked = checked.filter(c => c !== callsign);
    } else {
        checked.push(callsign);
    }
    localStorage.setItem('rircom_rollcall', JSON.stringify(checked));
    renderCards(searchInput.value);
}

function resetRollCall() {
    if (confirm('Clear entire roll call?')) {
        localStorage.setItem('rircom_rollcall', '[]');
        renderCards(searchInput.value);
    }
}

function getSortedHams() {
    const raja = hams.find(h => h.callsign === "VU2KLG");
    const srinivasan = hams.find(h => h.callsign === "VU35KB");
    const others = hams.filter(h => h.callsign !== "VU2KLG" && h.callsign !== "VU35KB")
        .sort((a, b) => a.callsign.localeCompare(b.callsign));
    return [raja, ...others, srinivasan];
}

function renderCards(filter = '') {
    hamGrid.innerHTML = '';
    const sortedHams = getSortedHams();
    const notes = getNotes();
    const checked = getRollCall();

    const filteredHams = sortedHams.filter(ham =>
        ham.callsign.toLowerCase().includes(filter.toLowerCase()) ||
        ham.name.toLowerCase().includes(filter.toLowerCase())
    );

    filteredHams.forEach(ham => {
        const isChecked = checked.includes(ham.callsign);
        const card = document.createElement('div');
        card.className = `ham-card ${ham.isIC ? 'ic-card' : ''} ${isChecked ? 'checked-card' : ''}`;

        const noteObj = notes[ham.callsign];

        card.innerHTML = `
            <div class="check-area" onclick="toggleRollCall('${ham.callsign}', event)">
                <div class="checkbox ${isChecked ? 'active' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </div>
            <div class="card-info">
                <div class="callsign">${ham.callsign}</div>
                <div class="full-name">${ham.name}</div>
                ${noteObj ? `
                    <div class="card-note-wrapper">
                        <div class="card-note">${noteObj.text}</div>
                        <div class="note-time">${noteObj.time}</div>
                    </div>
                ` : ''}
            </div>
            ${ham.isIC ? '<div class="ic-tag">I/C</div>' : ''}
        `;
        card.onclick = () => showDetails(ham);
        hamGrid.appendChild(card);
    });
}

function showDetails(ham) {
    const formattedPhone = ham.phone.replace(/(\d{5})(\d{5})/, '$1 $2');
    const notes = getNotes();
    const currentNote = notes[ham.callsign] ? notes[ham.callsign].text : '';

    modalDetails.innerHTML = `
        <div class="modal-callsign">${ham.callsign}</div>
        <div class="modal-name">${ham.name}</div>
        <div class="modal-phone">${formattedPhone}</div>
        
        <div class="note-input-area">
            <label for="noteInput">Personal Note:</label>
            <textarea id="noteInput" placeholder="e.g. Assigned to North Gate...">${currentNote}</textarea>
            <button id="saveNoteBtn" class="btn-save-note">Update Note</button>
        </div>

        <div class="action-buttons">
            <a href="tel:+91${ham.phone}" class="btn btn-call">
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.7a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Call</span>
            </a>
            <a href="https://wa.me/91${ham.phone}" target="_blank" class="btn btn-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>WhatsApp</span>
            </a>
        </div>
    `;
    modal.style.display = 'flex';

    document.getElementById('saveNoteBtn').onclick = () => {
        const newNote = document.getElementById('noteInput').value;
        saveNote(ham.callsign, newNote);
        modal.style.display = 'none';
    };
}

closeButton.onclick = () => {
    modal.style.display = 'none';
}

searchInput.oninput = (e) => {
    renderCards(e.target.value);
};

// QR Share Implementation
const qrModal = document.getElementById('qrModal');
const qrBtn = document.getElementById('qrShareBtn');
const qrContainer = document.getElementById('qrContainer');
const closeQr = document.getElementById('closeQr');

qrBtn.onclick = () => {
    const currentUrl = window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
    qrContainer.innerHTML = `<img src="${qrUrl}" alt="App QR Code">`;
    qrModal.style.display = 'flex';
};

closeQr.onclick = () => {
    qrModal.style.display = 'none';
};

document.getElementById('resetRollCall').onclick = resetRollCall;

// Initial render
renderCards();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error:', err));
    });
}

// Global click to close modals
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
    if (event.target == qrModal) qrModal.style.display = 'none';
};
