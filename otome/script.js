let currentIndex = 0;
let affections = {
  masato: 0,
  noshiro: 0
};
let fadeTimer = null;
let bgFadeTimer = null;
let currentCharaOwner = "";
let playerName = "YOU";

const nameElement = document.getElementById("name");
const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-button");
const bgElement = document.getElementById("background");
const bgFadeElement = document.getElementById("bg-fade");
const charaElement = document.getElementById("character");

const nameInputScreen = document.getElementById("name-input-screen");
const playerNameInput = document.getElementById("player-name-input");
const startGameButton = document.getElementById("start-game-button");

function formatText(str) {
  if (!str) return "";
  return str.replaceAll("{name}", playerName);
}

function updateCharacterBrightness(speakerName) {
  const isVisible =
    charaElement.style.display !== "none" &&
    !charaElement.classList.contains("is-hidden");

  if (!isVisible || !currentCharaOwner) {
    charaElement.classList.remove("is-dim");
    return;
  }

  // しゃべっている人が立ち絵のオーナー（charaOwner）と違うときは暗くする
  if (speakerName !== currentCharaOwner) {
    charaElement.classList.add("is-dim");
  } else {
    charaElement.classList.remove("is-dim");
  }
}

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
      currentCharaOwner = step.charaOwner || "";
      charaElement.src = step.chara;
      charaElement.style.display = "block";
      requestAnimationFrame(() => {
        charaElement.classList.remove("is-hidden");
      });
    } else {
      currentCharaOwner = "";
      charaElement.classList.add("is-hidden");
      fadeTimer = setTimeout(() => {
        if (charaElement.classList.contains("is-hidden")) {
          charaElement.style.display = "none";
        }
      }, 600);
    }
  } else if (step.charaOwner !== undefined) {
    currentCharaOwner = step.charaOwner;
  }

  // 表示をリセット
  choicesElement.innerHTML = "";
  nextButton.style.display = "none";

  nameElement.textContent = step.name || "";
  textElement.textContent = step.text || "";
  updateCharacterBrightness(step.name || "");

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
      if (choice.target && affections[choice.target] !== undefined) {
        affections[choice.target] += choice.affection || 0;
      }

      if (choice.replyText) {
        choicesElement.innerHTML = "";
        nameElement.textContent = choice.replyName || "";
        textElement.textContent = choice.replyText;

        if (choice.replyChara) {
          clearTimeout(fadeTimer);
          if (choice.replyCharaOwner !== undefined) {
            currentCharaOwner = choice.replyCharaOwner;
          }
          charaElement.src = choice.replyChara;
          charaElement.style.display = "block";
          requestAnimationFrame(() => {
            charaElement.classList.remove("is-hidden");
          });
        } else if (choice.replyCharaOwner !== undefined) {
          currentCharaOwner = choice.replyCharaOwner;
        }

        updateCharacterBrightness(choice.replyName || "");

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
    "正人の好感度：" + affections.masato +
    "\n能代ちゃんの好感度：" + affections.noshiro +
    "\n\nおしまい";

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
  currentCharaOwner = "";
  charaElement.classList.remove("is-dim");
  affections = {
    masato: 0,
    noshiro: 0
  };
  showStep();
}

function startGameWithPlayerName() {
  const input = playerNameInput ? playerNameInput.value.trim() : "";
  playerName = input || "YOU";
  if (nameInputScreen) {
    nameInputScreen.style.display = "none";
  }
  showStep();
}

// 名前決定ボタンとEnterキーでゲーム開始
if (startGameButton) {
  startGameButton.addEventListener("click", startGameWithPlayerName);
}
if (playerNameInput) {
  playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      startGameWithPlayerName();
    }
  });
}

// 名前入力画面がない場合はそのまま開始
if (!nameInputScreen) {
  showStep();
}
