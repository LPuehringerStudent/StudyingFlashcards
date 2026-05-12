let flashcards = [];
let currentIndex = 0;
let isFlipped = false;

const REPO_OWNER = 'lpuehringerstudent';
const REPO_NAME = 'StudyingFlashcards';
const FLASHCARDS_DIR = 'flashcards';

// Fallback list in case GitHub API fails
const FALLBACK_FILES = [
    'flashcards/Banm3SecondTest.json',
    'flashcards/forensics.json',
    'flashcards/networkSystems.json'
];

async function populateRepoFiles() {
    const select = document.getElementById('repoFileSelect');
    
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FLASHCARDS_DIR}`);
        if (!response.ok) {
            throw new Error('GitHub API error: ' + response.status);
        }
        
        const files = await response.json();
        const jsonFiles = files
            .filter(file => file.name.endsWith('.json'))
            .map(file => ({
                name: file.name,
                path: `${FLASHCARDS_DIR}/${file.name}`
            }));
        
        // Clear existing options except the first placeholder
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add fetched files
        jsonFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = file.path;
            option.textContent = file.name;
            select.appendChild(option);
        });
    } catch (e) {
        console.warn('Failed to fetch file list from GitHub API, using fallback:', e);
        
        // Clear existing options except the first placeholder
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add fallback files
        FALLBACK_FILES.forEach(path => {
            const option = document.createElement('option');
            option.value = path;
            option.textContent = path.split('/').pop();
            select.appendChild(option);
        });
    }
}

// Populate dropdown when page loads
document.addEventListener('DOMContentLoaded', populateRepoFiles);

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('jsonInput').value = e.target.result;
        document.getElementById('errorMsg').textContent = '';
    };
    reader.readAsText(file);
});

async function loadFromRepo() {
    const select = document.getElementById('repoFileSelect');
    const filepath = select.value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (!filepath) {
        errorMsg.textContent = 'Please select a file from the dropdown.';
        return;
    }
    
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error('Could not load file: ' + response.statusText);
        }
        const content = await response.text();
        document.getElementById('jsonInput').value = content;
        errorMsg.textContent = '';
    } catch (e) {
        errorMsg.textContent = 'Error loading file: ' + e.message;
    }
}

function loadSample() {
    const sample = [
        { "question": "What is the capital of France?", "answer": "Paris" },
        { "question": "What is 2 + 2?", "answer": "4" },
        { "question": "Who painted the Mona Lisa?", "answer": "Leonardo da Vinci" },
        { "question": "What is the largest planet in our solar system?", "answer": "Jupiter" },
        { "question": "What year did World War II end?", "answer": "1945" }
    ];
    document.getElementById('jsonInput').value = JSON.stringify(sample, null, 2);
    document.getElementById('errorMsg').textContent = '';
}

function loadFlashcards() {
    const input = document.getElementById('jsonInput').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    if (!input) {
        errorMsg.textContent = 'Please enter some JSON data.';
        return;
    }

    try {
        const parsed = JSON.parse(input);
        
        if (!Array.isArray(parsed)) {
            throw new Error('Data must be an array of flashcards.');
        }

        if (parsed.length === 0) {
            throw new Error('Flashcard array is empty.');
        }

        for (let i = 0; i < parsed.length; i++) {
            const card = parsed[i];
            if (!card.question || !card.answer) {
                throw new Error('Flashcard ' + (i + 1) + ' is missing question or answer field.');
            }
        }

        flashcards = parsed;
        currentIndex = 0;
        isFlipped = false;
        
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('flashcardSection').classList.add('active');
        
        updateCard();
        errorMsg.textContent = '';
    } catch (e) {
        errorMsg.textContent = 'Error: ' + e.message;
    }
}

function updateCard() {
    const card = flashcards[currentIndex];
    document.getElementById('questionText').textContent = card.question;
    document.getElementById('answerText').textContent = card.answer;
    document.getElementById('currentCard').textContent = currentIndex + 1;
    document.getElementById('totalCards').textContent = flashcards.length;
    
    isFlipped = false;
    document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
}

function nextCard() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateCard();
    } else {
        currentIndex = 0;
        updateCard();
    }
}

function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard();
    } else {
        currentIndex = flashcards.length - 1;
        updateCard();
    }
}

function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentIndex = 0;
    updateCard();
    
    const shuffleInfo = document.getElementById('shuffleInfo');
    shuffleInfo.textContent = 'Cards shuffled!';
    setTimeout(() => {
        shuffleInfo.textContent = '';
    }, 2000);
}

function resetToInput() {
    document.getElementById('flashcardSection').classList.remove('active');
    document.getElementById('inputSection').style.display = 'block';
}

document.addEventListener('keydown', function(e) {
    if (!document.getElementById('flashcardSection').classList.contains('active')) {
        return;
    }

    switch(e.key) {
        case ' ':
            e.preventDefault();
            flipCard();
            break;
        case 'ArrowRight':
            nextCard();
            break;
        case 'ArrowLeft':
            previousCard();
            break;
    }
});
