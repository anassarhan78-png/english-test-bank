let questions = [];
let currentIndex = 0;
let selectedOption = null;

async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIndex];
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="question">${q.text}</div>
        ${q.options.map((opt, idx) => `
            <div class="option" data-idx="${String.fromCharCode(65+idx)}">${String.fromCharCode(65+idx)}. ${opt}</div>
        `).join('')}
        <div id="feedback"></div>
    `;
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('result').innerHTML = '';
    selectedOption = null;

    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedOption = opt.getAttribute('data-idx');
        });
    });
}

document.getElementById('submit-btn').addEventListener('click', () => {
    if (!selectedOption) {
        alert('الرجاء اختيار إجابة');
        return;
    }
    const q = questions[currentIndex];
    const isCorrect = (selectedOption === q.correct);
    const feedbackDiv = document.getElementById('feedback');
    if (isCorrect) {
        feedbackDiv.innerHTML = `<div class="feedback correct-feedback">✅ صحيح! ${q.explanation[selectedOption] || ''}</div>`;
    } else {
        feedbackDiv.innerHTML = `<div class="feedback">❌ خطأ. الإجابة الصحيحة هي ${q.correct}. ${q.explanation[selectedOption] || ''}<br>${q.explanation[q.correct] || ''}</div>`;
    }
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').innerHTML = '<h2>🎉 انتهى الاختبار! 🎉</h2>';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none';
    }
});

loadQuestions();
