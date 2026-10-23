// Array to store the words
let wordPool = [];

// DOM Elements
const wordInput = document.getElementById('word-input');
const addWordBtn = document.getElementById('add-word-btn');
const buildProtoBtn = document.getElementById('build-proto-btn');
const clearBtn = document.getElementById('clear-btn');
const wordList = document.getElementById('word-list');
const resultSection = document.getElementById('result-section');
const protoWordDisplay = document.getElementById('proto-word-display');

// Dictionary for sanitizing common vowel clusters and digraphs
const digraphMap = {
    'ae': 'æ',
    'oe': 'œ',
    'ue': 'ü',
    'sh': 'ʃ',
    'ch': 'tʃ',
    'th': 'θ',
    'ph': 'f'
};

// Function to clean and combine letters
function sanitizeWord(word) {
    let cleanWord = word.trim().toLowerCase();
    
    // Loop through our map and replace digraphs with single IPA characters
    for (const [key, value] of Object.entries(digraphMap)) {
        // Using Regex to replace all instances
        const regex = new RegExp(key, 'g');
        cleanWord = cleanWord.replace(regex, value);
    }
    
    return cleanWord;
}

// Update the UI list of words
function updateWordList() {
    wordList.innerHTML = '';
    
    if (wordPool.length === 0) {
        wordList.innerHTML = '<li class="empty-msg">No words added yet.</li>';
        resultSection.classList.add('hidden');
        return;
    }

    wordPool.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${word}`;
        wordList.appendChild(li);
    });
}

// Event: Add Word
addWordBtn.addEventListener('click', () => {
    const rawWord = wordInput.value;
    if (!rawWord.trim()) return;

    const sanitized = sanitizeWord(rawWord);
    wordPool.push(sanitized);
    
    wordInput.value = '';
    wordInput.focus();
    updateWordList();
    resultSection.classList.add('hidden'); // Hide old result if adding new words
});

// Event: Build Proto-Word
buildProtoBtn.addEventListener('click', () => {
    if (wordPool.length < 2) {
        alert("Please enter at least 2 words to compare.");
        return;
    }

    // 1. Find the shortest word length
    let minLength = Math.min(...wordPool.map(word => word.length));

    // 2. Prepare an array to hold the proto-word
    let protoWordArray = [];

    // 3. Loop through each character position up to the shortest length
    for (let i = 0; i < minLength; i++) {
        let charFrequency = {};

        // Count frequencies at this specific index
        for (let j = 0; j < wordPool.length; j++) {
            let char = wordPool[j][i];
            
            // If the character is an array (from 'tʃ' etc), handle it as a string
            if (Array.isArray(char)) char = char[0];

            if (charFrequency[char]) {
                charFrequency[char]++;
            } else {
                charFrequency[char] = 1;
            }
        }

        // 4. Find the most frequent character
        let maxCount = 0;
        let mostFrequentChar = '';

        for (const [char, count] of Object.entries(charFrequency)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequentChar = char;
            }
        }

        // Add the winning character to our proto-word
        protoWordArray.push(mostFrequentChar);
    }

    // 5. Join and display the result
    const protoWord = protoWordArray.join('');
    protoWordDisplay.textContent = protoWord;
    resultSection.classList.remove('hidden');
});

// Event: Clear All
clearBtn.addEventListener('click', () => {
    wordPool = [];
    wordInput.value = '';
    updateWordList();
    resultSection.classList.add('hidden');
});

// Allow pressing "Enter" to add a word
wordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addWordBtn.click();
    }
});