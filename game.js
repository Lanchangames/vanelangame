const scenario = [

    {
        id: 0,
        q: "「ヴェイン、目が覚めたか。……よかった。医者の先生はまだ来ていない。[[W1|心配]]したぞ。」",
        vaneThought: "……ランちゃん、ずいぶん顔色が悪いな。声を聞いた途端、胸のあたりが妙にざわついた。",
        words: [
            { key: "W1", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "……ランちゃん、顔色悪いぞ。俺は平気だから、ちょっと座ってくれよ",
                v: 22,
                axis: "listen",
                reaction: "ランスロットは何か言いかけ、ようやく椅子に腰を下ろした。"
            },
            {
                t: "え、先生まだ来てないの？　じゃあ俺が呼びに行ってくる！",
                v: 3,
                axis: "self",
                reaction: "ランスロットは慌ててヴェインの肩を押さえ、まだ横になっていろと告げた。"
            },
            {
                t: "……今のところ、もう一度言ってくれない？　ランちゃんの声をちゃんと聞いていたいんだ",
                v: 19,
                axis: "act",
                reaction: "ランスロットは短く頷き、ヴェインへ向き直って同じ言葉を静かに繰り返した。"
            }
        ],
        insightOpts: [
            {
                id: "s00_insight_resonance",
                t: "そんなに心配かけたんだな。ごめん、ランちゃん。もう大丈夫だぞ",
                v: 27,
                axis: "listen",
                reaction: "ランスロットは強張っていた肩を落とし、ヴェインの手をそっと握った。"
            }
        ],
        misreadOpts: [
            {
                id: "s00_guess_w1",
                t: "俺のこと、ずっと見張ってたのか？　……そんなに寝相悪かった？",
                v: 7,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["監視する", "見張る"]
                },
                misreadImpact: true,
                reaction: "ランスロットはきょとんとしたあと、何かを否定するように首を振った。"
            }
        ],
        afterStory: "起き上がろうとすると、ランスロットが椅子から腰を浮かせた。悲しそうな顔をしている。俺が魔物に遅れをとったのはランちゃんのせいじゃないのに。",
        nextHook: "魔物に吹きかけられた呪いも、術師に見せればすぐ治る。二人とも、まだそう思っていた。"
    },
    {
        id: 1,
        q: "「検査では異常がないらしい。なら……俺から、お前にちゃんと[[W15|伝え]]られるか試してみたい。」",
        vaneThought: "検査は終わったんだよな。ランちゃんは、まだ何か試したいことがあるらしい。",
        words: [
            { key: "W15", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "……試すって、どんなふうに？　もう少し詳しく聞かせてくれよ",
                v: 26,
                axis: "listen",
                reaction: "ランスロットははっとした顔になり、急がずもう一度話そうとした。"
            },
            {
                t: "検査は終わったんだよな？　なのにまだ何か調べるのか？",
                v: 14,
                axis: "self",
                reaction: "ランスロットは少し迷い、検査の話とは違うのだと伝えようとした。"
            },
            {
                t: "また針を刺す検査だったら嫌だなあ。さっきので十分だぜ！",
                v: 3,
                axis: "act",
                reaction: "ランスロットは苦笑し、違うと首を振った。"
            }
        ],
        insightOpts: [
            {
                id: "s01_insight_twin",
                t: "俺に伝わるか試したいんだな。聞こえたまま話すから、やってみようぜ",
                v: 28,
                axis: "act",
                reaction: "ランスロットは安心したように頷き、言葉を選んでゆっくり口を開いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s01_guess_w15",
                t: "もう一度、俺の身体を確かめるのか？　それなら先生を呼ぶ？",
                v: 5,
                axis: "act",
                trigger: {
                    key: "W15",
                    guesses: ["確かめる"]
                },
                misreadImpact: true,
                reaction: "ランスロットは少し困った顔で首を振り、別のことを話そうとした。"
            }
        ],
        afterStory: "医師の質問には違和感がない。ランスロットが同じように短い文を話すと、一部分だけが別の音になる。ヴェインは紙を借り、聞こえたとおりの形を書いた。",
        nextHook: "同じ音がもう一度出てくれば、何か分かるかもしれない。"
    },
    {
        id: 2,
        q: "「食欲が戻ったようで安心した。……あの時、お前が俺をかばってくれたこと、まだ言えてなかった。[[W3]]、ヴェイン。」",
        vaneThought: "あのときのこと、まだ気にしてたんだな。……ランちゃん、何だか緊張した顔をしてる。",
        words: [
            { key: "W3", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "……最後の言葉、もう一回言ってくれない？　ちゃんと聞いておきたいんだ",
                v: 26,
                axis: "act",
                reaction: "ランスロットは驚いたように瞬きし、あらためて口を開いた。"
            },
            {
                t: "あのときは俺が勝手に飛び出したんだ。ランちゃんが責任感じることないよ",
                v: 22,
                axis: "self",
                reaction: "ランスロットは俯いていた顔を上げ、ヴェインをじっと見た。"
            },
            {
                t: "そうだ、退院したら特盛の肉料理食べようぜ！　絶対うまいぞ！",
                v: 4,
                axis: "listen",
                reaction: "ランスロットは一瞬話についていけず、手元の皿へ目を落とした。"
            }
        ],
        insightOpts: [
            {
                id: "s02_insight_resonance",
                t: "そんな改まるなって。俺もランちゃんが無事で本当によかったんだから",
                v: 29,
                axis: "listen",
                reaction: "ランスロットは目を細め、ようやく張り詰めた表情をほどいた。"
            }
        ],
        misreadOpts: [
            {
                id: "s02_guess_w3",
                t: "何か嬉しいことがあったのか？　へへ、俺にも教えてくれよ",
                v: 7,
                axis: "listen",
                trigger: {
                    key: "W3",
                    guesses: ["嬉しい", "喜ぶ"]
                },
                misreadImpact: true,
                reaction: "ランスロットは不思議そうに首を傾げ、ヴェインの手元を見た。"
            }
        ],
        afterStory: "食堂はいつもの賑わいだった。皿が置かれる音、仲間の笑い声、料理の匂い。ランスロットはヴェインの返事を聞いてから食事を再開した。",
        nextHook: "ノートには、これで三つの言葉が並んだ。まだ先は長い。"
    },
    {
        id: 3,
        q: "「体調が戻ったら、また[[W2]]に訓練をしよう。……それから、食事にも行こう。」",
        vaneThought: "また訓練ができる日が近づいてる。そう思うと、身体がうずうずするな。",
        words: [
            { key: "W2", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "訓練か！　早く戻りたいけど、まずは体力をつけ直さないとな",
                v: 23,
                axis: "act",
                reaction: "ランスロットは無理のないところから始めようと頷いた。"
            },
            {
                t: "訓練の話、もう少し聞かせてくれる？　予定も考えておきたいしさ",
                v: 19,
                axis: "self",
                reaction: "ランスロットは訓練の話を続け、具体的な予定を一緒に考えてくれた。"
            },
            {
                t: "飯は俺が全部作る！　ランちゃんは一人で訓練してていいぞ！",
                v: 3,
                axis: "listen",
                reaction: "ランスロットは一瞬口を開き、何となく噛み合っていないことに気づいた。"
            }
        ],
        insightOpts: [
            {
                id: "s03_insight_twin",
                t: "また一緒に訓練できるの、俺も楽しみだ！　終わったら飯に行こうな",
                v: 28,
                axis: "act",
                reaction: "ランスロットは嬉しそうに頷き、復帰後の訓練日を考え始めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s03_guess_w2",
                t: "静かな場所で訓練したいのか？　だったら森の外れとかどうだ？",
                v: 6,
                axis: "self",
                trigger: {
                    key: "W2",
                    guesses: ["静か"]
                },
                misreadImpact: true,
                reaction: "ランスロットは面食らったように瞬きし、訓練場所の話ではないと説明しようとした。"
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
        vaneThought: "木剣を握るランちゃんの手が、いつもより固い。そんなに俺が心許ないかな。",
        words: [
            { key: "W1", type: "repeat2" },
            { key: "W12", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: "light",
        opts: [
            {
                id: "s04_unknown",
                t: "……まだ不安そうだな。きつくなったら、ちゃんと自分から言うよ",
                v: 25,
                axis: "daily",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはヴェインの顔色を確かめてから、木剣を持ち直した。"
            },
            {
                id: "s04_misread",
                t: "まず一本だけ合わせようぜ。危ないと思ったら止めてくれよ",
                v: 22,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは頷き、間合いを測るように構えた。"
            },
            {
                id: "s04_understood",
                t: "はいはい、隊長さんの小言はそこまで！　さっさと始めようぜ",
                v: 3,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは悲しげに眉を寄せ、すぐには構えなかった。"
            }
        ],
        insightOpts: [
            {
                id: "s04_insight_resonance",
                t: "心配してくれて、俺の判断も信じてくれるんだな。ありがと、ランちゃん",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはほっとしたように微笑み、訓練の準備を始めた。"
            },
            {
                id: "s04_insight_twin",
                t: "俺を信じてくれるなら、俺もランちゃんの見立てを頼りにするよ。二人でやろう",
                v: 29,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは力強く頷き、互いの立ち位置を確かめた。"
            },
            {
                id: "s04_insight_glass",
                t: "心配なのは嬉しい。でも、自分の体調は俺にも決めさせてくれよ",
                v: 27,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは少し考えたあと、ヴェインの考えを受け入れた。"
            }
        ],
        misreadOpts: [
            {
                id: "s04_guess_w1",
                t: "……そんなに俺が信用ならない？　勝手に無茶しないって言ってるだろ",
                v: 7,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは驚き、言いかけた言葉を飲み込んだ。"
            },
            {
                id: "s04_guess_w12",
                t: "俺の判断を疑ってるってこと？　なら、どこが駄目なのかちゃんと言ってくれ",
                v: 8,
                axis: "listen",
                trigger: {
                    key: "W12",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは慌てて首を振り、声を落として何かを言い直した。"
            }
        ],
        afterStory: "木剣が打ち合わされる。ランスロットは途中で構えを解き、ヴェインの足運びを一度確かめてから再開した。ヴェインは休憩中、以前と同じ記号へ印をつけた。",
        nextHook: "訓練を終えたあと、ランスロットは武器庫であの日の出来事を口にした。"
    },
    {
        id: 5,
        q: "「あの日、俺がもう少し早く気づいていれば……。お前を[[W6|守れ]]なかった。お前は俺にとって[[W5]]なのに。」",
        vaneThought: "あの日の話になると、ランちゃんはどうしても自分を責める。どうしたら顔を上げてくれるんだろう。",
        words: [
            { key: "W5", type: "new" },
            { key: "W6", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "……まだあの日のこと、考えてたんだな。俺は今、ちゃんとここにいるよ",
                v: 26,
                axis: "self",
                reaction: "ランスロットは磨いていた剣を置き、ヴェインの顔を見た。"
            },
            {
                t: "次は俺も周りに気をつける。ランちゃんだけで背負うなよ",
                v: 25,
                axis: "act",
                reaction: "ランスロットは少し考え、折り畳んだ布を机へ置いた。"
            },
            {
                t: "そういえばその剣、刃こぼれ直った？　あとで見せてくれよ！",
                v: 2,
                axis: "listen",
                reaction: "ランスロットは手を止めた。話が伝わらなかったらしい。"
            }
        ],
        insightOpts: [
            {
                id: "s05_insight_glass",
                t: "守れなかったって責めるなよ。大切に思ってくれるなら、ランちゃんも自分を責めないで",
                v: 30,
                axis: "self",
                reaction: "ランスロットは目を伏せ、長く息を吐いてからヴェインへ向き直った。"
            }
        ],
        misreadOpts: [
            {
                id: "s05_guess_w5",
                t: "俺が足手まといだったって？　……もっと強くならなきゃな",
                v: 5,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                reaction: "ランスロットは驚いて顔を上げ、違うと言いかけた。"
            }
        ],
        afterStory: "手入れの終わった剣が棚へ戻される。ランスロットは布を畳むのに妙に時間をかけた。ヴェインは、あの出来事について口にされた二つの言葉をノートに並べて記した。",
        nextHook: "昼には、いつもの仲間たちが二人を待っていた。"
    },
    {
        id: 6,
        q: "「昔から変わらないな。お前は俺の[[W4]]だ。それだけは、この呪いがあっても変わらない。」",
        vaneThought: "昔の話をするランちゃんの声は、少しだけ柔らかくなる。……その声、やっぱり好きだな。",
        words: [
            { key: "W4", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "そうだな。昔の俺たちのことは、呪いなんかで変わらないよな",
                v: 24,
                axis: "act",
                reaction: "ランスロットは静かに頷き、昔を懐かしむように笑った。"
            },
            {
                t: "……今の呼び方、もう一回聞かせて？　ちゃんと覚えておきたいんだ",
                v: 26,
                axis: "self",
                reaction: "ランスロットは少し照れたように、同じ言葉をもう一度繰り返した。"
            },
            {
                t: "何だよ、俺の身長が変わらないって？　まだ伸びるかもしれないだろ！",
                v: 3,
                axis: "listen",
                reaction: "ランスロットは驚いたように目を丸くし、すぐには返事ができなかった。"
            }
        ],
        insightOpts: [
            {
                id: "s06_insight_resonance",
                t: "親友だなんて、今さら言わなくても分かってるよ。でも嬉しいな",
                v: 29,
                axis: "listen",
                reaction: "ランスロットは照れくさそうに目を細めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s06_guess_w4",
                t: "ライバルってことだろ？　よーし、次の勝負も負けないからな！",
                v: 9,
                axis: "act",
                trigger: {
                    key: "W4",
                    guesses: ["ライバル", "競争相手"]
                },
                misreadImpact: true,
                reaction: "ランスロットは困ったように笑い、ヴェインの勢いを受け止めた。"
            }
        ],
        afterStory: "誰かが昔の失敗談を持ち出し、二人とも声を上げて笑った。ヴェインはランスロットの使った呼び方をノートへ書き留め、あとでまた確かめようと思った。",
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
                t: "また来ようぜ！　次は荷物を持たずに、ゆっくり歩きたいな",
                v: 24,
                axis: "act",
                reaction: "ランスロットは嬉しそうに頷き、ヴェインの荷物を一つ引き受けた。"
            },
            {
                t: "次の休みはいつだったかな？　帰ったら予定を確かめておくよ",
                v: 21,
                axis: "self",
                reaction: "ランスロットは頷き、二人で予定を合わせるつもりらしかった。"
            },
            {
                t: "あの店、焼き魚も売ってるかな？　今すぐ戻って見に行こうぜ！",
                v: 4,
                axis: "listen",
                reaction: "ランスロットは少し笑ったが、今の話とは違うと小さく首を振った。"
            }
        ],
        insightOpts: [
            {
                id: "s07_insight_twin",
                t: "一緒に来る約束だな。もちろん！　次は俺が店を選んでもいい？",
                v: 30,
                axis: "act",
                reaction: "ランスロットは頷き、どこへ行こうかと楽しそうに話し始めた。"
            }
        ],
        misreadOpts: [
            {
                id: "s07_guess_w14",
                t: "予定を確認しておけばいいのか？　じゃあ、今ここで手帳を開こうか",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                reaction: "ランスロットは戸惑った表情になり、手帳ではない何かを言い直そうとした。"
            }
        ],
        afterStory: "買い物を終え、二人は通りを少し遠回りした。店先では新しい商品が並んでいる。ヴェインは荷物の持ち手を直しながら、同じ音が二度出たことを思い返した。",
        nextHook: "その夜、ヴェインは厨房で夜食を作ることにした。"
    },
    {
        id: 8,
        q: "「この料理、お前が作ったのか。……[[W3]]。俺も、もっとお前を[[W13|頼っ]]ていいのかもしれないな。」",
        vaneThought: "いつもより穏やかな声だ。でも、ランちゃんはまだ何かを考えているように見えた。",
        words: [
            { key: "W3", type: "repeat2" },
            { key: "W13", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3"],
        importantChoice: false,
        opts: [
            {
                t: "へへ、口に合ったなら嬉しいな。おかわりもあるぞ！",
                v: 23,
                axis: "act",
                reaction: "ランスロットはヴェインを見て笑い、料理をもう一口食べた。"
            },
            {
                t: "……なんか言いたいことがありそうだな。よかったら聞かせてよ",
                v: 27,
                axis: "self",
                reaction: "ランスロットはスプーンを置き、少しずつ言葉を探し始めた。"
            },
            {
                t: "えっ、俺の分のプリンまで食べるつもり？　それは駄目だぜ！",
                v: 3,
                axis: "listen",
                reaction: "ランスロットは戸惑い、目の前の料理を見つめ直した。"
            }
        ],
        insightOpts: [
            {
                id: "s08_insight_twin",
                t: "礼なんていいって。……それより、これからはもっと俺を頼ってくれよ",
                v: 30,
                axis: "act",
                reaction: "ランスロットはスプーンを置き、照れくさそうに頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s08_guess_w13",
                t: "褒めてくれるのか？　だったら料理の感想はたっぷり聞きたいな！",
                v: 7,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["褒める"]
                },
                misreadImpact: true,
                reaction: "ランスロットは瞬きし、何と言えばよいのか迷っていた。"
            }
        ],
        afterStory: "ランスロットは料理を口に運んでから、少しだけ考え込んだ。ヴェインは感想を待ちつつ、今かけられた言葉をもう一度思い返した。",
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
                t: "……ごめん、無茶した。次からは先に合図する。二人で動こう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは包帯を押さえたまま、ゆっくり頷いた。"
            },
            {
                id: "s09_misread",
                t: "怒るのは分かる。でも、俺がどう動くかも一緒に考えてほしい",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはヴェインの腕から視線を上げ、最後まで話を聞いた。"
            },
            {
                id: "s09_understood",
                t: "これくらいかすり傷だって！　大げさだなあ。もう飯にしようぜ！",
                v: 3,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは包帯を巻く手を止め、苦しそうに唇を結んだ。"
            }
        ],
        insightOpts: [
            {
                id: "s09_insight_resonance",
                t: "俺を失うのが怖いくらい、大切に思ってくれてるんだな。……もう無茶しないよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは包帯から手を離し、ようやく息を吐いた。"
            },
            {
                id: "s09_insight_twin",
                t: "俺もランちゃんが大切だよ。だから、次は背中を預け合おうぜ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは静かに頷き、ヴェインの手へ自分の手を添えた。"
            },
            {
                id: "s09_insight_glass",
                t: "その気持ちは嬉しい。でも俺の危険を俺抜きで決めるのはやめてくれよ",
                v: 28,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは反論しかけたが、やがて小さく頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s09_guess_w8",
                t: "俺を傷つけたくないってこと？　ランちゃんが責任感じる必要はないんだよ",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは何か言おうとしたが、途中で口を閉じた。"
            },
            {
                id: "s09_guess_w5",
                t: "俺が弱点になってるなら、もっと強くなってみせるからな",
                v: 6,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは驚き、包帯を巻く手を止めた。"
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
        vaneThought: "ランちゃん、どうしてそんなに苦しそうなんだろう。手元の資料を見つめたまま、俺と目を合わせてくれない。",
        words: [
            { key: "W15", type: "repeat2" },
            { key: "W12", type: "repeat2" },
            { key: "W7", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W5", "W12", "W15"],
        importantChoice: false,
        opts: [
            {
                t: "……さっきのことって、どこからの話？　もう少し聞かせてよ",
                v: 26,
                axis: "listen",
                reaction: "ランスロットは顔を上げたが、言い直しかけてまた黙った。"
            },
            {
                t: "全部は分からないけど、俺に関わる話なら俺の意見も聞いてほしい",
                v: 24,
                axis: "self",
                reaction: "ランスロットは閉じた資料を握り締め、ヴェインを見つめた。"
            },
            {
                t: "ああ、もう終わった話ならいいや。俺も仕事に戻るぜ",
                v: 3,
                axis: "act",
                reaction: "ランスロットは驚いたように口を開き、結局何も言えなかった。"
            }
        ],
        insightOpts: [
            {
                id: "s10_insight_resonance",
                t: "信じてくれてるんだな。……でも、忘れてくれって言われても簡単にはできないよ",
                v: 30,
                axis: "listen",
                reaction: "ランスロットは閉じた資料に手を置き、苦しそうに息を吐いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s10_guess_w7",
                t: "俺に許してほしいことがあるのか？　だったら、何があったか話してくれよ",
                v: 9,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                reaction: "ランスロットは目を伏せ、答え方を探しているようだった。"
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
                t: "……声が震えてるぞ。急がなくていいから、ゆっくり話してくれる？",
                v: 28,
                axis: "act",
                reaction: "ランスロットは木剣を下ろし、少し落ち着いたように息をついた。"
            },
            {
                t: "無理に聞き出さない。でも、避けられるのは俺だってつらいよ",
                v: 25,
                axis: "self",
                reaction: "ランスロットは目を伏せ、ヴェインの言葉を噛みしめた。"
            },
            {
                t: "暗い顔で稽古してたら勝てないぜ！　よーし、今すぐ一本勝負だ！",
                v: 3,
                axis: "listen",
                reaction: "ランスロットは動かなかった。今は剣を振る気分ではないらしい。"
            }
        ],
        insightOpts: [
            {
                id: "s11_insight_resonance",
                t: "守りたいのに、話すのが怖いんだな。……それでも俺は聞きたいよ",
                v: 30,
                axis: "listen",
                reaction: "ランスロットはゆっくり顔を上げ、もう一度話そうとした。"
            }
        ],
        misreadOpts: [
            {
                id: "s11_guess_w9",
                t: "俺と話すのが嫌なのか？　……そうなら、無理して付き合わなくていいよ",
                v: 5,
                axis: "self",
                trigger: {
                    key: "W9",
                    guesses: ["嫌だ"]
                },
                misreadImpact: true,
                reaction: "ランスロットははっとして顔を上げ、強く首を横に振った。"
            }
        ],
        afterStory: "訓練を終えると、ランスロットは木剣を棚へ戻した。普通の連絡事項にはすぐ返事をするのに、ヴェインがさっきの話に戻そうとすると言葉が短くなった。",
        nextHook: "そんな中、ヴェインに新しい任務が入る。"
    },
    {
        id: 12,
        q: "「……まだ[[W1|心配]]なんだ。必ず帰ってくると[[W14]]してくれ。俺は[[W10]]待っている。」",
        vaneThought: "出発前にそんな顔をされたら、こっちだって不安になるよ。……でも、必ず戻らなくちゃ。",
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
                t: "必ず帰るよ。戻ったら一番にランちゃんに知らせるから",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは荷物の留め具に触れた手を止め、頷いた。"
            },
            {
                id: "s12_misread",
                t: "予定がずれるかもしれない。でも無事に戻ることだけは譲らないよ",
                v: 27,
                axis: "act",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは少し考え、ヴェインの言葉を受け止めた。"
            },
            {
                id: "s12_understood",
                t: "帰ったら俺が夜食作るぜ！　今夜の献立は任せてくれよ",
                v: 4,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは戸惑い、出発の支度を続けながら黙り込んだ。"
            }
        ],
        insightOpts: [
            {
                id: "s12_insight_resonance",
                t: "心配してるんだな。分かった、約束する。ずっと待たせないように帰ってくるよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはヴェインの目を見て、ほっとしたように頷いた。"
            },
            {
                id: "s12_insight_twin",
                t: "帰るって約束する。ランちゃんも一人で無茶せず、俺を待っててな",
                v: 29,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットははっきりと頷き、ヴェインの肩へ手を置いた。"
            },
            {
                id: "s12_insight_glass",
                t: "約束する。でも現場で危険なら、予定を変える判断は俺にもさせてくれよ",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは少し考え、静かに道を開けた。"
            }
        ],
        misreadOpts: [
            {
                id: "s12_guess_w10",
                t: "今日だけ待ってるって？　任務、今日中には終わらないかもしれないぞ",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは困った顔になり、何かを言い直そうとした。"
            },
            {
                id: "s12_guess_w14",
                t: "帰還予定の確認なら、隊の方にも出してあるぞ。心配なら見てくれよ",
                v: 8,
                axis: "act",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは資料へ目をやったあと、違うと首を振った。"
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
                t: "一人で行ったのは怒ってる。次は作戦を二人で決めようよ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火の向こうで顔を上げ、静かに頷いた。"
            },
            {
                id: "s13_misread",
                t: "じゃあ俺だって、次はランちゃん抜きで動くからな！",
                v: 3,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは傷ついたように顔を曇らせ、返事ができなかった。"
            },
            {
                id: "s13_understood",
                t: "……まだ話せる？　どうして一人で行ったのか、もう少し聞かせて",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは目を伏せ、少しずつ事情を説明し始めた。"
            }
        ],
        insightOpts: [
            {
                id: "s13_insight_twin",
                t: "頼れなかったからって、一人で背負うなよ。俺だってランちゃんを失いたくない",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火越しに身を乗り出し、ヴェインを見つめた。"
            },
            {
                id: "s13_insight_glass",
                t: "失いたくなかったって言うなら、なおさら俺の意思を聞くべきだったよ",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは苦しそうに目を伏せ、それから頷いた。"
            },
            {
                id: "s13_insight_resonance",
                t: "頼ってくれればよかったって、やっと言ってくれたな。……もっと聞かせて",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは小さく息を吐き、話を続けた。"
            }
        ],
        misreadOpts: [
            {
                id: "s13_guess_w13",
                t: "もっと俺を叱ればよかったって？　今からでも説教は聞くぜ",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは驚き、首を横に振った。"
            },
            {
                id: "s13_guess_w8",
                t: "俺を傷つけたくなかったなら、なおさら一人で危ないことするなよ",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは火を見つめ、ゆっくりと頷いた。"
            }
        ],
        afterStory: "野営地の火が小さくはぜた。ランスロットは火の向こうへ座り、しばらく言葉を選んでいた。ヴェインはノートを閉じ、相手の話が続くのを待った。",
        nextHook: "帰還後、ランスロットは以前よりさらにヴェインとの会話を避けるようになる。"
    },
    {
        id: 14,
        q: "「……俺のことを[[W7|忘れ]]てくれれば、お前はもう苦しまなくて済む。お前がいなくなることが[[W9|怖]]い。……俺はお前を[[W11|愛して]]いるから。」",
        vaneThought: "ランちゃん、今にもどこかへ行っちゃいそうな顔をしてる。……待ってくれよ。",
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
                t: "……待って。今の話、そんな簡単に言い切らないでよ！",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは扉へ向けた足を止め、ヴェインを見た。"
            },
            {
                id: "s14_misread",
                t: "俺が苦しむかどうか、ランちゃん一人で決めないでよ",
                v: 28,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは唇を噛み、やがて小さく頷いた。"
            },
            {
                id: "s14_understood",
                t: "もしかして船を下りるつもり？　だったら俺も荷物まとめるぜ！",
                v: 5,
                axis: "bond",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは驚き、そういう話ではないと首を振った。"
            }
        ],
        insightOpts: [
            {
                id: "s14_insight_glass",
                t: "俺を愛してるなら、忘れろなんて言わないで。俺の返事をちゃんと聞いてよ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは扉から手を離し、ヴェインへ向き直った。"
            },
            {
                id: "s14_insight_twin",
                t: "怖かったんだな。……でも俺は、一緒に答えを探す方がいい",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットはしばらく動かず、やがて静かに頷いた。"
            },
            {
                id: "s14_insight_resonance",
                t: "……今、愛してるって言ったんだよな。もう一回、ちゃんと聞かせて",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは目を見開き、ためらいながらも再び口を開いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s14_guess_w7",
                t: "俺に許してほしいことがあるなら、逃げずに話してよ。何をしたんだ？",
                v: 9,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは苦しそうに目を伏せた。"
            },
            {
                id: "s14_guess_w11",
                t: "……俺のこと、嫌いになったのか？　そんなの、急に言われても……",
                v: 3,
                axis: "self",
                trigger: {
                    key: "W11",
                    guesses: ["嫌う", "憎む"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットははっとして手を伸ばしたが、言葉を見つけられなかった。"
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
        vaneThought: "昨日の話の続きだ。今日は口を挟まず、最後まで聞きたい。",
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
                t: "何を言いたいのか、まだ全部は整理できない。でも今度こそ最後まで聞くよ",
                v: 28,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは手すりから手を離し、顔を上げた。"
            },
            {
                id: "s15_misread",
                t: "俺のことなら、俺にも何が必要か決めさせてほしい",
                v: 27,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットはヴェインの言葉を最後まで聞き、小さく頷いた。"
            },
            {
                id: "s15_understood",
                t: "……俺に聞いてほしかったんだよな。ここにいるから、続けてよ",
                v: 29,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは息を整え、ゆっくりと言葉を継いだ。"
            }
        ],
        insightOpts: [
            {
                id: "s15_insight_resonance",
                t: "大切だから忘れてほしかった。でもずっと聞いてほしかったんだな。……つらかったな",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは目を閉じ、しばらくしてから頷いた。"
            },
            {
                id: "s15_insight_twin",
                t: "俺を大切に思うなら、これからは何をするか二人で決めようぜ",
                v: 29,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは手すりから身を離し、ヴェインへ向き直った。"
            },
            {
                id: "s15_insight_glass",
                t: "俺のためって決めつける前に、俺が何を望んでるか聞いてほしいんだ",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは言い返さず、ヴェインの目を見た。"
            }
        ],
        misreadOpts: [
            {
                id: "s15_guess_w10",
                t: "今日だけ聞いてほしかったってこと？　……昨日じゃもう遅かったのか？",
                v: 8,
                axis: "listen",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは戸惑い、言い直そうとして口を閉じた。"
            },
            {
                id: "s15_guess_w5",
                t: "俺が足手まといだから離れたかったのか？　だったら、そんなことないって！",
                v: 6,
                axis: "self",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは静かに首を振り、苦しそうな顔をした。"
            }
        ],
        afterStory: "甲板で向き合うと、ランスロットはしばらく手すりを見ていた。やがて顔を上げ、途切れがちな声で話を続けた。ヴェインは途中で遮らなかった。",
        nextHook: "今度は途中で口を閉ざさず、胸の内を最後まで話そうとしている。"
    },
    {
        id: 16,
        q: "「お前は俺の[[W4]]だ。でも、それだけじゃない。お前を[[W8]]のが[[W9]]。だから遠ざけようとした。……それでも、本当は[[W2]]にいたい。」",
        vaneThought: "何度も聞いた言葉なのに、いま聞くと胸に刺さる。……今度こそ最後まで話してほしい。",
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
                t: "遠ざけようとしたんだな。……そこは聞こえた。今はもう話したくないのか？",
                v: 27,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは顔を上げ、もう逃げるつもりはないと言うように首を振った。"
            },
            {
                id: "s16_misread",
                t: "離れるって決める前に、俺にも相談してほしかったよ",
                v: 27,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは唇を引き結び、やがて頷いた。"
            },
            {
                id: "s16_understood",
                t: "俺が面倒だったのか？　それならもっと訓練して、頼りになる男になるぜ！",
                v: 5,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは驚き、慌てて違うと伝えようとした。"
            }
        ],
        insightOpts: [
            {
                id: "s16_insight_resonance",
                t: "失うのが怖くても、一緒にいたいんだな。俺もそうだよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは目を見開き、ゆっくりと頷いた。"
            },
            {
                id: "s16_insight_twin",
                t: "一緒にいたいなら、もう一人で抱え込むなよ。今度は二人で立とう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは握った拳をほどき、ヴェインの隣へ近づいた。"
            },
            {
                id: "s16_insight_glass",
                t: "怖かったのは分かった。でも離れるかどうかは俺にも選ばせてくれ",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは正面からヴェインを見つめ、頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s16_guess_w8",
                t: "俺を傷つけるのが嫌で離れたのか？　俺はそんなに弱くないよ",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは視線を落とし、少し悲しそうに笑った。"
            },
            {
                id: "s16_guess_w9",
                t: "そんなに苦しいなら、無理して俺と一緒にいなくてもいいんだぞ",
                v: 6,
                axis: "listen",
                trigger: {
                    key: "W9",
                    guesses: ["苦しい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは強く首を横に振り、必死にヴェインを見た。"
            }
        ],
        afterStory: "何度も聞いた言葉がひとつの文にいくつも重なった。ヴェインはノートを開きかけ、いったん閉じた。朝の風が二人の間を通り抜ける。",
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
                t: "……ちょっと待って。大事な話だから、もう一度聞いてもいいか？",
                v: 28,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは頷き、同じ言葉をゆっくり繰り返した。"
            },
            {
                id: "s17_misread",
                t: "俺も話したいことがあるんだ。……今度は俺の番にしていい？",
                v: 27,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは椅子を引き、ヴェインへまっすぐ向き直った。"
            },
            {
                id: "s17_understood",
                t: "最後の方、よく分かんなかったけど……もうこの話は終わりでいいよな！",
                v: 4,
                axis: "act",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは伏せていた目を上げ、ひどく寂しそうな顔をした。"
            }
        ],
        insightOpts: [
            {
                id: "s17_insight_resonance",
                t: "ありがとうって、信じてるって、頼りたいって……愛してるって。ちゃんと聞こえたよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは息を止めたように見えたが、やがて柔らかく笑った。"
            },
            {
                id: "s17_insight_twin",
                t: "頼るのはお互い様だろ。これからは何でも二人でやろうぜ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは嬉しそうに笑い、ヴェインの肩へ手を置いた。"
            },
            {
                id: "s17_insight_glass",
                t: "……愛してるって言ったんだな。じゃあ、今度は俺の気持ちも聞いてくれる？",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは真剣な表情で頷き、ヴェインへ向き直った。"
            }
        ],
        misreadOpts: [
            {
                id: "s17_guess_w13",
                t: "これからは俺を叱るって？　そんなに怒られることしたかな……",
                v: 7,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは驚いて目を見開き、違うと首を振った。"
            },
            {
                id: "s17_guess_w11",
                t: "俺のこと、そんなに尊敬してたのか？　へへ、ちょっと照れるぜ",
                v: 7,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは何か言おうとして、言葉を飲み込んだ。"
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
                t: "ああ、二人で帰ろうぜ。先に一人で行っちゃ駄目だからな",
                v: 29,
                axis: "act",
                reaction: "ランスロットは隣へ歩み寄り、ヴェインと歩幅を合わせた。"
            },
            {
                t: "危なそうな場所は声をかけてくれよ。俺もちゃんと周りを見るから",
                v: 27,
                axis: "self",
                reaction: "ランスロットは頷き、周囲を確かめてから歩き始めた。"
            },
            {
                t: "だったら俺が先に走って道を開いてくる！　ランちゃんは後から来いよ！",
                v: 4,
                axis: "listen",
                reaction: "ランスロットは慌てて呼び止め、二人で帰るのだと繰り返した。"
            }
        ],
        insightOpts: [
            {
                id: "s18_insight_twin",
                t: "ずっと一緒にいる約束だな。守るのは二人で、だから無茶はしないよ",
                v: 30,
                axis: "act",
                reaction: "ランスロットは満足そうに頷き、ヴェインの手を取った。"
            }
        ],
        misreadOpts: [
            {
                id: "s18_guess_w10",
                t: "今日だけ一緒なのか？　明日も、その次の日も一緒に歩きたいんだけどな",
                v: 12,
                axis: "act",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                reaction: "ランスロットは驚いたあと、何かを確かめるようにヴェインを見つめた。"
            }
        ],
        afterStory: "道が狭まるたび、先を歩くランスロットが速度を落とした。ヴェインが並ぶとまた進む。二人は危険な場所で何度か言葉を交わした。",
        nextHook: "夜が明ける頃、二人は呪いが始まった場所へ辿り着く。"
    },
    {
        id: 19,
        q: "「もう逃げない。ちゃんと[[W15|伝え]]る。お前が[[W5]]だから、お前を[[W8]]のが[[W9]]。それでも俺は、[[W10]][[W2]]にいたい。お前を[[W12|信じ]]て、必要な時にはお前を[[W13]]。これから先もそうすると[[W14]]する。ヴェイン。俺は、お前を[[W11|愛して]]いる。」",
        vaneThought: "今まで何度も耳にした言葉が重なっていく。ランちゃんは最後まで、俺から目を逸らさない。",
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
                t: "そんなに一度に言われたら胸がいっぱいになるよ。……でも最後まで聞いたぜ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは剣を収め、ヴェインの言葉を静かに受け止めた。"
            },
            {
                id: "s19_misread",
                t: "……こんな大事な話、今すぐ答えなきゃ駄目？　帰ってからでいいだろ",
                v: 5,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは目を伏せた。ヴェインの返事を待っていたことが伝わってくる。"
            },
            {
                id: "s19_understood",
                t: "……もう一度、ランちゃんの声を聴かせてよ。何度でも聞きたいんだ",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットはゆっくりと頷き、ヴェインへ一歩近づいた。"
            }
        ],
        insightOpts: [
            {
                id: "s19_insight_resonance",
                t: "全部聞こえたよ。……愛してるって。俺もランちゃんに伝えたいことがある",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランスロットは息を呑み、ヴェインの言葉を待った。"
            },
            {
                id: "s19_insight_twin",
                t: "ずっと一緒にいるって約束、俺もする。どっちかだけが守るんじゃなくて、二人でな",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットはヴェインの隣に立ち、ゆっくりと頷いた。"
            },
            {
                id: "s19_insight_glass",
                t: "気持ちは全部受け取った。これからのことは、俺の返事も聞いてから二人で決めよう",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは視線を逸らさず、ヴェインの答えを待った。"
            }
        ],
        misreadOpts: [
            {
                id: "s19_guess_w11",
                t: "俺を尊敬してくれてるのか？　……へへ、そんな真面目な顔で言われると照れるな",
                v: 8,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランスロットは目を見開き、何かを言い直そうとした。"
            },
            {
                id: "s19_guess_w8",
                t: "俺を傷つけたくなかったんだな。でも、俺のことは俺にも決めさせてくれよ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランスロットは一瞬口を閉じ、それから静かに頷いた。"
            }
        ],
        afterStory: "ランスロットは最後の文を言い終えるまで目を逸らさなかった。ヴェインは何度も書き直したノートにそっと触れ、それから顔を上げた。返答する時間が来た。",
        nextHook: "二人が選んできた向き合い方の先に、それぞれの未来が続いていく。"
    }
];
