function toggleQuestion() {
    const questionContainer = document.querySelector('.question-container');
    questionContainer.style.display = 'block';
    questionContainer.style.opacity = 1; // Сделать вопрос видимым
    scrollToBottom(questionContainer); // Прокручиваем к нижней части
}

function answer(response, questionNumber) {

    // Получаем текущую кнопку, по которой был клик
    const clickedButton = event.target;

    // Проверяем, если это кнопка типа "extra", то просто добавляем класс и завершаем выполнение
    if (clickedButton.classList.contains('answer-btn-extra')) {
        // Получаем все кнопки этой пары
        const pairButtons = clickedButton.closest('.buttons').querySelectorAll('.answer-btn-extra');

        // Убираем класс 'clicked' у других кнопок в паре
        pairButtons.forEach(button => {
            if (button !== clickedButton) {
                button.classList.remove('clicked');
            }
        });

        // Добавляем класс 'clicked' на выбранную кнопку
        clickedButton.classList.add('clicked');

        return; // Прерываем выполнение функции, не выполняя остальную логику
    }

    // Дальше выполняем основную логику для обычных кнопок
    const currentQuestion = document.querySelector(`#question-container-${questionNumber}`);
    currentQuestion.dataset.opened = 'true';

    const buttons = document.querySelectorAll(`#question-container-${questionNumber} .answer-btn`);
    buttons.forEach(button => button.classList.remove('clicked'));

    const extrabuttons = document.querySelectorAll(`#question-container-${questionNumber} .answer-btn-extra`);
    extrabuttons.forEach(button => button.classList.remove('clicked'));

    // Добавляем класс "clicked" на выбранную кнопку
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
        scrollToBottom(nextQuestion); // Прокручиваем к следующему вопросу
    }

    if (response === 'no') {
        const inputFields = document.querySelector(`#input-fields-${questionNumber}`);
        if (inputFields) {
            inputFields.style.display = 'none';
        }
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
        scrollToBottom(nextQuestion); // Прокручиваем к следующему вопросу
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
                scrollToBottom(nextQuestion); // Прокрутка к следующему вопросу
            }
        }
    });
});

function generateFieldsForQuestion8(numberOfFields) {
    const container = document.querySelector("#dynamic-fields-container");
    container.innerHTML = ""; // Очищаем контейнер перед добавлением новых полей

    for (let i = 1; i <= numberOfFields; i++) {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.classList.add("field-wrapper");

        const label = document.createElement("p");
        label.classList.add("input-text");
        label.textContent = `Введите диаметр трубопроводов ${i} (мм):`;

        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("input-field-dis");
        input.id = `pipe-diameter-${i}`; // Генерация уникального id
        input.placeholder = `Диаметр трубопроводов ${i} (мм)`;
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

// Функция для открытия следующего вопроса
function openNextQuestion(nextQuestionId) {
    const nextQuestion = document.getElementById(nextQuestionId);
    if (nextQuestion) {
        nextQuestion.style.display = "block"; // Показать следующий вопрос
        scrollToBottom(nextQuestion);

        // Фокус на первом поле ввода следующего вопроса (если оно есть)
        const nextInputField = nextQuestion.querySelector(".input-field");
        if (nextInputField) {
            nextInputField.focus();
        }
    }
}

// Исправленная функция для прокрутки к элементу
function scrollToBottom(element) {
    const elementTop = element.getBoundingClientRect().top + window.scrollY; // Координата верхней границы элемента относительно документа
    window.scrollTo({
        top: elementTop - 50, // Добавляем отступ сверху, чтобы не прилипало к краю
        behavior: 'smooth'   // Плавная прокрутка
    });
}

// Обработка изменения выбора в выпадающем списке
const workingMediumSelect = document.getElementById('working-medium');
const inputFieldsContainer = document.getElementById('input-fields-9');

workingMediumSelect.addEventListener('change', function () {
    const selectedValue = workingMediumSelect.value;

    if (selectedValue !== 'water') {
        inputFieldsContainer.style.display = 'block';
    } else {
        inputFieldsContainer.style.display = 'none';
    }

    if (selectedValue !== '') {
        openNextQuestion('question-container-10');
    }
});

function showEndButtonOnAnswer(questionNumber) {
    const buttons = document.querySelectorAll(`#question-container-${questionNumber} .answer-btn`);

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const endButton = document.getElementById('end-btn');
            if (endButton) {
                endButton.style.display = 'block';
                endButton.style.opacity = 1; // Опционально, для плавной видимости
            }
        });
    });
}

// Вызов для первого вопроса (или другого, где это нужно)
showEndButtonOnAnswer(15);


function scrollToEndButtonOnNoAnswer(questionNumber) {
    const buttons = document.querySelectorAll(`#question-container-${questionNumber} .answer-btn`);

    buttons.forEach(button => {
        button.addEventListener('click', event => {
            // Определяем, был ли выбран "Нет"
            const response = event.target.getAttribute('onclick')?.includes("'no'") ? 'no' : 'yes';

            if (response === 'no') {
                const endButton = document.getElementById('end-btn');
                if (endButton) {
                    scrollToBottom(endButton); // Прокрутка к кнопке
                }
            }
        });
    });
}

scrollToEndButtonOnNoAnswer(15);


document.getElementById('end-btn').addEventListener('click', function () {
    // Найти все текстовые поля (input) на странице
    const textFields = document.querySelectorAll('input[type="text"], input[type="number"]');

    // Фильтровать только видимые текстовые поля
    const visibleFields = Array.from(textFields).filter(field => {
        return field.offsetParent !== null; // Проверяет, что элемент видим
    });

    // Проверить, заполнены ли все видимые поля
    const emptyFields = visibleFields.filter(field => !field.value.trim());

    // Проверяем, что хотя бы одна кнопка в каждой из пар была кликнута и видима
    const pairs = [
        ['btn-yes-15-extra', 'btn-no-15-extra'],  // Первая пара
        ['btn-yes-3-extra', 'btn-no-3-extra']    // Вторая пара
    ];

    let allPairsClicked = true; // Флаг для проверки всех пар

    pairs.forEach(pair => {
        const [btnYes, btnNo] = pair;
        const btnYesElement = document.getElementById(btnYes);
        const btnNoElement = document.getElementById(btnNo);

        // Проверяем, что кнопки видимы
        const isBtnYesVisible = btnYesElement && btnYesElement.offsetParent !== null;
        const isBtnNoVisible = btnNoElement && btnNoElement.offsetParent !== null;

        // Если обе кнопки невидимы или обе не были кликнуты
        if ((isBtnYesVisible || isBtnNoVisible) && 
            !btnYesElement.classList.contains('clicked') && 
            !btnNoElement.classList.contains('clicked')) {
            allPairsClicked = false;
        }
    });

    if (emptyFields.length > 0) {
        // Если есть незаполненные поля, показываем предупреждение
        alert('Пожалуйста, заполните все поля.');
        // Фокус на первое пустое поле
        emptyFields[0].focus();
    } else if (!allPairsClicked) {
        // Если хотя бы одна пара кнопок не была кликнута или не видна
        alert('Пожалуйста, дайте ответ на все вопросы.');
    } else {
        // Если все поля заполнены и хотя бы одна кнопка в каждой паре была кликнута
        alert('Выполняется дальнейшая обработка...');
        // Здесь можно добавить логику, например, отправку формы
    }
});



document.addEventListener("DOMContentLoaded", function () {
    // Функция для сохранения состояния
    function saveState() {
        const state = {};

        // Сохраняем видимость всех контейнеров вопросов
        document.querySelectorAll(".question-container").forEach((container) => {
            state[container.id] = container.style.display || "none";
        });

        // Сохраняем значения всех input и textarea
        document.querySelectorAll("input, textarea").forEach((input) => {
            state[input.id] = input.value || "";
        });

        // Сохраняем видимость всех текстовых полей
        document.querySelectorAll(".input-fields").forEach((container) => {
            state[container.id] = container.style.display || "none";
        });

        // Сохраняем выбранные radio и checkbox
        document.querySelectorAll("input[type=radio], input[type=checkbox]").forEach((input) => {
            state[input.id] = input.checked;
        });

        // Сохраняем выбранные dropdown (select)
        document.querySelectorAll("select").forEach((select) => {
            state[select.id] = select.value || "";
        });

        // Сохраняем активные кнопки
        document.querySelectorAll(".answer-btn").forEach((btn) => {
            state[btn.id] = btn.classList.contains("clicked");
        });

        // Сохраняем активные кнопки
        document.querySelectorAll(".answer-btn-extra").forEach((btn) => {
            state[btn.id] = btn.classList.contains("clicked");
        });

        // Сохраняем состояние кнопки "Узнать результат"
        const endButtonContainer = document.getElementById("end-btn");
        if (endButtonContainer) {
            state["end-btn"] = endButtonContainer.style.display || "none";
        }

        // Сохраняем все в localStorage
        localStorage.setItem("pageState", JSON.stringify(state));
    }

    // Функция для загрузки состояния 
    function loadState() {
        const state = JSON.parse(localStorage.getItem("pageState") || "{}");

        // Восстанавливаем видимость всех контейнеров вопросов
        document.querySelectorAll(".question-container").forEach((container) => {
            container.style.display = state[container.id] || "none";
        });

        // Восстанавливаем видимость всех текстовых полей
        document.querySelectorAll(".input-fields").forEach((container) => {
            container.style.display = state[container.id] || "none";
        });

        // Восстанавливаем значения всех input и textarea
        document.querySelectorAll("input, textarea").forEach((input) => {
            input.value = state[input.id] || "";
        });

        // Восстанавливаем состояние radio и checkbox
        document.querySelectorAll("input[type=radio], input[type=checkbox]").forEach((input) => {
            input.checked = state[input.id] || false;
        });

        // Восстанавливаем выбранные dropdown (select)
        document.querySelectorAll("select").forEach((select) => {
            select.value = state[select.id] || "";
        });

        // Восстанавливаем активные кнопки
        document.querySelectorAll(".answer-btn").forEach((btn) => {
            if (state[btn.id]) {
                btn.classList.add("clicked");
            }
        });

        document.querySelectorAll(".answer-btn-extra").forEach((btn) => {
            if (state[btn.id]) {
                btn.classList.add("clicked");
            }
        });

        // Восстанавливаем видимость кнопки "Узнать результат"
        const endButtonContainer = document.getElementById("end-btn");
        if (endButtonContainer) {
            endButtonContainer.style.display = state["end-btn"] || "none";
        }
    }

    // Добавляем обработчики событий для кнопок, input, select
    document.querySelectorAll(".answer-btn").forEach((btn) => {
        btn.addEventListener("click", saveState);
    });

    document.querySelectorAll(".answer-btn-extra").forEach((btn) => {
        btn.addEventListener("click", saveState);
    });

    document.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("input", saveState);
    });

    // Загружаем сохраненное состояние при загрузке страницы
    loadState();
});



    function saveDynamicFields() {
        const dynamicFields = document.querySelectorAll("#dynamic-fields-container .input-field-dis");
        const fieldsData = [];
    
        dynamicFields.forEach((input, index) => {
            fieldsData.push({
                id: `pipe-diameter-${index + 1}`,
                value: input.value || ""
            });
        });
    
        localStorage.setItem("dynamicFields", JSON.stringify(fieldsData));
        localStorage.setItem("dynamicFieldsCount", dynamicFields.length);
    }
    
    function loadDynamicFields() {
        const fieldsData = JSON.parse(localStorage.getItem("dynamicFields") || "[]");
        const fieldsCount = parseInt(localStorage.getItem("dynamicFieldsCount") || "0", 10);
    
        if (fieldsCount > 0) {
            generateFieldsForQuestion8(fieldsCount);
    
            setTimeout(() => {
                fieldsData.forEach((field) => {
                    const input = document.getElementById(field.id);
                    if (input) {
                        input.value = field.value;
                    }
                });
            }, 50);
        }
    }
    
    // Добавляем обработчики для сохранения при вводе данных
    document.addEventListener("DOMContentLoaded", function () {
        loadDynamicFields();
    
        document.querySelector("#dynamic-fields-container").addEventListener("input", saveDynamicFields);
    });
    
    
    document.querySelectorAll('.answer-btn-extra').forEach(button => {
        console.log("Найден элемент:", button); // Проверяем, найдены ли кнопки
    
        button.addEventListener('click', (event) => {
            console.log("Клик по кнопке:", event.target.id); // Проверяем, срабатывает ли клик
        });
    });
    