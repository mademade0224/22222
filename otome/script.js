let currentIndex = 0;
let affections = {
  masato: 0,
  noshiro: 0
};
let fadeTimer = null;
let bgFadeTimer = null;

const nameElement = document.getElementById("name");
const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-button");
const bgElement = document.getElementById("background");
const bgFadeElement = document.getElementById("bg-fade");
const charaElement = document.getElementById("character");

function changeBackground(nextBg) {
  if (!nextBg) return;

  clearTimeout(bgFadeTimer);

  // 初回表示または同じ背景なら暗転せず切り替え
  const currentBg = bgElement.getAttribute("src");
  if (!currentBg) {
    bgElement.src = nextBg;
    return;
  }
  if (currentBg === nextBg) {
    return;
  }

  // 暗転要素がない場合はそのまま切り替える
  if (!bgFadeElement) {
    bgElement.src = nextBg;
    return;
  }

  // すぅっと暗転 → 350ms後に画像を差し替えてすぅっと明転
  bgFadeElement.classList.add("is-active");
  bgFadeTimer = setTimeout(() => {
    bgElement.src = nextBg;
    bgFadeElement.classList.remove("is-active");
  }, 350);
}

function showStep() {
  const step = story[currentIndex];

  if (!step) {
    showEnd();
    return;
  }

  // 背景の切り替え（暗転演出付き）
  if (step.bg) {
    changeBackground(step.bg);
  }

  // キャラクター画像の表示・フェードアウト制御
  if (step.chara !== undefined) {
    clearTimeout(fadeTimer);

    if (step.chara) {
      charaElement.src = step.chara;
      charaElement.style.display = "block";
      requestAnimationFrame(() => {
        charaElement.classList.remove("is-hidden");
      });
    } else {
      charaElement.classList.add("is-hidden");
      fadeTimer = setTimeout(() => {
        if (charaElement.classList.contains("is-hidden")) {
          charaElement.style.display = "none";
        }
      }, 600);
    }
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
    nextButton.textContent = "今日の結果を見る";
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
      if (choice.replyText) {
        choicesElement.innerHTML = "";
        nameElement.textContent = choice.replyName || "";
        textElement.textContent = choice.replyText;

        if (choice.replyChara) {
          clearTimeout(fadeTimer);
          charaElement.src = choice.replyChara;
          charaElement.style.display = "block";
          requestAnimationFrame(() => {
            charaElement.classList.remove("is-hidden");
          });
        }

        nextButton.textContent = "次へ ▼";
        nextButton.style.display = "block";
        nextButton.onclick = () => {
          currentIndex++;
          showStep();
        };
        return;
      }

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
  nextButton.onclick = () => {
    window.location.href = "../index.html";
  };
}

function restartGame() {
  clearTimeout(fadeTimer);
  clearTimeout(bgFadeTimer);
  currentIndex = 0;
  affections = {
    masato: 0,
    noshiro: 0
  };
  showStep();
}

// ゲーム開始
showStep();
