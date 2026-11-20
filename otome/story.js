
const story = [
  {
    type: "dialogue",
    bg: "images/background.jpg",
    chara: "images/character.png",
    name: "？？？",
    text: "…最近遅刻が多いんじゃない"
  },
  {
    type: "dialogue",
    name: "？？？",
    text: "あみじすか、覚えてる？"
  },
  {
    type: "choice",
    choices: [
      {
        text: "もちろん",
        target: "masato",
        affection: 10,
        replyName: "？？？",
        replyText: "えらいです"
      },
      {
        text: "....。",
        target: "masato",
        affection: 5,
        replyName: "？？？",
        replyText: "あいさつ身だしなみ時間を守るすぐやる感謝の気持ち"
      },
      {
        text: "覚えてない",
        target: "masato",
        affection: -5,
        replyName: "？？？",
        replyText: "凡事徹底がなってませんね"
      }
    ]
  },
  {
    type: "dialogue",
    name: "？？？",
    text: "あとで校長室へ来なさい"
  },
    {
    type: "dialogue",
    name: "？？？",
    chara: null,
    text: "では👋"
  },
    {
    type: "dialogue",
    name: "YOU",
    text: "(なんだったのだろうか…？)"
  },
  {
    type: "dialogue",
    name: "YOU",
    text: "（生活指導である。校長室へ向かわねば。）"
  },
  {
  type: "dialogue",
    name: "？？？",
    bg: "images/background2.jpg",
    chara: "images/character2.png",
    text: "やあ"
  },
    {
    type: "choice",
    choices: [
      {
        text: "きゃあっ！",
        replyName: "？？？",
        replyChara: "images/character.png",
        replyText: "失礼だなー。ノシロだよ。"
      },
      {
        text: "誰？",
        replyName: "？？？",
        replyText: "ノシロだよ。よろしく。"
      },
      {
        text: "こんにちは！",
        replyName: "？？？",
        replyText: "UNIX研究同好会のノシロだよ。よろしくね！"
      }
    ]
  },
  {
    type: "dialogue",
    name: "YOU",
    text: "よろしくね。ノシロくん。"
  },
  
  {
    type: "ending",
    name: "END",
    text: "つづく"
  }
];

