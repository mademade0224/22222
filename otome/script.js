

let currentIndex = 0;
let affection = 0;
let fadeTimer = null;

const nameElement = document.getElementById("name");
const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-button");
const bgElement = document.getElementById("background");
const charaElement = document.getElementById("character"); // ← 追加

function showStep() {
  const step = story[currentIndex];

  if (!step) {
    showEnd();
    return;
  }

  // ← 追加：stepにbgが指定されていたら画像を切り替える
  if (step.bg) {
    bgElement.src = step.bg;
  }

  if (step.chara !== undefined) {
    clearTimeout(fadeTimer);
    
    if (step.chara) {
      charaElement.src = step.chara;
      charaElement.style.display = "block";// 表示する
      requestAnimationFrame(() => {
        charaElement.classList.remove("is-hidden");
      });
    } else {
      charaElement.classList.add("is-hidden");
      fadeTimer = setTimeout(() => {
        if (charaElement.classList.contains("is-hidden")) {
      charaElement.style.display = "none";  // 画像がない場合は非表示にする
        }
      }, 600);
    }
  }
  // ストーリーが最後まで進んだ場合
  if (!step) {
    showEnd();
    return;
  }

  // 表示をリセット
  choicesElement.innerHTML = "";
  nextButton.style.display = "none";

  nameElement.textContent = step.name || "";
  textElement.textContent = step.text || "";

  // 選択肢の場合
  if (step.type === "choice") {
    showChoices(step.choices);
    return;
  }

  // エンディングの場合
  if (step.type === "ending") {
    nextButton.textContent = "タイトルへ";
    nextButton.style.display = "block";
    nextButton.onclick = showEnd;
    return;
  }

  // 通常の会話の場合
  nextButton.textContent = "次へ ▼";
  nextButton.style.display = "block";
  nextButton.onclick = nextStep;
}

function showChoices(choices) {
  choices.forEach((choice) => {
    const button = document.createElement("button");

    button.className = "choice-button";
    button.textContent = choice.text;

    button.addEventListener("click", () => {
      affection += choice.affection || 0;

      currentIndex++;
      showStep();
    });

    choicesElement.appendChild(button);
  });
}

function nextStep() {
  currentIndex++;
  showStep();
}

function showEnd() {
  nameElement.textContent = "GAME END";
  textElement.textContent =
    "今回の好感度：" + affection + "\n\nおしまい";

  choicesElement.innerHTML = "";
  nextButton.textContent = "最初から";
  nextButton.style.display = "block";
  nextButton.onclick = restartGame;
}

function restartGame() {
  currentIndex = 0;
  affection = 0;
  showStep();
}

// ゲーム開始
showStep();
