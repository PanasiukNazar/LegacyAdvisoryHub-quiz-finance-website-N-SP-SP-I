const QUESTIONS = [
    {
        label: '¿Cuál es el primer paso esencial para tener control sobre tus finanzas?',
        answers: [
            'Analizar tus ingresos y gastos mensuales',
            'Invertir sin informarte antes',
            'Tomar decisiones sin planificación',
            'Actuar sin objetivos claros',
        ],
    },
    {
        label: '¿Qué acción ayuda a minimizar posibles pérdidas financieras?',
        answers: [
            'Dividir tus recursos entre distintas opciones',
            'Ignorar los riesgos y seguir tu intuición',
            'Concentrar todo en una sola inversión',
            'Invertir sin evaluar resultados anteriores',
        ],
    },
    {
        label: '¿Qué representa el concepto de diversificación en finanzas?',
        answers: [
            'Repartir tus inversiones en diferentes áreas',
            'Apostar por una sola alternativa segura',
            'Evitar cualquier tipo de inversión',
            'Comprar solo bienes de lujo',
        ],
    },
    {
        label: '¿Con qué frecuencia es recomendable revisar tus finanzas personales?',
        answers: [
            'Con regularidad, para hacer ajustes oportunos',
            'Solo cuando hay una crisis',
            'Cada muchos años',
            'Nunca, si todo parece ir bien',
        ],
    },
    {
        label: '¿Qué error puede dificultar una buena gestión financiera?',
        answers: [
            'No establecer metas económicas claras',
            'Actuar sin información suficiente',
            'Desconocer los riesgos de tus decisiones',
            'Todas las anteriores',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="quiz-content">
                <div class="content">
                    <h2 class="title">Cuestionario de Educación Financiera</h2>
                    <h4 class="sub-title">Pon a prueba tus conocimientos sobre finanzas personales y gestión del dinero</h4>
                    <h5>Explora conceptos clave de finanzas con este cuestionario interactivo diseñado para mejorar tu comprensión económica.</h5>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Comenzar</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
          <div class="container quiz-wrapper">
            <div class="quiz-content text-center quiz-start">
                <div class="question-wrapper">
                    <h3 class="question mt-4">${question.label}</h3>
                </div>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>

                <div class="bar-wrapper" style="width: 100%; padding-left: 20px; padding-right: 20px">
                    <div class="progress" style="padding-left: 0 !important; padding-right: 0 !important;">
                        <div class="progress-bar" style="width: ${questionsStep.getProgress()}%"></div>
                    </div>
                </div>
            </div>
        </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToNextQuestion':
                return questionsStep.goToNextQuestion();
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        questionsStep.questionIndex -= 1;
        questionsStep.render();
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

//   <h2 class="title">Formulario de contacto financiero</h2>
//   <h3 class="mb-4">Por favor, completa el formulario para recibir tus resultados financieros</h3>

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content form-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                  
                    <form id="quiz-form">
                        <input class="form-control" name="name" type="text" placeholder="Nombre" required>
                        <input class="form-control" name="surname" type="text" placeholder="Apellido" required>
                        <input class="form-control" name="email" type="email" placeholder="Correo electrónico" required>
                        <input class="form-control" name="phone" type="tel" placeholder="Teléfono" required>
                        <div class="checkbox">
                            <input type="checkbox" required>
                            <label>Estoy de acuerdo con los <a class="form-link" href="terms-of-use.html">términos de uso y la política de privacidad</a></label>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" checked disabled>
                            <label>Acepto recibir boletines informativos por correo electrónico</label>
                        </div>

                        ${Object.keys(quiz.answers)
                            .map(
                                (question) =>
                                    `<input name="${question}" value="${quiz.answers[question]}" hidden>`,
                            )
                            .join('')}

                        <button type="submit" class="btn btn-primary w-100 py-3 first-button">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
      `;

        // Agrega aquí el manejador de envío del formulario
        document.getElementById('quiz-form').addEventListener('submit', function (e) {
            e.preventDefault(); // evita el envío tradicional del formulario
            localStorage.setItem('quizDone', true);
            window.location.href = 'thanks.html';
        });
    },

    // Ya no necesitas esto si no se usa en ningún sitio:
    onClick: (el) => {
        const newPath = 'thanks.html';
        if (el.getAttribute('data-action') === 'submitAnswers') {
            localStorage.setItem('quizDone', true);
            document.getElementById('main-page').classList.remove('hide');
            document.getElementById('quiz-page').classList.add('hide');
            document.getElementById('footer').classList.add('hide');
            window.location.href = newPath;
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
