
/*
    声を聴かせて、ランスロット！
    game.js / scenario data

    opts        : 常時表示する返答（意味を決めつけない）
    insightOpts : 現SCENEの全暗号を正しく推測した時に追加する返答
    misreadOpts : ノートの実際の誤答がtrigger.guessesに一致した時の返答

    注：各追加選択肢の表示・解放条件と選択履歴保存は、
        index.html側の対応実装が必要です。
        通常選択肢の旧ID / words / resolveChecks は維持しています。
*/

const scenario = [

    // =========================================================
    // 第1章　聞こえない言葉
    // =========================================================
    {
        id: 0,
        q: "「ヴェイン、目が覚めたか。……よかった。医師はまだ来ていない。お前が起きるまで、[[W1|心配]]していた。」",
        vaneThought: "……今の一音、何だ？　声はいつものランちゃんのままだったのに。",
        words: [
            { key: "W1", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "へへ、目覚めたばっかだぜ。そんな顔すんなよ",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは言いかけた口を閉じ、椅子の背へ手を置いた。"
            },
            {
                t: "体調のことなら、ちゃんと医者に話すって",
                v: 10,
                axis: "self",
                reaction: "ランスロットは医師の方へ目を向け、頷いた。"
            },
            {
                t: "俺よりランちゃんの方が寝てないんじゃないか？",
                v: 15,
                axis: "act",
                reaction: "ランスロットは思いがけない質問に瞬きをした。"
            }
        ],
        insightOpts: [
            {
                id: "s00_insight_resonance",
                t: "あれだけ心配かけたんだな。……ごめんな、ランちゃん",
                v: 20,
                axis: "listen",
                reaction: "ランスロットはゆっくり息を吐き、首を横に振った。"
            }
        ],
        misreadOpts: [
            {
                id: "s00_guess_w1",
                t: "ずっと見張ってたのか？　俺、寝相そんなに悪い？",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["監視する", "見張る"]
                },
                misreadImpact: true,
                reaction: "ランスロットは目を丸くし、すぐには返事をしなかった。"
            }
        ],
        afterStory: "起き上がろうとすると、ランスロットが椅子から腰を浮かせた。だがすぐには触れず、医師が近づくのを待っている。ヴェインはその動きを見てから、聞こえた音を記憶に留めた。",
        nextHook: "医師に診てもらえば、すぐ原因が分かる。二人とも、まだそう思っていた。"
    },
    {
        id: 1,
        q: "「検査では異常がないらしい。なら……俺から、お前にちゃんと[[W15|伝え]]られるか試してみたい。」",
        vaneThought: "検査は問題なし。だったら何を確かめればいいんだろう。",
        words: [
            { key: "W15", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "じゃ、まず何から試す？　俺もちゃんと聞くぜ",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは頷き、少し考えてから口を開いた。"
            },
            {
                t: "変な音が混じったら、その場で止めていいか？",
                v: 15,
                axis: "self",
                reaction: "ランスロットはすぐに了承した。"
            },
            {
                t: "二人で手順を決めようぜ。紙も使えるだろ",
                v: 5,
                axis: "act",
                reaction: "ランスロットは机から白紙を取ってきた。"
            }
        ],
        insightOpts: [
            {
                id: "s01_insight_twin",
                t: "言葉が届くかを試したいんだな。じゃ、何でも言ってみて",
                v: 20,
                axis: "act",
                reaction: "ランスロットは頷き、試す文を考え始めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s01_guess_w15",
                t: "俺を試すってこと？　よし、じゃあ何問でもかかってこい！",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W15",
                    guesses: ["確かめる"]
                },
                misreadImpact: true,
                reaction: "ランスロットは困ったように首を傾げた。"
            }
        ],
        afterStory: "医師の質問には違和感がない。ランスロットが同じように短い文を話すと、一部分だけが別の音になる。ヴェインは紙を借り、聞こえたとおりの形を書いた。",
        nextHook: "同じ音がもう一度出てくれば、何か分かるかもしれない。"
    },
    {
        id: 2,
        q: "「皿を空にできそうだな。……さっきは言いそびれたが、今なら[[W3]]と言える気がする。」",
        vaneThought: "前に聞いたのとは違う音だ。短かったのに、ちゃんと残ってる。",
        words: [
            { key: "W3", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "あー、こういう飯が一番落ち着くな！",
                v: 20,
                axis: "act",
                reaction: "ランスロットは食卓を見渡し、肩の力を抜いた。"
            },
            {
                t: "まだ無茶はできないから、今日は控えめにしとく",
                v: 15,
                axis: "self",
                reaction: "ランスロットはヴェインの皿を見て頷いた。"
            },
            {
                t: "ランちゃんは？　さっきから箸が止まってるぜ",
                v: 15,
                axis: "listen",
                reaction: "ランスロットは手元に目を落とし、料理を一口運んだ。"
            }
        ],
        insightOpts: [
            {
                id: "s02_insight_resonance",
                t: "こっちこそありがとな。起きるまでそばにいてくれたんだろ？",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは少しだけ目を丸くし、それから笑った。"
            }
        ],
        misreadOpts: [
            {
                id: "s02_guess_w3",
                t: "そんな嬉しいことあったのか？　何かいい知らせでも？",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W3",
                    guesses: ["嬉しい", "喜ぶ"]
                },
                misreadImpact: true,
                reaction: "ランスロットは首を傾げ、ヴェインの顔を見た。"
            }
        ],
        afterStory: "食堂はいつもの賑わいだった。皿が置かれる音、仲間の笑い声、料理の匂い。ランスロットはヴェインの返事を聞いてから食事を再開した。",
        nextHook: "まだ答えは出ない。それでもノートには、三つの記号が並んだ。"
    },
    {
        id: 3,
        q: "「体調が戻ったら、また[[W2]]に訓練をしよう。……それから、食事にも行こう。」",
        vaneThought: "訓練も飯も、やりたいことが増えるな。……あの音はどこにかかってるんだ？",
        words: [
            { key: "W2", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "よっしゃ！　次は一緒に汗かこうぜ！",
                v: 20,
                axis: "act",
                reaction: "ランスロットは木剣を振る真似をしてみせた。"
            },
            {
                t: "でも復帰日は俺の体調を見て決めるからな",
                v: 10,
                axis: "self",
                reaction: "ランスロットは一拍置いてから同意した。"
            },
            {
                t: "どこか行きたい店でも見つけたのか？",
                v: 15,
                axis: "listen",
                reaction: "ランスロットは思い当たる店の話を始めた。"
            }
        ],
        insightOpts: [
            {
                id: "s03_insight_twin",
                t: "一緒に、だろ？　訓練も飯もランちゃんとなら大歓迎！",
                v: 20,
                axis: "act",
                reaction: "ランスロットは照れくさそうに微笑んだ。"
            }
        ],
        misreadOpts: [
            {
                id: "s03_guess_w2",
                t: "静かな場所がいいのか？　訓練場って結構騒がしいぜ？",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W2",
                    guesses: ["静か"]
                },
                misreadImpact: true,
                reaction: "ランスロットは思いがけない話題に瞬きをした。"
            }
        ],
        afterStory: "甲板を吹く風が少し冷たくなった。二人は訓練の日程と食べたい料理をあれこれ挙げた。記号を含む一文は、それ以上説明されなかった。",
        nextHook: "翌朝、ヴェインは軽い訓練への復帰を許可された。"
    },

    // =========================================================
    // 第2章　言葉を集める
    // =========================================================
    {
        id: 4,
        q: "「本当に無理はしていないんだな？　まだ[[W1|心配]]なんだ。……だが、お前が大丈夫だと言うなら、その判断を[[W12|信じ]]る。」",
        vaneThought: "最初の日の音だ。もう一つは初めて。続けて聞くと、別の意味にも取れそうだ。",
        words: [
            { key: "W1", type: "repeat2" },
            { key: "W12", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: "light",
        opts: [
            {
                id: "s04_unknown",
                t: "……うん。気になることがあるなら、今のうちに言ってくれ",
                v: 25,
                axis: "daily",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはヴェインの構えを見つめ、木剣を取り直した。"
            },
            {
                id: "s04_misread",
                t: "今日は一本ずつ確かめよう。俺もランちゃんの動きを見る",
                v: 15,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは頷き、訓練場の中央へ移動した。"
            },
            {
                id: "s04_understood",
                t: "無理なら止める。けど、続けるかは俺にも決めさせてくれ",
                v: 10,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはしばらく考え、それから訓練開始の合図をした。"
            }
        ],
        insightOpts: [
            {
                id: "s04_insight_resonance",
                t: "心配なのも、俺の判断を信じてくれるのも分かった。無茶はしないよ",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは頷いて木剣を構えた。"
            },
            {
                id: "s04_insight_twin",
                t: "俺を信じるなら、こっちもランちゃんの見立てを頼りにするぜ",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットはヴェインの構えを確かめた。"
            },
            {
                id: "s04_insight_glass",
                t: "心配してくれるのは嬉しい。でも調子の良し悪しは俺にも判断させてくれ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは一度考え、了承するように頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s04_guess_w1",
                t: "そんなに俺が信用ならないか？　ちゃんと自分の調子くらい分かるぜ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは一瞬、返事に詰まった。"
            },
            {
                id: "s04_guess_w12",
                t: "俺の判断を疑うなら、はっきり言ってくれよ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W12",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは慌てて首を横に振った。"
            }
        ],
        afterStory: "木剣が打ち合わされる。ランスロットは途中で構えを解き、ヴェインの足運びを一度確かめてから再開した。ヴェインは休憩中、以前と同じ記号へ印をつけた。",
        nextHook: "訓練を終えたあと、ランスロットは武器庫であの日の出来事を口にした。"
    },
    {
        id: 5,
        q: "「あの日、俺がもう少し早く気づいていれば……。お前を[[W6|守れ]]なかった。お前は俺にとって[[W5]]なのに。」",
        vaneThought: "二つとも初めてだ。ランちゃんは何か言い切って、少しだけ口を閉じた。",
        words: [
            { key: "W5", type: "new" },
            { key: "W6", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "俺が飛び出したんだ。そこまで自分のせいにすんなよ",
                v: 20,
                axis: "self",
                reaction: "ランスロットは磨いていた剣をゆっくり置いた。"
            },
            {
                t: "次からは二人で周りを見る。それじゃ駄目か？",
                v: 15,
                axis: "act",
                reaction: "ランスロットは顔を上げ、ヴェインを見た。"
            },
            {
                t: "……なあ、まだ引っかかってることがあるんだろ？",
                v: 15,
                axis: "listen",
                reaction: "ランスロットは答える代わりに布を折り畳んだ。"
            }
        ],
        insightOpts: [
            {
                id: "s05_insight_glass",
                t: "俺のことが大切だからって、何もかもランちゃんのせいにすんなよ",
                v: 20,
                axis: "self",
                reaction: "ランスロットは布を置き、正面からヴェインを見た。"
            }
        ],
        misreadOpts: [
            {
                id: "s05_guess_w5",
                t: "俺が弱点だって？　……それなら、もっと強くなるしかないな",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                reaction: "ランスロットは驚いて手を止めた。"
            }
        ],
        afterStory: "手入れの終わった剣が棚へ戻される。ランスロットは布を畳むのに妙に時間をかけた。ヴェインは新しい二つの音を別々に書き留めた。",
        nextHook: "昼には、いつもの仲間たちが二人を待っていた。"
    },
    {
        id: 6,
        q: "「昔から変わらないな。お前は俺の[[W4]]だ。それだけは、この呪いがあっても変わらない。」",
        vaneThought: "前後は分かるのに、一番肝心な呼び方だけ抜けてる。……困ったな。",
        words: [
            { key: "W4", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "ははっ、俺たち昔から張り合ってばっかだもんな",
                v: 20,
                axis: "act",
                reaction: "ランスロットは珍しく声を立てて笑った。"
            },
            {
                t: "何か引っかかるなら遠慮なく言ってくれよ",
                v: 20,
                axis: "self",
                reaction: "ランスロットは真面目な顔で頷いた。"
            },
            {
                t: "……今日、急にそんな話したのは何でだ？",
                v: 10,
                axis: "listen",
                reaction: "ランスロットは少し首を傾げ、言葉を探した。"
            }
        ],
        insightOpts: [
            {
                id: "s06_insight_resonance",
                t: "親友だって、今さら言い直すなよ。……でも嬉しいぜ",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは小さく目を細めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s06_guess_w4",
                t: "ライバルって言うなら、次の勝負は負けないからな！",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W4",
                    guesses: ["ライバル", "競争相手"]
                },
                misreadImpact: true,
                reaction: "ランスロットは少し困ったように微笑んだ。"
            }
        ],
        afterStory: "誰かが昔の失敗談を持ち出し、二人とも声を上げて笑った。ランスロットの話していた一語だけは、笑い声の後にも記号のまま残った。",
        nextHook: "翌日、二人は物資の買い出しを任される。"
    },
    {
        id: 7,
        q: "「あの店、まだあったんだな。こうして[[W2]]に歩くのも久しぶりだ。……また来よう。そう[[W14]]してくれるか？」",
        vaneThought: "甲板で聞いた音がまた出た。後ろの音も気になるけど、今は荷物を落としそうだ。",
        words: [
            { key: "W2", type: "repeat2" },
            { key: "W14", type: "new" }
        ],
        resolveChecks: ["W1", "W2"],
        importantChoice: "light",
        opts: [
            {
                t: "いいぜ。次は荷物なしで来ような！",
                v: 25,
                axis: "act",
                reaction: "ランスロットはヴェインの荷物を一つ受け取った。"
            },
            {
                t: "ただ、次の休みは俺の方にも予定があるかもな",
                v: 15,
                axis: "self",
                reaction: "ランスロットは日取りを聞き直してきた。"
            },
            {
                t: "お、どの店が気になった？　聞かせてくれよ",
                v: 10,
                axis: "listen",
                reaction: "ランスロットは通りの奥を指さした。"
            }
        ],
        insightOpts: [
            {
                id: "s07_insight_twin",
                t: "一緒に来るって約束なら、何回でもするぜ",
                v: 20,
                axis: "act",
                reaction: "ランスロットは店の並ぶ通りを振り返った。"
            }
        ],
        misreadOpts: [
            {
                id: "s07_guess_w14",
                t: "次来るか、今ここで確認しておきたいのか？　予定表見る？",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                reaction: "ランスロットは首を傾げた。"
            }
        ],
        afterStory: "買い物を終え、二人は通りを少し遠回りした。店先では新しい商品が並んでいる。ヴェインは荷物の持ち手を直しながら、同じ音が二度出たことを思い返した。",
        nextHook: "その夜、ヴェインは厨房で夜食を作ることにした。"
    },
    {
        id: 8,
        q: "「この料理、お前が作ったのか。……[[W3]]。俺も、もっとお前を[[W13|頼っ]]ていいのかもしれないな。」",
        vaneThought: "前に聞いた短い音だ。もう一つは初めて。表情だけじゃ細かい意味までは分からない。",
        words: [
            { key: "W3", type: "repeat2" },
            { key: "W13", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3"],
        importantChoice: false,
        opts: [
            {
                t: "遠慮すんなって。二人分作る方が楽しいしな",
                v: 25,
                axis: "act",
                reaction: "ランスロットは皿に手を伸ばした。"
            },
            {
                t: "味の感想は正直に頼むぜ。次は改良したいからさ",
                v: 20,
                axis: "self",
                reaction: "ランスロットは一口食べてから丁寧に感想を話した。"
            },
            {
                t: "……何か、言いづらいことでもあるのか？",
                v: 10,
                axis: "listen",
                reaction: "ランスロットはスプーンを置き、少しだけ視線を上げた。"
            }
        ],
        insightOpts: [
            {
                id: "s08_insight_twin",
                t: "礼なら、今度ランちゃんの方から俺を頼ってくれればいいよ",
                v: 20,
                axis: "act",
                reaction: "ランスロットは皿を持つ手を止め、頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s08_guess_w13",
                t: "俺を褒めたいって？　じゃあ料理の腕前を褒めてくれよ！",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["褒める"]
                },
                misreadImpact: true,
                reaction: "ランスロットは一瞬だけ言葉に詰まった。"
            }
        ],
        afterStory: "ランスロットは料理を口に運んでから、少しだけ考え込んだ。ヴェインは感想を待ったが、返ってきた言葉にも記号が混じった。",
        nextHook: "数日後、二人は短い巡回任務へ復帰する。"
    },
    {
        id: 9,
        q: "「無茶をするなと言っただろう！　……お前は俺にとって[[W5]]なんだ。お前を[[W8|失い]]たくない。」",
        vaneThought: "声が大きい。……なのに、最後の方だけ妙にかすれた。",
        words: [
            { key: "W5", type: "repeat2" },
            { key: "W8", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W5"],
        importantChoice: "important",
        opts: [
            {
                id: "s09_unknown",
                t: "次からは背中を預ける。勝手に突っ込まない",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは包帯の端を押さえたまま、短く頷いた。"
            },
            {
                id: "s09_misread",
                t: "怒るのは分かる。でも、俺がどう動くかも聞いてくれ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはヴェインの腕から目を上げた。"
            },
            {
                id: "s09_understood",
                t: "……ランちゃん。怪我の他に、何か言いたいことがあるか？",
                v: 10,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは口を開きかけ、首を横に振った。"
            }
        ],
        insightOpts: [
            {
                id: "s09_insight_resonance",
                t: "大切に思ってくれてるんだな。失うのが嫌なくらい。……だからこそ無茶しない",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはようやく包帯から手を離した。"
            },
            {
                id: "s09_insight_twin",
                t: "ランちゃんが俺を大事に思うように、俺もランちゃんを大事に思ってる。二人で気をつけよう",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは少しだけ息を緩めた。"
            },
            {
                id: "s09_insight_glass",
                t: "その気持ちは受け取る。でも俺に危険があるたび一人で決められたら困る",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは少し考え、ゆっくり頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s09_guess_w8",
                t: "俺を傷つけたくないってことなら、そんな顔すんなよ。これくらい平気だ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは何か言い返しかけ、口を閉じた。"
            },
            {
                id: "s09_guess_w5",
                t: "俺がランちゃんの弱点になってるなら、もっと鍛えるよ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは包帯を巻く手を止めた。"
            }
        ],
        afterStory: "包帯が巻き終わると、ランスロットは端をもう一度押さえた。ヴェインが動こうとすると手が止まる。帰路では二人の歩幅が何度かずれ、そのたびにどちらかが立ち止まった。",
        nextHook: "その夜から、ランスロットの言葉数が少しずつ減り始めた。"
    },

    // =========================================================
    // 第3章　静かになる声
    // =========================================================
    {
        id: 10,
        q: "「本当はもっとちゃんと[[W15|伝え]]たい。お前を[[W12|信じ]]ている。……さっきのことは[[W7|忘れ]]てくれ。」",
        vaneThought: "何度か出た音が重なった。いくつか分かりかけても、今の文全体は別問題だ。",
        words: [
            { key: "W15", type: "repeat2" },
            { key: "W12", type: "repeat2" },
            { key: "W7", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W5", "W12", "W15"],
        importantChoice: false,
        opts: [
            {
                t: "続きがあるなら、途中で遮らないから話してくれ",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは閉じた資料へ視線を落とした。"
            },
            {
                t: "俺に関わる話なら、俺の意見も聞いてほしい",
                v: 25,
                axis: "self",
                reaction: "ランスロットは資料を持つ手に力を込めた。"
            },
            {
                t: "今すぐ言えないなら、後で二人で話そうぜ",
                v: 5,
                axis: "act",
                reaction: "ランスロットは小さく頷き、資料を戻した。"
            }
        ],
        insightOpts: [
            {
                id: "s10_insight_resonance",
                t: "信じてくれるなら、忘れろって言われても無理だよ。続きがあるなら聞く",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは閉じた資料に指先を置いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s10_guess_w7",
                t: "さっきのことを許してほしいのか？　何をしたっていうんだよ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                reaction: "ランスロットは目を伏せた。"
            }
        ],
        afterStory: "ランスロットは資料の頁をめくりかけ、途中で閉じた。言葉の意味を確かめたくても、次の一文は出てこない。ヴェインはその場では問いを重ねなかった。",
        nextHook: "翌朝、その違和感は確信に変わる。"
    },
    {
        id: 11,
        q: "「お前は俺の[[W4]]だ。だから[[W6|守り]]たい。……なのに、話すことさえ[[W9|怖]]いんだ。」",
        vaneThought: "言葉の途中で少し間が空いた。俺が何か言うと、また止まっちまうかな。",
        words: [
            { key: "W4", type: "repeat2" },
            { key: "W6", type: "repeat2" },
            { key: "W9", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W4", "W5", "W6", "W12", "W15"],
        importantChoice: false,
        opts: [
            {
                t: "そんなに言いにくいなら、一回休憩しようぜ",
                v: 20,
                axis: "act",
                reaction: "ランスロットは木剣を下ろした。"
            },
            {
                t: "無理に聞き出さない。でも、俺を避ける理由は教えてほしい",
                v: 25,
                axis: "self",
                reaction: "ランスロットは返事を探すように眉を寄せた。"
            },
            {
                t: "……話し始めるまで、ここにいるよ",
                v: 10,
                axis: "listen",
                reaction: "ランスロットはヴェインの方を向き直った。"
            }
        ],
        insightOpts: [
            {
                id: "s11_insight_resonance",
                t: "守りたいと思うのに、話すのが怖いのか。……それでも俺は聞きたい",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは一度目を伏せ、顔を上げた。"
            }
        ],
        misreadOpts: [
            {
                id: "s11_guess_w9",
                t: "俺と話すのが嫌なら、無理して付き合わなくていいぞ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W9",
                    guesses: ["嫌だ"]
                },
                misreadImpact: true,
                reaction: "ランスロットは驚いたように顔を上げた。"
            }
        ],
        afterStory: "訓練を終えると、ランスロットは木剣を棚へ戻した。普通の連絡事項にはすぐ返事をするのに、ヴェインがさっきの話に戻そうとすると言葉が短くなった。",
        nextHook: "そんな中、ヴェインに新しい任務が入る。"
    },
    {
        id: 12,
        q: "「……まだ[[W1|心配]]なんだ。必ず帰ってくると[[W14]]してくれ。俺は[[W10]]待っている。」",
        vaneThought: "最初の頃の音まで出てきた。新しい方はまだ何の見当もつかない。",
        words: [
            { key: "W1", type: "repeat3" },
            { key: "W14", type: "repeat2" },
            { key: "W10", type: "new" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W12",
            "W14",
            "W15"
        ],
        importantChoice: "important",
        opts: [
            {
                id: "s12_unknown",
                t: "分かった。俺が戻るまで、こっちのこと頼んだぜ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは荷物の留め具を確かめた。"
            },
            {
                id: "s12_misread",
                t: "時間が読めない任務だ。そこだけは約束できない",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは唇を引き結び、頷いた。"
            },
            {
                id: "s12_understood",
                t: "……何かまだ言いたそうだな。聞いてから出るよ",
                v: 10,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは少し口を開いたが、言葉は続かなかった。"
            }
        ],
        insightOpts: [
            {
                id: "s12_insight_resonance",
                t: "心配してるのは分かった。約束するよ。ずっと待たせるつもりもない",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは荷物から視線を上げた。"
            },
            {
                id: "s12_insight_twin",
                t: "約束する。俺が帰ってきたら、ランちゃんも帰ってこいよ",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは短く、しかしはっきりと頷いた。"
            },
            {
                id: "s12_insight_glass",
                t: "約束はする。でも危険なら予定を変える。その判断も俺に任せてくれるか",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは考えたあと、頷いて道を開けた。"
            }
        ],
        misreadOpts: [
            {
                id: "s12_guess_w10",
                t: "今日だけ待ってるって？　任務は明日になるかもしれないぜ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは何か言いかけて、首を振った。"
            },
            {
                id: "s12_guess_w14",
                t: "帰還予定の確認なら、隊の方にも出してあるぜ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットはヴェインをじっと見つめた。"
            }
        ],
        afterStory: "ヴェインは荷物を肩に掛けた。ランスロットは留め具を見て、何かを言い足しかけたが、出発の鐘が鳴った。ヴェインは振り返って手を上げ、格納庫を後にした。",
        nextHook: "任務先で、その嫌な予感は現実になりかける。"
    },
    {
        id: 13,
        q: "「俺一人で対処できると思った。お前まで巻き込みたくなかった。……もっとお前を[[W13|頼れ]]ばよかった。お前を[[W8|失い]]たくなかったんだ。」",
        vaneThought: "あの厨房の音だ。もう一つも聞いたことがある。でも今は、さっきの行動の方が気になる。",
        words: [
            { key: "W13", type: "repeat2" },
            { key: "W8", type: "repeat2" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: "important",
        opts: [
            {
                id: "s13_unknown",
                t: "次は二人で確認してから動こう。勝手に先行すんなよ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火の向こうでヴェインの方へ体を向けた。"
            },
            {
                id: "s13_misread",
                t: "俺を巻き込むかどうか、俺の分まで決めないでくれ",
                v: 20,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは拳をほどき、膝へ置いた。"
            },
            {
                id: "s13_understood",
                t: "……どうして一人で行こうと思ったのか、もう少し聞かせて",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは間を置き、途切れ途切れに説明し始めた。"
            }
        ],
        insightOpts: [
            {
                id: "s13_insight_twin",
                t: "俺を頼れなかったからって、一人で背負うなよ。失うのが嫌なのは俺も同じだ",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火の向こうから身を乗り出した。"
            },
            {
                id: "s13_insight_glass",
                t: "失いたくなかったって言うなら、俺の意思も聞くべきだっただろ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは視線を落としたまま頷いた。"
            },
            {
                id: "s13_insight_resonance",
                t: "俺を頼ればよかったって、やっと言ってくれたな。……もう少し聞かせて",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは一度目を閉じ、続きを話し始めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s13_guess_w13",
                t: "もっと俺を叱ればよかったって？　今さら説教なら聞くぜ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは意外そうに瞬きした。"
            },
            {
                id: "s13_guess_w8",
                t: "俺に怪我させたくなかったなら、なおさら一人で行くなよ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火へ視線を落とした。"
            }
        ],
        afterStory: "野営地の火が小さくはぜた。ランスロットは火の向こうへ座り、しばらく言葉を選んでいた。ヴェインはノートを閉じ、相手の話が続くのを待った。",
        nextHook: "帰還後、ランスロットは以前よりさらにヴェインとの会話を避けるようになる。"
    },
    {
        id: 14,
        q: "「……俺のことを[[W7|忘れ]]てくれれば、お前はもう苦しまなくて済む。お前がいなくなることが[[W9|怖]]い。……俺はお前を[[W11|愛して]]いるから。」",
        vaneThought: "最後の音だけ初めて聞いた。声が小さくなって、何度も聞き返したくなった。",
        words: [
            { key: "W7", type: "repeat2" },
            { key: "W9", type: "repeat2" },
            { key: "W11", type: "new" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: "critical",
        opts: [
            {
                id: "s14_unknown",
                t: "答えは今すぐ出せない。でも、話を途中で終わらせるな",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは扉へ向けていた足を止めた。"
            },
            {
                id: "s14_misread",
                t: "俺がどうするかを、ランちゃん一人で決めないでくれ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは目を伏せ、それからこちらを見た。"
            },
            {
                id: "s14_understood",
                t: "一人でどこか行くつもりなら、俺も行くからな",
                v: 25,
                axis: "bond",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは驚いたように振り返った。"
            }
        ],
        insightOpts: [
            {
                id: "s14_insight_glass",
                t: "俺を愛してるなら、忘れろなんて簡単に言うなよ。俺の返事も聞いてくれ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは廊下で足を止めた。"
            },
            {
                id: "s14_insight_twin",
                t: "怖かったんだな。でも、一緒に答えを探す方を選んでくれよ",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは扉へ向けていた手を下ろした。"
            },
            {
                id: "s14_insight_resonance",
                t: "……愛してるって言ったんだよな。俺、聞き間違えたくない。もう一度言って",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは驚いた顔でヴェインを見た。"
            }
        ],
        misreadOpts: [
            {
                id: "s14_guess_w7",
                t: "俺に許してほしいのか？　なら逃げずに何をしたか話してくれ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは苦しそうに口を閉じた。"
            },
            {
                id: "s14_guess_w11",
                t: "俺のこと、そんなに嫌だったのか……？　だったら今まで何で……",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W11",
                    guesses: ["嫌う", "憎む"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットははっとしてヴェインの方へ手を伸ばした。"
            }
        ],
        afterStory: "廊下には二人の足音もない。ランスロットは一度口を開き、何も言わずに扉の方へ目をやった。ヴェインは呼び止めようとして、喉まで出た言葉を飲んだ。",
        nextHook: "翌朝。今度はヴェインの方から、ランスロットを探しに行く。"
    },

    // =========================================================
    // 第4章　声を聴かせて
    // =========================================================
    {
        id: 15,
        q: "「お前は俺にとって[[W5]]だ。だから、俺のことを[[W7|忘れ]]てほしいと思った。……だが、本当は[[W10]]、お前に聞いてほしかった。」",
        vaneThought: "昨日の記号がまた並んだ。口を挟む前に、今日はちゃんと最後まで聞きたい。",
        words: [
            { key: "W5", type: "repeat3" },
            { key: "W7", type: "repeat3" },
            { key: "W10", type: "repeat2" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W10",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: "fixed",
        opts: [
            {
                id: "s15_unknown",
                t: "明日でもいいから、今度は二人で考えようぜ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは甲板の手すりから手を離した。"
            },
            {
                id: "s15_misread",
                t: "俺に何が必要か、俺自身にも言わせてほしい",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはしばらく黙って、ヴェインの次の言葉を待った。"
            },
            {
                id: "s15_understood",
                t: "まだ続きがあるんだろ。俺、ここで聞くから",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは息を整えてから、もう一度口を開いた。"
            }
        ],
        insightOpts: [
            {
                id: "s15_insight_resonance",
                t: "大切だから忘れてほしい、でもずっと聞いてほしかった。……簡単じゃないな",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはしばらく黙り、それから頷いた。"
            },
            {
                id: "s15_insight_twin",
                t: "それなら、これからは二人でどうするか決めようぜ",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは手すりから手を離した。"
            },
            {
                id: "s15_insight_glass",
                t: "俺のためって決めつける前に、俺が何を望むか聞いてくれ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはヴェインの言葉を最後まで聞いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s15_guess_w10",
                t: "今日だけ聞いてほしかったなら、もう間に合わないと思ったのか？",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは何度か瞬きをした。"
            },
            {
                id: "s15_guess_w5",
                t: "俺がランちゃんの弱点だから、距離を取ろうとしたってこと？",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは小さく首を横に振った。"
            }
        ],
        afterStory: "甲板で向き合うと、ランスロットはしばらく手すりを見ていた。やがて顔を上げ、途切れがちな声で話を続けた。ヴェインは途中で遮らなかった。",
        nextHook: "今度は途中で口を閉ざさず、胸の内を最後まで話そうとしている。"
    },
    {
        id: 16,
        q: "「お前は俺の[[W4]]だ。でも、それだけじゃない。お前を[[W8]]のが[[W9]]。だから遠ざけようとした。……それでも、本当は[[W2]]にいたい。」",
        vaneThought: "同じ音が何度も出ると、答えを決めつけたくなる。……今はまだやめとこう。",
        words: [
            { key: "W2", type: "repeat3" },
            { key: "W4", type: "repeat3" },
            { key: "W8", type: "repeat3" },
            { key: "W9", type: "repeat3" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W8",
            "W9",
            "W10",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: "critical",
        opts: [
            {
                id: "s16_unknown",
                t: "全部は追えてないけど、まだ話すんだろ？　聞くよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは言葉を途切れさせずに続けた。"
            },
            {
                id: "s16_misread",
                t: "俺ができることもあるだろ。一人だけで片づけるな",
                v: 25,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは頷き、握っていた手を緩めた。"
            },
            {
                id: "s16_understood",
                t: "ランちゃんの考えは聞いた。次は俺の言い分も聞いてくれ",
                v: 25,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはまっすぐヴェインを見た。"
            }
        ],
        insightOpts: [
            {
                id: "s16_insight_resonance",
                t: "失うのが怖くても、一緒にいたいんだな。……それ、俺も同じだよ",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは答えを探すようにヴェインを見つめた。"
            },
            {
                id: "s16_insight_twin",
                t: "俺を守りたいなら、次は一緒に立とう。俺だって隣にいたい",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは握っていた拳をほどいた。"
            },
            {
                id: "s16_insight_glass",
                t: "怖いのは分かった。でも離れるかどうか、俺の代わりに決めんなよ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはすぐには答えず、やがて静かに頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s16_guess_w8",
                t: "俺を傷つけるのが嫌で離れたなら、俺はそんなに脆くないぞ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは視線を落としてから、口を開いた。"
            },
            {
                id: "s16_guess_w9",
                t: "そんなに苦しいなら、無理して一緒にいなくてもいいんだぞ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W9",
                    guesses: ["苦しい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは強く首を横に振った。"
            }
        ],
        afterStory: "前に聞いた記号が同じ文にいくつも現れた。ヴェインはノートを開きかけ、いったん閉じた。朝の風が二人の間を通り抜ける。",
        nextHook: "まだ輪郭の掴めない音は残っている。それでも、もう会話は止まらない。"
    },
    {
        id: 17,
        q: "「ここまで聞いてくれて[[W3]]。俺はお前を[[W12|信じ]]ている。これからは、お前を[[W13]]。……それから、もう一つ。俺はお前を[[W11|愛して]]いる。」",
        vaneThought: "あの夜の音だ。また同じところで声が一拍止まった。",
        words: [
            { key: "W3", type: "repeat3" },
            { key: "W12", type: "repeat3" },
            { key: "W13", type: "repeat3" },
            { key: "W11", type: "repeat2" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W8",
            "W9",
            "W10",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: "important",
        opts: [
            {
                id: "s17_unknown",
                t: "こういう話、これからも二人でしていこうぜ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは小さく笑い、テーブルに手を置いた。"
            },
            {
                id: "s17_misread",
                t: "今度は俺が話していいか？　黙って聞いててくれよ",
                v: 25,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは椅子を引き、きちんと向き直った。"
            },
            {
                id: "s17_understood",
                t: "……言い終わった？　じゃあ、まだ少しだけ聞いていい？",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは静かに頷いた。"
            }
        ],
        insightOpts: [
            {
                id: "s17_insight_resonance",
                t: "ありがとう。信じてくれて、頼ってくれて……気持ちも言ってくれて",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは目を細め、小さく笑った。"
            },
            {
                id: "s17_insight_twin",
                t: "頼るのはお互い様な。これからは俺だけに仕事押しつけるなよ！",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは珍しく声を立てて笑った。"
            },
            {
                id: "s17_insight_glass",
                t: "……愛してる、か。俺の気持ちもちゃんと聞く覚悟はある？",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは椅子を引き、ヴェインへ向き直った。"
            }
        ],
        misreadOpts: [
            {
                id: "s17_guess_w13",
                t: "これからちゃんと俺を叱るって？　いや、そんなに怒られることしたか？",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは目を丸くし、小さく首を振った。"
            },
            {
                id: "s17_guess_w11",
                t: "そんなに俺を買ってくれてたのか。……ちょっと照れるな",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは返答を探すように唇を開いた。"
            }
        ],
        afterStory: "話す速さが少し落ちた。ランスロットはヴェインの反応を確かめるように一拍置き、それから続きを言う。短い沈黙はあったが、会話は途切れなかった。",
        nextHook: "二人は、呪いを受けた場所へ戻ることを決める。"
    },
    {
        id: 18,
        q: "「今度は俺一人でお前を[[W6]]なんて言わない。[[W10]][[W2]]にいると[[W14]]しよう。……二人で帰るんだ。」",
        vaneThought: "足音が揃ってる。前と何が違うのか、説明しようとすると難しいな。",
        words: [
            { key: "W6", type: "repeat3" },
            { key: "W10", type: "repeat3" },
            { key: "W2", type: "reuse" },
            { key: "W14", type: "repeat3" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W8",
            "W9",
            "W10",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        importantChoice: false,
        opts: [
            {
                t: "ああ、今度は歩幅を合わせて帰ろうぜ",
                v: 30,
                axis: "act",
                reaction: "ランスロットは横に並んで歩き出した。"
            },
            {
                t: "俺が危ないと思ったら、ちゃんと俺にも判断させてくれ",
                v: 25,
                axis: "self",
                reaction: "ランスロットは前を見て、頷いた。"
            },
            {
                t: "……さっきの言葉、戻ったらもう一回聞いていいか？",
                v: 20,
                axis: "listen",
                reaction: "ランスロットは少しだけ笑った。"
            }
        ],
        insightOpts: [
            {
                id: "s18_insight_twin",
                t: "ずっと一緒にいるって約束、守ろうぜ。無理な時はちゃんと言うからさ",
                v: 20,
                axis: "act",
                reaction: "ランスロットはヴェインと歩幅を合わせた。"
            }
        ],
        misreadOpts: [
            {
                id: "s18_guess_w10",
                t: "今日だけ一緒って言い方は寂しいな。また明日も歩こうぜ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                reaction: "ランスロットはヴェインの歩幅を見て、何か考えた。"
            }
        ],
        afterStory: "道が狭まるたび、先を歩くランスロットが速度を落とした。ヴェインが並ぶとまた進む。二人は危険な場所で何度か言葉を交わした。",
        nextHook: "夜が明ける頃、二人は呪いが始まった場所へ辿り着く。"
    },
    {
        id: 19,
        q: "「もう逃げない。ちゃんと[[W15|伝え]]る。お前が[[W5]]だから、お前を[[W8]]のが[[W9]]。それでも俺は、[[W10]][[W2]]にいたい。お前を[[W12|信じ]]て、必要な時にはお前を[[W13]]。これから先もそうすると[[W14]]する。ヴェイン。俺は、お前を[[W11|愛して]]いる。」",
        vaneThought: "ノートの記号が、次から次へと声に混じる。今まで聞いたものだけで、全部繋がるだろうか。",
        words: [
            { key: "W15", type: "repeat3" },
            { key: "W5", type: "reuse" },
            { key: "W8", type: "reuse" },
            { key: "W9", type: "reuse" },
            { key: "W10", type: "reuse" },
            { key: "W2", type: "reuse" },
            { key: "W12", type: "reuse" },
            { key: "W13", type: "reuse" },
            { key: "W14", type: "reuse" },
            { key: "W11", type: "repeat3" }
        ],
        resolveChecks: [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7",
            "W8",
            "W9",
            "W10",
            "W11",
            "W12",
            "W13",
            "W14",
            "W15"
        ],
        finalResolve: {
            key: "W11",
            special: true,
            line: "……聞こえた"
        },
        importantChoice: "final",
        opts: [
            {
                id: "s19_unknown",
                t: "ここまで来たんだ。帰りも二人で帰ろうぜ",
                v: 40,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは剣を収め、隣に立った。"
            },
            {
                id: "s19_misread",
                t: "俺の答えも聞いてくれ。ランちゃんの言葉だけで終わりにはしない",
                v: 35,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは姿勢を正し、ヴェインの方へ向き直った。"
            },
            {
                id: "s19_understood",
                t: "……うん。まだ聞いていたい。続けてくれ",
                v: 35,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは頷き、言葉を続けた。"
            }
        ],
        insightOpts: [
            {
                id: "s19_insight_resonance",
                t: "全部聞こえた。……俺を愛してるんだな。俺も伝えたいことがある",
                v: 20,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは息を止めたように見えた。"
            },
            {
                id: "s19_insight_twin",
                t: "ずっと一緒にいるって約束、俺もする。守るのは二人で、な",
                v: 20,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは一歩近づき、ヴェインの隣へ並んだ。"
            },
            {
                id: "s19_insight_glass",
                t: "気持ちは全部受け取った。でも、これからをどうするかは俺にも決めさせてくれ",
                v: 20,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは目を逸らさず、ヴェインの返事を待った。"
            }
        ],
        misreadOpts: [
            {
                id: "s19_guess_w11",
                t: "そんなに俺を頼もしく思ってたのか？　いや、嬉しいけどさ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは驚いたように目を開いた。"
            },
            {
                id: "s19_guess_w8",
                t: "俺を傷つけるのが嫌だったなら、それは俺に決めさせてほしかった",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは一瞬口を閉じ、それから頷いた。"
            }
        ],
        afterStory: "ランスロットは最後の文を言い終えるまで目を逸らさなかった。ヴェインのノートには、まだ意味を決めきれない音も残っている。それでも返答する時間が来た。",
        nextHook: "二人が選んできた向き合い方の先に、それぞれの未来が続いていく。"
    }
];
