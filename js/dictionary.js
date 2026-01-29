async function searchWord() {
  const wordInput = document.getElementById("wordInput");
  const resultDiv = document.getElementById("result");
  const word = wordInput.value.trim();


  if (!word) {
    resultDiv.innerHTML = "<p style='color: #e63946;'>Please enter a word.</p>";
    return;
  }


  resultDiv.innerHTML = "<p class='searching'>Searching for definitions...</p>";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );


    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    displayResults(data[0], resultDiv);
  } catch (error) {
    resultDiv.innerHTML = `
      <div class="word-card">
        <p><strong>Oops!</strong> We couldn't find "${word}". Try another word!</p>
      </div>
    `;
  }
}


function displayResults(data, container) {
  const word = data.word;
  const phonetics = data.phonetics.find((p) => p.audio !== "")?.audio || "";
  const meaning = data.meanings[0].definitions[0];

  container.innerHTML = `
    <div class="word-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="text-transform: capitalize; margin: 0;">${word}</h3>
        ${
          phonetics
            ? `<button onclick="new Audio('${phonetics}').play()" class="audio-btn">Play</button>`
            : ""
        }
      </div>
      
      <p style="font-style: italic; color: #6c757d;">
${data.meanings[0].partOfSpeech}</p>
      
      <p><strong>Definition:</strong> ${meaning.definition}</p>
      
      ${
        meaning.example
          ? `<p><strong>Example:</strong> <em>"${meaning.example}"</em></p>`
          : ""
      }
      
      ${
        data.meanings[0].synonyms.length > 0
          ? `<p><strong>Synonyms:</strong> ${data.meanings[0].synonyms
              .slice(0, 3)
              .join(", ")}</p>`
          : ""
      }
    </div>
  `;
}
