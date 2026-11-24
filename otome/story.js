const story = [
  {
    type: "dialogue",
    bg: "images/background.jpg",
    chara: null,
    name: "YOU",
    text: "私は三鷹中等教育学校☆年生、{name}！いけない、また遅刻だわ！"
  },
  {
    type: "dialogue",
    chara: "images/character.png",
    charaOwner: "？？？",
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
    text: "（校長室へ向かわねば!）"
  },
  {
    type: "dialogue",
    name: "？？？",
    bg: "images/background2.jpg",
    chara: "images/character2.png",
    charaOwner: "？？？",
    text: "やあ"
  },
  {
    type: "choice",
    choices: [
      {
        text: "きゃー！",
        target: "noshiro",
        affection: -10,
        replyName: "？？？",
        replyText: "失礼だなー。ノシロだよ。"
      },
      {
        text: "誰？",
        target: "noshiro",
        affection: 0,
        replyName: "？？？",
        replyText: "ノシロだよ。よろしく。"
      },
      {
        text: "こんにちは！",
        target: "noshiro",
        affection: 10,
        replyName: "？？？",
        replyText: "UNIX研究同好会のノシロだよ。よろしくね！"
      }
    ]
  },
  {
    type: "dialogue",
    name: "YOU",
    text: "よろしくね。ところで、校長室はどこ？"
  },
  {
    type: "dialogue",
    name: "ノシロ",
    charaOwner: "ノシロ",
    text: "南棟二階だよ。でも、そんなところより僕と第一call室でタイピングをしないかい？"
  },
   {
    type: "choice",
    choices: [
      {
        text: "いいよ。",
        target: "noshiro",
        affection: 10,
        replyName: "ノシロ",
        replyText: "いえーい",
        nextId: "route_a_1"
      },
      {
        text: "いやだね",
        target: "noshiro",
        affection: 0,
        replyName: "ノシロ",
        replyText: "マサトめー",
        nextId: "route_skip_1"
      },
    ]
  },
  {
    id: "route_a_1",
    name: "ノシロ",
    text: "第一callしつだよ。"
  },
  {
    id: "typing_a",
    type: "typing",
    name: "ノシロ",
    text: "タイピングスタートだよ！",
    words: [{ jdisplay: "発調考見挑振",
        answers: ["hattyoukoukenntyoushinn", "hattyoukoukenntyousinn", "はっちょうこうけんちょうしん"]},
      { jdisplay: "あみじすか",
        answers: ["あみじすか","amijisuka"]},
      { jdisplay: "規律ある自由",
        answers: ["kiritsuarujiyuu", "kirituarujiyuu", "きりつあるじゆう"]}, // 出題リスト（1問だけでもOK）
    nextId: "route_a_10" // クリアしたら route_a_10 へ進む
  },
  {
    id: "route_a_10",
    name: "ノシロ",
    text: "そろそろHRに行こうか。",
    nextId: "after_choice"
  },
  {
    id: "route_skip_1",
    name: "ノシロ",
    text: "覚えてろよー",
    nextId: "after_choice"
  },
  {
    id: "after_choice",
    name: "YOU",
    text: "やばい！"
  },
  {
    type: "ending",
    name: "END",
    text: "つづく"
  }
];
