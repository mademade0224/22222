
const story = [
  {
    type: "dialogue",
    bg: "background.jpg",
    name: "？？？",
    text: "……あれ。君、見かけない顔だね。"
  },
  {
    type: "dialogue",
    name: "？？？",
    text: "ここで何をしているの？"
  },
  {
    type: "choice",
    choices: [
      {
        text: "君に会いに来たんだ。",
        affection: 10
      },
      {
        text: "ちょっと迷子になって。",
        affection: 5
      },
      {
        text: "別に、何でもない。",
        affection: -5
      }
    ]
  },
  {
    type: "dialogue",
    name: "？？？",
    text: "ふうん……。なんだか面白い人だね。"
  },
  {
    type: "dialogue",
    name: "？？？",
    text: "また会えるといいな。"
  },
  {
    type: "ending",
    name: "END",
    text: "これで今日のお話はおしまい。"
  }
];

