let currentIndex = 0;
let affections = {
  masato: 0,
  noshiro: 0
};
let fadeTimer = null;
let bgFadeTimer = null;
let typeTimer = null;
let currentCharaOwner = "";
let playerName = "YOU";

// タイプライター状態管理
let isTyping = false;
let currentFullText = "";
let onTypingComplete = null;

let isTypingGame = false;
let typingWords = [];
let typingWordIndex = 0;
let typingNextId = null;

const nameElement = document.getElementById("name");
const textElement = document.getElementById("text");
const choicesElement = document.getElementById("choices");
const nextButton = document.getElementById("next-button");
const messageBoxElement = document.getElementById("message-box");
const bgElement = document.getElementById("background");
const bgFadeElement = document.getElementById("bg-fade");
const charaElement = document.getElementById("character");

const nameInputScreen = document.getElementById("name-input-screen");
const playerNameInput = document.getElementById("player-name-input");
const startGameButton = document.getElementById("start-game-button");

const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-modal");
const closeHelpButton = document.getElementById("close-help-button");

const typingAreaElement = document.getElementById("typing-area");
const typingTargetElement = document.getElementById("typing-target");
const typingInputElement = document.getElementById("typing-input");
const typingStatusElement = document.getElementById("typing-status");

// 文字列内の {name}（全角｛name｝も対応）を入力したプレイヤー名に変換する
function formatText(str) {
  if (!str) return "";
  return String(str).replace(/[｛{]\s*name\s*[｝}]/g, playerName);
}

// 1文字ずつ表示を開始する
function typeText(fullText, onComplete) {
  clearInterval(typeTimer);
  currentFullText = fullText || "";
  onTypingComplete = typeof onComplete === "function" ? onComplete : null;

  // 文字送り中は「次へ」ボタンを隠す
  nextButton.style.display = "none";

  // 空文字なら即完了
  if (currentFullText.length === 0) {
    textElement.textContent = "";
    isTyping = false;
    if (onTypingComplete) {
      const cb = onTypingComplete;
      onTypingComplete = null;
      cb();
    }
    return;
  }

  isTyping = true;
  textElement.textContent = "";
  let charIndex = 0;

  // 送り速度（ms）：少し速めなら 25〜30、ゆったりなら 45〜60
  const speedMs = 35;

  typeTimer = setInterval(() => {
    charIndex++;
    textElement.textContent = currentFullText.slice(0, charIndex);

    if (charIndex >= currentFullText.length) {
      finishTyping();
    }
  }, speedMs);
}

// 文字送りを完了（スキップ時もここを通る）
function finishTyping() {
  clearInterval(typeTimer);
  typeTimer = null;
  isTyping = false;
  textElement.textContent = currentFullText;

  if (onTypingComplete) {
    const cb = onTypingComplete;
    onTypingComplete = null;
    cb();
  }
}

// セリフ欄をタップしたら文字送りをスキップして全文表示
if (messageBoxElement) {
  messageBoxElement.addEventListener("click", () => {
    if (isTyping) {
      finishTyping();
    }
  });
}

// ボタンや選択肢をクリックしたときはセリフ欄のスキップ判定とぶつからないようにする
nextButton.addEventListener("click", (e) => {
  e.stopPropagation();
});
choicesElement.addEventListener("click", (e) => {
  e.stopPropagation();
});

// 操作方法モーダルの開閉
if (helpButton && helpModal) {
  helpButton.addEventListener("click", (e) => {
    e.stopPropagation();
    helpModal.classList.remove("is-hidden");
  });
}

if (closeHelpButton && helpModal) {
  closeHelpButton.addEventListener("click", (e) => {
    e.stopPropagation();
    helpModal.classList.add("is-hidden");
  });
}

if (helpModal) {
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.classList.add("is-hidden");
    }
  });
}

function updateCharacterBrightness(speakerName) {
  const isVisible =
    charaElement.style.display !== "none" &&
    !charaElement.classList.contains("is-hidden");

  if (!isVisible || !currentCharaOwner) {
    charaElement.classList.remove("is-dim");
    return;
  }

  // 「？？？」または立ち絵の本人（currentCharaOwner）がしゃべっているときは明るくする
  if (speakerName !== "？？？" && speakerName !== currentCharaOwner) {
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

// nextId が指定されていれば該当 id のステップへ移動し、なければ次の番号へ進む
function goToNextStep(item) {
  if (item && item.nextId) {
    const targetIndex = story.findIndex((step) => step.id === item.nextId);
    if (targetIndex !== -1) {
      currentIndex = targetIndex;
      showStep();
      return;
    }
    console.warn("指定された nextId が見つかりません:", item.nextId);
  }

  currentIndex++;
  showStep();
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

  // 表示をリセット（文字送り中は次へボタンを必ず非表示にする）
  clearInterval(typeTimer);
  isTyping = false;
  onTypingComplete = null;
  choicesElement.innerHTML = "";
  nextButton.style.display = "none";

  nameElement.textContent = step.name || "";
  textElement.textContent = "";
  updateCharacterBrightness(step.name || "");

  const formattedText = formatText(step.text);

  // 選択肢の場合：文字送り完了後に選択肢を表示
  if (step.type === "choice") {
    typeText(formattedText, () => {
      showChoices(step.choices);
    });
    return;
  }

  // エンディングの場合：文字送り完了後に「今日の結果を見る」ボタンを表示
  if (step.type === "ending") {
    typeText(formattedText, () => {
      nextButton.textContent = "今日の結果を見る";
      nextButton.style.display = "block";
      nextButton.onclick = showEnd;
    });
    return;
  }

  // 通常の会話の場合：文字送り完了後に「次へ ▼」ボタンを表示
  typeText(formattedText, () => {
    nextButton.textContent = "次へ ▼";
    nextButton.style.display = "block";
    nextButton.onclick = nextStep;
  });
}

function showChoices(choices) {
  choices.forEach((choice) => {
    const button = document.createElement("button");

    button.className = "choice-button";
    button.textContent = formatText(choice.text);

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      if (choice.target && affections[choice.target] !== undefined) {
        affections[choice.target] += choice.affection || 0;
      }

      if (choice.replyText) {
        choicesElement.innerHTML = "";
        nameElement.textContent = choice.replyName || "";
        textElement.textContent = "";

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

        // 返答セリフもタイプライター表示（完了後に「次へ ▼」を出す）
        typeText(formatText(choice.replyText), () => {
          nextButton.textContent = "次へ ▼";
          nextButton.style.display = "block";
          nextButton.onclick = () => {
            goToNextStep(choice);
          };
        });
        return;
      }

      goToNextStep(choice);
    });

    choicesElement.appendChild(button);
  });
}

function nextStep() {
  if (isTyping) return;
  const step = story[currentIndex];
  goToNextStep(step);
}

function showEnd() {
  clearInterval(typeTimer);
  isTyping = false;
  onTypingComplete = null;

  nameElement.textContent = "GAME END";
  textElement.textContent =
    playerName + "の今回の結果\n\n" +
    "正人の好感度：" + affections.masato +
    "\nノシロの好感度：" + affections.noshiro +
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
  clearInterval(typeTimer);
  isTyping = false;
  onTypingComplete = null;
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
  playerName = input || "小林正子";
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

// Enterキーで「次へ ▼」（または表示中の進行ボタン）を押す
document.addEventListener("keydown", (e) => {
  // 日本語変換確定のEnter（isComposing）は無視する
  if (e.isComposing) return;

  if (e.key === "Enter") {
    // 操作方法モーダルが開いているときはEnterでモーダルを閉じてストーリーは進めない
    if (helpModal && !helpModal.classList.contains("is-hidden")) {
      e.preventDefault();
      helpModal.classList.add("is-hidden");
      return;
    }

    // 名前入力欄の入力中は対象外にする
    if (document.activeElement === playerNameInput) return;

    // 名前入力画面が開いている間は対象外にする
    if (nameInputScreen && nameInputScreen.style.display !== "none") return;

    // 文字送り中ならスキップして全文表示
    if (typeof isTyping !== "undefined" && isTyping) {
      e.preventDefault();
      finishTyping();
      return;
    }

    // 進行ボタン（「次へ ▼」など）が表示されているときだけクリックを実行
    if (nextButton && nextButton.style.display !== "none") {
      e.preventDefault(); // フォーカス中のボタンが二重クリックされるのを防ぐ
      nextButton.click();
    }
  }
  function startTypingMiniGame(step) {
  isTypingGame = true;
  typingWords = Array.isArray(step.words) && step.words.length > 0
    ? [...step.words]
    : ["call"];
  typingWordIndex = 0;
  typingNextId = step.nextId || null;

  nextButton.style.display = "none";
  choicesElement.innerHTML = "";

  if (typingAreaElement) {
    typingAreaElement.style.display = "block";
  }

  setupTypingQuestion();
}

function setupTypingQuestion() {
  const currentWord = typingWords[typingWordIndex];
  if (typingTargetElement) {
    typingTargetElement.textContent = currentWord;
  }
  if (typingStatusElement) {
    typingStatusElement.textContent = `問題 ${typingWordIndex + 1} / ${typingWords.length}`;
  }
  if (typingInputElement) {
    typingInputElement.value = "";
    typingInputElement.focus();
  }
}

function finishTypingMiniGame() {
  isTypingGame = false;
  if (typingAreaElement) {
    typingAreaElement.style.display = "none";
  }
  if (typingInputElement) {
    typingInputElement.value = "";
  }

  goToNextStep({ nextId: typingNextId });
}

if (typingInputElement) {
  typingInputElement.addEventListener("input", () => {
    if (!isTypingGame) return;
    const targetWord = typingWords[typingWordIndex] || "";
    const typed = typingInputElement.value;

    // 完全一致したら次の問題へ（またはクリア）
    if (typed === targetWord) {
      typingWordIndex++;
      if (typingWordIndex < typingWords.length) {
        setupTypingQuestion();
      } else {
        finishTypingMiniGame();
      }
    }
  });

  typingInputElement.addEventListener("keydown", (e) => {
    if (e.isComposing) return;
    if (!isTypingGame) return;

    // クリック防止のため親への伝播を止める
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      const targetWord = typingWords[typingWordIndex] || "";
      if (typingInputElement.value.trim() === targetWord) {
        typingWordIndex++;
        if (typingWordIndex < typingWords.length) {
          setupTypingQuestion();
        } else {
          finishTypingMiniGame();
        }
      } else if (typingStatusElement) {
        typingStatusElement.textContent = "ちがうみたい！もう一度入力してみて";
      }
    }
  });
}
});
