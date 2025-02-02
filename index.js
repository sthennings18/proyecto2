class Survey {
  constructor() {
    this.questions = [];
    this.votes = [];
    this.currentQuestion = 0;
  }

  addQuestion() {
    const question = {
      id: this.questions.length,
      text: `Pregunta ${this.questions.length + 1}`,
      options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    };
    this.questions.push(question);
    this.renderQuestionInput(question);
  }

  renderQuestionInput(question) {
    const container = document.getElementById("preguntas");
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
            <input type="text" value="${question.text}" 
                   onchange="survey.updateQuestion(${question.id}, this.value)">
            <div class="options">
                ${question.options
                  .map(
                    (option, index) => `
                    <input type="text" value="${option}" 
                           onchange="survey.updateOption(${question.id}, ${index}, this.value)">
                `
                  )
                  .join("")}
            </div>
        `;
    container.appendChild(questionDiv);
  }

  updateQuestion(id, text) {
    this.questions[id].text = text;
  }

  updateOption(questionId, optionIndex, text) {
    this.questions[questionId].options[optionIndex] = text;
  }

  createSurvey() {
    if (this.questions.length < 8) {
      alert("Please add at least 8 questions");
      return;
    }
    document.getElementById("formulario").style.display = "none";
    document.getElementById("votacion").style.display = "block";
    this.renderVotingForm();
  }

  renderVotingForm() {
    const container = document.getElementById("votos");
    container.innerHTML = this.questions
      .map(
        (question) => `
            <div class="question">
                <h3>${question.text}</h3>
                ${question.options
                  .map(
                    (option, index) => `
                    <label>
                        <input type="radio" name="question${question.id}" value="${index}">
                        ${option}
                    </label>
                `
                  )
                  .join("")}
            </div>
        `
      )
      .join("");
  }

  emitirVoto() {
    const vote = this.questions.map((question, index) => {
      const selected = document.querySelector(
        `input[name="question${index}"]:checked`
      );
      return selected ? parseInt(selected.value) : -1;
    });

    if (vote.includes(-1)) {
      alert("Por favor, contestar todas las preguntas");
      return;
    }

    this.votes.push(vote);
    document.getElementById("votacion").style.display = "none";
    document.getElementById("resultados").style.display = "block";
    this.showResults();
  }

  showResults() {
    const container = document.getElementById("resultados2");
    container.innerHTML = this.questions
      .map((question, qIndex) => {
        const voteCounts = question.options.map((option, oIndex) => {
          return this.votes.filter((vote) => vote[qIndex] === oIndex).length;
        });

        const total = voteCounts.reduce((a, b) => a + b, 0);

        return `
                <div class="question-result">
                    <h3>${question.text}</h3>
                    ${question.options
                      .map(
                        (option, index) => `
                        <div>${option}: ${voteCounts[index]} votes 
                        (${((voteCounts[index] / total) * 100).toFixed(
                          1
                        )}%)</div>
                    `
                      )
                      .join("")}
                </div>
            `;
      })
      .join("");
  }
}

const survey = new Survey();
for (let i = 0; i < 8; i++) {
  survey.addQuestion();
}
