const quizData = [
      {
        question: "What type of living space do you have?",
        options: ["Apartment", "House with small yard", "House with large yard", "Farm or rural property"]
      },
      {
        question: "How active are you?",
        options: ["Low- Prefer indoor activities", "Moderately- Daily walks, some outdoor time", "High- Regular exercise, hiking, running", "Very High- Marathon runner, extreme sports"]
      },
      {
        question: "What's your experience with dogs?",
        options: ["First-time dog owner", "Some experience with dogs", "Very experienced dog owner", "Professional trainer/breeder"]
      },
      {
        question: "How much time can you spend training and grooming?",
        options: ["Minimal – Basic care only!", "Moderate- Regular grooming and basic training", "High- Extensive training and grooming", "Professional level care"]
      },
      {
        question: "What's your family size?",
        options: ["Single Person", "Couple, no children", "Family with young children(under 10)", "Family with older children(10+)"]
      },
      {
        question: "What size dog do you prefer?",
        options: ["Small (under 25 Ibs)", "Medium (25-60 Ibs)", "Giant (over 90 Ibs)"]
      }
    ];

    const dogs = [
      {
        name: "Golden Retriever",
        img: "https://images.unsplash.com/photo-1507149833265-60c372daea22?w=400",
        traits: ["Friendly", "Loyal", "Good with kids"],
        preferences: { active: "Moderately active", size: "Large", children: "Yes", yard: "House with large yard" }
      },
      {
        name: "Border Collie",
        img: "https://images.unsplash.com/photo-1619983081563-430f6360274e?w=400",
        traits: ["Energetic", "Smart", "Agile"],
        preferences: { active: "Very active (love outdoor activities)", size: "Medium", training: "A lot – I enjoy it!" }
      },
      {
        name: "French Bulldog",
        img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400",
        traits: ["Playful", "Loving", "Adaptable"],
        preferences: { yard: "Apartment", size: "Small", shedding: "I prefer little to no shedding" }
      },
      {
        name: "Labrador Retriever",
        img: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400",
        traits: ["Friendly", "Active", "Good with kids"],
        preferences: { active: "Moderately active", size: "Large", children: "Yes" }
      },
      {
        name: "Poodle",
        img: "https://images.unsplash.com/photo-1619983081563-430f6360274e?w=400",
        traits: ["Intelligent", "Hypoallergenic", "Elegant"],
        preferences: { shedding: "I prefer little to no shedding", training: "A lot – I enjoy it!", size: "Medium" }
      }
    ];

    let currentQuestion = 0;
    const totalQuestions = quizData.length;
    const answers = {};

    const quizContainer = document.getElementById("quiz-container");
    const quizContent = document.getElementById("quiz-content");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const progress = document.getElementById("progress");
    const currentText = document.getElementById("current");
    const totalText = document.getElementById("total");
    const progressText = document.getElementById("progress-text");

    totalText.textContent = totalQuestions;

    function loadQuestion() {
      const current = quizData[currentQuestion];
      quizContent.innerHTML = `
        <div class="question">${current.question}</div>
        <div class="options">
          ${current.options
            .map(
              (opt) => `
              <label class="option">
                <input type="radio" name="option" value="${opt}" ${
                  answers[currentQuestion] === opt ? "checked" : ""
                }>
                ${opt}
              </label>
            `
            )
            .join("")}
        </div>
      `;

      currentText.textContent = currentQuestion + 1;
      const percent = ((currentQuestion) / totalQuestions) * 100;
      progress.style.width = `${percent}%`;
      progressText.innerHTML = `Question ${currentQuestion + 1} of ${totalQuestions} (${Math.round(percent)}% Complete)`;

      prevBtn.disabled = currentQuestion === 0;
      nextBtn.textContent = currentQuestion === totalQuestions - 1 ? "Find My Matches" : "Next";
    }

    nextBtn.addEventListener("click", () => {
      const selected = document.querySelector('input[name="option"]:checked');
      if (!selected) {
        alert("Please select an answer before continuing.");
        return;
      }

      answers[currentQuestion] = selected.value;

      if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestion();
      } else {
        showResults();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
      }
    });

    function calculateMatch(dog) {
      let score = 0;
      for (const key in dog.preferences) {
        if (Object.values(answers).includes(dog.preferences[key])) {
          score++;
        }
      }
      return Math.round((score / Object.keys(dog.preferences).length) * 100);
    }

    // function showResults() {
    //   const results = dogs
    //     .map((dog) => {
    //       const matchPercent = calculateMatch(dog);
    //       return { ...dog, matchPercent };
    //     })
    //     .sort((a, b) => b.matchPercent - a.matchPercent)
    //     .slice(0, 3);

    //   quizContainer.innerHTML = `
    //     <div class="results-container">
    //       <h1>✅ Your Perfect Matches!</h1>
    //       <p style="color:#555; margin-bottom:20px;">
    //         Based on your answers, here are your top dog breed matches:
    //       </p>
    //       ${results
    //         .map(
    //           (dog) => `
    //           <div class="dog-card">
    //             <img src="${dog.img}" alt="${dog.name}">
    //             <div class="dog-info">
    //               <h2>${dog.name}</h2>
    //               <div class="match">${dog.matchPercent}% Match</div>
    //               <p>${dog.traits.join(", ")}.</p>
    //               <div class="traits">
    //                 ${dog.traits.map((t) => `<span>${t}</span>`).join("")}
    //               </div>
    //             </div>
    //           </div>
    //         `
    //         )
    //         .join("")}
    //       <button class="retake-btn" onclick="location.reload()">Retake This Quiz</button>
    //     </div>
    //   `;
    // }

    loadQuestion();


  // 🐕 Fetch dog containers from dogs.html
  async function fetchDogContainers(dogIds) {
    try {
      const response = await fetch("browse-dogs.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Grab the containers with matching IDs
      const selectedDogs = dogIds.map(id => doc.getElementById(id)).filter(Boolean);

      return selectedDogs.map(dog => dog.outerHTML).join("");
    } catch (error) {
      console.error("Error fetching dog containers:", error);
      return `<p style="color:red;">Failed to load dog details.</p>`;
    }
  }

  // 🧩 Replace your existing showResults() with this version
  async function showResults() {
    const ans = Object.values(answers);

    // 9 conditions based on REAL text answers
    const conditions = [
      {
        answers: [
          "Apartment",
          "Low- Prefer indoor activities",
          "First-time dog owner",
          "Minimal – Basic care only!",
          "Single Person",
          "Small (under 25 Ibs)"
        ],
        dogs: ["maltese", "bulldog"]
      },
      {
        answers: [
          "House with small yard",
          "Moderately- Daily walks, some outdoor time",
          "Some experience with dogs",
          "Moderate- Regular grooming and basic training",
          "Couple, no children",
          "Medium (25-60 Ibs)"
        ],
        dogs: ["bulldog"]
      },
      {
        answers: [
          "House with large yard",
          "High- Regular exercise, hiking, running",
          "Very experienced dog owner",
          "High- Extensive training and grooming",
          "Family with young children(under 10)",
          "Giant (over 90 Ibs)"
        ],
        dogs: ["golden-retriever", "cocker-spaniel"]
      },
      {
        answers: [
          "Farm or rural property",
          "Very High- Marathon runner, extreme sports",
          "Professional trainer/breeder",
          "Professional level care",
          "Family with older children(10+)",
          "Giant (over 90 Ibs)"
        ],
        dogs: ["golden-retriever", "labrador-retriever"]
      },
      {
        answers: [
          "Apartment",
          "Moderately- Daily walks, some outdoor time",
          "Very experienced dog owner",
          "Professional level care",
          "Single Person",
          "Medium (25-60 Ibs)"
        ],
        dogs: ["bulldog", "beagle"]
      },
      {
        answers: [
          "House with small yard",
          "High- Regular exercise, hiking, running",
          "Professional trainer/breeder",
          "Minimal – Basic care only!",
          "Couple, no children",
          "Giant (over 90 Ibs)"
        ],
        dogs: ["bulldog", "beagle"]
      },
      {
        answers: [
          "House with large yard",
          "Very High- Marathon runner, extreme sports",
          "First-time dog owner",
          "Moderate- Regular grooming and basic training",
          "Family with young children(under 10)",
          "Giant (over 90 Ibs)"
        ],
        dogs: ["golden-retriever", "cocker-spaniel"]
      },
      {
        answers: [
          "Farm or rural property",
          "Low- Prefer indoor activities",
          "Some experience with dogs",
          "High- Extensive training and grooming",
          "Family with older children(10+)",
          "Small (under 25 Ibs)"
        ],
        dogs: ["golden-retriever", "labrador-retriever"]
      },
      {
        answers: [
          "Apartment",
          "High- Regular exercise, hiking, running",
          "First-time dog owner",
          "Moderate- Regular grooming and basic training",
          "Single Person",
          "Giant (over 90 Ibs)"
        ],
        dogs: ["maltese"]
      }
    ];

    // find a condition that matches exactly
    let matchedDogs = [];
    for (const condition of conditions) {
      if (JSON.stringify(ans) === JSON.stringify(condition.answers)) {
        matchedDogs = condition.dogs;
        break;
      }
    }

    // If no condition matches
    if (matchedDogs.length === 0) {
      quizContainer.innerHTML = `
        <div class="results-container">
          <h1>😕 No Dogs Matching Your Criteria</h1>
          <p>Try retaking the quiz with different answers!</p>
          <button class="retake-btn" onclick="location.reload()">Retake This Quiz</button>
        </div>
      `;
      return;
    }

    // Fetch and show the matched dog containers
    const dogHTML = await fetchDogContainers(matchedDogs);

   quizContainer.innerHTML = `
  <div class="results-container">
    <h1>✅ Your Perfect Matches!</h1>
    <p>Based on your answers, here are your best breed matches:</p>

    <div class="dog-results">
      ${dogHTML}
    </div>

    <button class="retake-btn" onclick="location.reload()">Retake This Quiz</button>
  </div>
`;

  }

