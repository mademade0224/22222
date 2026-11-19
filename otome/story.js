
const story = [
  {
    type: "dialogue",
    bg: "background.jpg",
    chara: "character.png",
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
    text: "待っているから"
  },
  {
    type: "ending",
    name: "END",
    text: "では👋"
  }
];

