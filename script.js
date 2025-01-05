function toggleQuestion() {
    const questionContainer = document.querySelector('.question-container');
    questionContainer.style.display = 'block';
    questionContainer.style.opacity = 1; // Сделать вопрос видимым
    scrollToBottom(questionContainer); // Прокручиваем к нижней части
}

function answer(response, questionNumber) {
    const currentQuestion = document.querySelector(`#question-container-${questionNumber}`);
    currentQuestion.dataset.opened = 'true';

    const buttons = document.querySelectorAll(`#question-container-${questionNumber} .answer-btn`);
    buttons.forEach(button => button.classList.remove('clicked'));

    const clickedButton = event.target;
    clickedButton.classList.add('clicked');

    if (response === 'yes') {
        const inputFields = document.querySelector(`#input-fields-${questionNumber}`);
        if (inputFields) {
            inputFields.style.display = 'block';
        }
    }

    const nextQuestion = document.querySelector(`#question-container-${questionNumber + 1}`);
    if (nextQuestion) {
        nextQuestion.style.display = 'block';
        nextQuestion.style.opacity = 1;
    }

    if (response === 'no') {
        const inputFields = document.querySelector(`#input-fields-${questionNumber}`);
        if (inputFields) {
            inputFields.style.display = 'none';
        }
    }

    if (nextQuestion) {
        scrollToBottom(nextQuestion);
    }
}

function handleRadioSelection(questionNumber, value) {
    console.log(`Вы выбрали значение: ${value} для вопроса ${questionNumber}`);

    const inputFields = document.querySelector(`#input-fields-${questionNumber}`);
    const nextQuestion = document.querySelector(`#question-container-${questionNumber + 1}`);

    if (inputFields) {
        inputFields.style.display = 'block';
    }

    if (nextQuestion) {
        nextQuestion.style.display = 'block';
        nextQuestion.style.opacity = 1;
        scrollToBottom(nextQuestion);
    }
}

document.querySelectorAll('.input-field').forEach((inputField) => {
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (inputField.value.trim() === '') {
                alert('Пожалуйста, заполните поле перед продолжением.');
                return;
            }

            if (isNaN(inputField.value) || parseFloat(inputField.value) < 0) {
                alert('Введите неотрицательное число.');
                return;
            }

            const currentInputId = inputField.id;
            const currentQuestionIndex = parseInt(currentInputId.split('-')[2], 10);

            if (currentQuestionIndex === 7) {
                const numberOfFields = parseInt(inputField.value.trim(), 10);

                if (isNaN(numberOfFields) || numberOfFields <= 0) {
                    alert('Введите положительное число для количества труб.');
                    return;
                }

                generateFieldsForQuestion8(numberOfFields);
            }

            const nextQuestion = document.getElementById(`question-container-${currentQuestionIndex + 1}`);
            if (nextQuestion) {
                nextQuestion.style.display = 'block';
                const nextInputField = nextQuestion.querySelector('.input-field');
                if (nextInputField) {
                    nextInputField.focus();
                }
            }
        }
    });
});

function generateFieldsForQuestion8(numberOfFields) {
    const container = document.querySelector("#dynamic-fields-container");
    container.innerHTML = "";

    for (let i = 1; i <= numberOfFields; i++) {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.classList.add("field-wrapper");

        const label = document.createElement("p");
        label.classList.add("input-text");
        label.textContent = `Введите диаметр трубы ${i}:`;

        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("input-field");
        input.placeholder = `Диаметр трубы ${i}`;
        input.min = 0; // Ограничение на неотрицательные числа
        input.addEventListener("input", () => {
            checkAllFieldsFilled("dynamic-fields-container", "question-container-8");
        });

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        container.appendChild(fieldWrapper);
    }
}

document.getElementById("next-button-8").addEventListener("click", function () {
    const containerId = "dynamic-fields-container";
    const nextQuestionId = "question-container-9";

    if (checkAllFieldsFilled(containerId)) {
        openNextQuestion(nextQuestionId);
    } else {
        alert("Пожалуйста, заполните все поля корректно (только неотрицательные числа).");
    }
});

function checkAllFieldsFilled(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll("input");
    let allFilled = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        if (value === "" || isNaN(value) || Number(value) < 0) {
            allFilled = false;
        }
    });

    return allFilled;
}

function openNextQuestion(nextQuestionId) {
    const nextQuestion = document.getElementById(nextQuestionId);
    if (nextQuestion) {
        nextQuestion.style.display = "block";
        scrollToBottom(nextQuestion);

        // Фокус на первом поле ввода следующего вопроса (если оно есть)
        const nextInputField = nextQuestion.querySelector(".input-field");
        if (nextInputField) {
            nextInputField.focus();
        }
    }
}

function scrollToBottom(element) {
    const elementBottom = element.getBoundingClientRect().bottom;
    const offset = window.scrollY + elementBottom - window.innerHeight;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}
