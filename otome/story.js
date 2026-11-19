
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
        affection: 10
      },
      {
        text: "....。",
        affection: 5
      },
      {
        text: "覚えてない",
        affection: -5
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
    type: "ending",
    name: "END",
    text: "つづく"
  }
];

