const scenario = [

    {
        id: 0,
        q: "「ヴェイン、目が覚めたか。……よかった。医者の先生はまだ来ていない。[[W1|心配]]したぞ。」",
        vaneThought: "……目を開けると、すごく近くにランちゃんの顔があった。……悲しそうな声。胸の奥がぎゅっとなる。",
        words: [。
            { key: "W1", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "ランちゃん、めちゃくちゃ顔色が悪いぞ。……少し休んでくれよ",
                v: 27,
                axis: "listen",
                reaction: "ランちゃんは何か言いかけて視線を逸らし、ようやく椅子に座り直した。手はまだ寝台の縁から離れないままだ。"
            },
            {
                t: "……今の、途中ちょっと聞き取れなかったかも。もう１回、ランちゃんの声で聞きたい",
                v: 25,
                axis: "self",
                reaction: "ランちゃんは俺の目を見て、同じ言葉をゆっくり繰り返してくれた。欠けた音だけは変わらなかった。"
            },
            {
                t: "起きられたし腹も減ったぞ！　食堂まで走ってみようかな、なんて……",
                v: 8,
                axis: "act",
                reaction: "ランちゃんは慌てて立ち上がり、まだ寝ていろとヴェインの肩を支えた。"
            }
        ],
        insightOpts: [
            {
                id: "s00_insight_resonance",
                t: "……俺は大丈夫だぞ。目を覚ますまでそばにいてくれて、ありがとな",
                v: 30,
                axis: "listen",
                reaction: "ランちゃんは何度か瞬きをし、安堵したように俺の手を包んだ。"
            }
        ],
        misreadOpts: [
            {
                id: "s00_guess_w1",
                t: "見張りまでしてたのか？　俺、寝てる間に何かやらかした？",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["監視する", "見張る"]
                },
                misreadImpact: true,
                reaction: "ランちゃんはきょとんとしたあと、苦笑して首を横に振った。"
            }
        ],
        afterStory: "俺が起き上がろうとすると、ランちゃんの手が先に伸びた。触れた指先の冷たさに驚く。苦しそうな顔をしている。……俺が未熟なせいだ。",
        nextHook: "魔物に吹きかけられた呪いも、術師に見せればすぐ治る。２人とも、まだそう思っていた。"
    },
    {
        id: 1,
        q: "「体には異常がないらしいが、呪いが……。俺の声はお前に[[W15|伝え]]られているか。試させてくれ」",
        vaneThought: "検査は終わったはずなのに、ランちゃんはまだ緊張している。何を試したいのか、落ち着いて聞いてみよう。",
        words: [
            { key: "W15", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "試したいことがあるんだな。……肝心なところが聞こえなかった。何をするのか教えてくれよ",
                v: 27,
                axis: "listen",
                reaction: "ランちゃんは頷き、もう一度俺に話しかける。けれど同じところでまた音が途切れ、俺たちは困ったように顔を見合わせた。"
            },
            {
                t: "検査は終わったんだよな？　ランちゃんが気になることがあるなら、俺も付き合うぜ",
                v: 23,
                axis: "self",
                reaction: "ランちゃんは少しほっとして頷いたが、言いたかったことがまだ届いていないようだった。"
            },
            {
                t: "ええっ、また注射か？　俺、さっきので十分だと思うんだけど！",
                v: 7,
                axis: "act",
                reaction: "ランちゃんは驚き、検査の話ではないと何度も首を振った。"
            }
        ],
        insightOpts: [
            {
                id: "s01_insight_twin",
                t: "俺にちゃんと言葉を伝えられるか、試したいんだな。……うん、俺に何でも話してくれ",
                v: 30,
                axis: "act",
                reaction: "ランちゃんは嬉しそうに目を細め、それから少し緊張した顔で言葉を選んだ。"
            }
        ],
        misreadOpts: [
            {
                id: "s01_guess_w15",
                t: "身体の具合をもう一回確かめたいのか？　だったら先生も呼ぼうぜ",
                v: 8,
                axis: "act",
                trigger: {
                    key: "W15",
                    guesses: ["確かめる"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは戸惑い、医師を呼ぼうとするヴェインをそっと止めた。"
            }
        ],
        afterStory: "先生は孤独の呪いについて説明してくれた。今確かめているのは、ランちゃんの言葉を俺がどのくらい理解できるかだ。医師の問いは分かるのに、ランちゃんの言葉だけが一部分欠ける。俺はその音を紙に書き留めた。",
        nextHook: "同じ音がもう一度出てくれば、何か分かるかもしれない。"
    },
    {
        id: 2,
        q: "「食欲が戻ったようで安心した。……あの時は[[W3]]。」",
        vaneThought: "あの日、俺がランちゃんをかばった時のことだろうか。やっぱり悲しそうな顔だ。そんな顔してほしくないな。",
        words: [
            { key: "W3", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "……最後の言葉がへんな感じに聞こえた。ランちゃんの言葉は全部聴き取りたいのにな……。",
                v: 27,
                axis: "act",
                reaction: "ランちゃんは戸惑いながら俺の名前を呼び、何度も同じ言葉を繰り返した。"
            },
            {
                t: "あのときのこと、まだ気にしてるのか？　俺はランちゃんが無事でよかったよ",
                v: 25,
                axis: "self",
                reaction: "ランちゃんは目を伏せた。少しして、俺の皿の方へ手を伸ばし、冷めた料理を気遣った。"
            },
            {
                t: "見てくれよ、もうこんなに食えるんだ！　追加の一皿も頼んでいい？",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは笑いかけたが、言いかけた気持ちは飲み込んだようだった。"
            }
        ],
        insightOpts: [
            {
                id: "s02_insight_resonance",
                t: "俺は、お前を助けられたことが何よりもうれしいんだ。本当だぞ",
                v: 30,
                axis: "listen",
                reaction: "ランちゃんは息を呑んだ。頬がわずかに赤くなり、しばらく皿に目を落としていた。"
            }
        ],
        misreadOpts: [
            {
                id: "s02_guess_w3",
                t: "ランちゃん、謝らないで。俺がやりたかったことなんだ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W3",
                    guesses: ["ごめんな", "すまない"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは小さくため息をついて視線を落とした。綺麗なまつ毛が下を向いて震えている。"
            }
        ],
        afterStory: "食堂のざわめきの中でも、ランちゃんの声はまっすぐ俺の耳に届く。大好きなランちゃんの声。……今はその言葉がちゃんと聞こえないのが寂しい。",
        nextHook: "ノートには、これで三つの言葉が並んだ。まだ先は長い。"
    },
    {
        id: 3,
        q: "「体調が戻ったら、また[[W2]]に訓練をしよう。……それから、食事にも行こう。」",
        vaneThought: "訓練も食事も、またランちゃんと過ごせるなら嬉しい。……でも、ランちゃんは何を考えて俺を誘ったんだろう。",
        words: [
            { key: "W2", type: "new" }
        ],
        resolveChecks: [],
        importantChoice: false,
        opts: [
            {
                t: "訓練も飯も楽しみだな。……あれ、誰とやるかまでは聞き取れなかったぞ",
                v: 25,
                axis: "act",
                reaction: "ランちゃんは一瞬きょとんとし、そっと自分とヴェインを指さした。"
            },
            {
                t: "まずは身体を戻さないとな。ランちゃんにも、復帰したら相手をしてほしいんだ",
                v: 27,
                axis: "self",
                reaction: "ランちゃんは嬉しそうに頷き、無理のない稽古から始めようと提案した。"
            },
            {
                t: "よーし、飯だけ先に行こうぜ！　訓練はランちゃん一人で頼んだ！",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは思わず笑ったが、どちらも二人でしたいのだと言い直した。"
            }
        ],
        insightOpts: [
            {
                id: "s03_insight_twin",
                t: "また一緒にいられるんだな。……訓練のあと、二人で飯を食うのも楽しみだ",
                v: 30,
                axis: "act",
                reaction: "ランちゃんは少し照れたように微笑んだ。隣に並ぶ日を思い浮かべているようだった。"
            }
        ],
        misreadOpts: [
            {
                id: "s03_guess_w2",
                t: "静かなところで訓練したいのか？　だったら森の外れはどうだ？",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W2",
                    guesses: ["静か"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは目を丸くし、場所の話ではないと穏やかに説明し始めた。"
            }
        ],
        afterStory: "甲板で風に吹かれながら、二人は復帰後の予定を話した。ヴェインは「二人で」と言いたくなったが、ランちゃんの言葉にも同じ気持ちがあったのかは、まだ分からない。",
        nextHook: "翌朝、ヴェインは軽い訓練への復帰を許可された。"
    },

    // =========================================================
    // 第2章　言葉を集める
    // =========================================================
    {
        id: 4,
        q: "「本当に無理はしていないんだな？　まだ[[W1|心配]]なんだ。……だが、お前が大丈夫だと言うなら、その判断を[[W12|信じ]]る。」",
        vaneThought: "木剣を構えているのに、ランちゃんは俺の顔ばっかり見てる。大丈夫だって言ったのに、まだ何か言いたそうだ。",
        words: [
            { key: "W1", type: "repeat2" },
            { key: "W12", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: "light",
        opts: [
            {
                id: "s04_unknown",
                t: "……まだ怖そうな顔してるな。俺の調子、どこが気になる？　ちゃんと聞きたい",
                v: 26,
                axis: "daily",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは木剣を下ろし、ヴェインを見た。気遣いに答えようと、ゆっくり話し始めた。"
            },
            {
                id: "s04_misread",
                t: "大丈夫だって！　ランちゃんは向こうで休んでて。俺一人でやってくるからさ",
                v: 9,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんの顔が強張った。一人で背負わせたくない気持ちを伝えようとして、また言葉に詰まった。"
            },
            {
                id: "s04_understood",
                t: "ランちゃんが気にかけてくれてるのは分かるよ。でも、無理かどうかは俺にも決めさせて",
                v: 29,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんはしばらくヴェインの顔を見つめ、ようやく頷いた。二人で稽古の強さを決めた。"
            }
        ],
        insightOpts: [
            {
                id: "s04_insight_resonance",
                t: "心配してくれたんだな。俺の言葉も信じようとしてくれて、ありがとう",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは安堵の息を吐いた。木剣を握る手から、少し力が抜けた。"
            },
            {
                id: "s04_insight_twin",
                t: "信じてくれるなら、俺も頼るぜ。次は二人で、ちゃんと合図して動こう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは頷き、ヴェインと木剣を合わせて開始の合図にした。"
            },
            {
                id: "s04_insight_glass",
                t: "心配してくれて嬉しい。だからこそ、俺が大丈夫だって言う声も聞いてくれよ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは視線を落としてから笑い、ヴェインの言葉を受け入れた。"
            }
        ],
        misreadOpts: [
            {
                id: "s04_guess_w1",
                t: "そんなに俺を疑ってるのか？　ランちゃんまで信じてくれないなら、どうしたらいいんだよ",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W1",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんははっとした顔になり、誤解を解こうと言葉を探した。"
            },
            {
                id: "s04_guess_w12",
                t: "……やっぱり俺の判断が信用できないんだな。そこまで頼りない？",
                v: 8,
                axis: "listen",
                trigger: {
                    key: "W12",
                    guesses: ["疑う", "疑っている"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは慌てて首を振ったが、否定の言葉も同じ音に欠けてしまった。"
            }
        ],
        afterStory: "木剣が触れるたび、ランちゃんの視線がヴェインの足元へ動いた。ヴェインは嬉しいような、少しもどかしいような気持ちで、その気遣いの理由をノートへ書いた。",
        nextHook: "訓練を終えたあと、ランちゃんは武器庫であの日の出来事を口にした。"
    },
    {
        id: 5,
        q: "「あの日、俺がもう少し早く気づいていれば……。お前を[[W6|守れ]]なかった。お前は俺にとって[[W5]]なのに。」",
        vaneThought: "あの日の話になると、ランちゃんは自分を責める。声の細かい意味より先に、その苦しそうな顔が気になった。",
        words: [
            { key: "W5", type: "new" },
            { key: "W6", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "ランちゃん、また自分を責めてるだろ。……俺はここにいる。顔を上げてくれよ",
                v: 28,
                axis: "self",
                reaction: "ランちゃんは剣を磨く手を止めた。ヴェインの顔を見るまでに、少し時間がかかった。"
            },
            {
                t: "次に同じことがあったら、今度は二人で動こう。俺だってランちゃんを守りたい",
                v: 26,
                axis: "act",
                reaction: "ランちゃんは驚いたように目を上げ、やがて小さく頷いた。"
            },
            {
                t: "なあ、その剣の手入れって俺も手伝える？　新しい砥石もあるぜ",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは曖昧に笑い、置きかけた剣をもう一度手に取った。"
            }
        ],
        insightOpts: [
            {
                id: "s05_insight_glass",
                t: "大切だから守りたかったんだよな。俺もランちゃんを大切にしたい。……一人で責めないで",
                v: 30,
                axis: "self",
                reaction: "ランちゃんは剣を机に置き、言葉を失ったようにヴェインを見つめた。"
            }
        ],
        misreadOpts: [
            {
                id: "s05_guess_w5",
                t: "俺が足手まといだったのか？　……そう思わせたなら、もっと強くなるよ",
                v: 8,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは強く首を横に振り、思わずヴェインの手首を掴んだ。"
            }
        ],
        afterStory: "剣の手入れが終わっても、ランちゃんは布を畳み続けた。ヴェインは隣に座ったまま、もう一度その声を聞きたいと思った。今日の言葉は、忘れないようノートに書いた。",
        nextHook: "昼には、いつもの仲間たちが二人を待っていた。"
    },
    {
        id: 6,
        q: "「昔から変わらないな。お前は俺の[[W4]]だ。それだけは、この呪いがあっても変わらない。」",
        vaneThought: "昔から変わらないと言われると嬉しい。でも、あの呼び方を聞いたあと、なぜか少しだけ胸が苦しくなった。",
        words: [
            { key: "W4", type: "new" }
        ],
        resolveChecks: ["W1"],
        importantChoice: false,
        opts: [
            {
                t: "昔から変わらないってのは、俺もそう思う。……あの頃も今も、ランちゃんの隣が落ち着くよ",
                v: 27,
                axis: "act",
                reaction: "ランちゃんはふっと笑い、幼い頃の話をひとつ持ち出した。"
            },
            {
                t: "肝心な呼び方だけ分からなかった。……もう一回言って？　忘れたくないんだ",
                v: 25,
                axis: "self",
                reaction: "ランちゃんは少し頬を赤らめ、同じ言葉を丁寧に繰り返した。"
            },
            {
                t: "そうだ！　今度こそ子どもの頃の勝負、決着つけようぜ！",
                v: 10,
                axis: "listen",
                reaction: "ランちゃんは懐かしそうに微笑んだが、今の言葉に込めた気持ちは届かなかったらしい。"
            }
        ],
        insightOpts: [
            {
                id: "s06_insight_resonance",
                t: "親友、か。……嬉しいよ。けど俺、ランちゃんのことはそれだけじゃ言い足りない気もする",
                v: 30,
                axis: "listen",
                reaction: "ランちゃんの笑みが一瞬止まり、やがて照れたように視線を逸らした。"
            }
        ],
        misreadOpts: [
            {
                id: "s06_guess_w4",
                t: "ライバルだもんな！　昔みたいに次の勝負も受けて立つぜ！",
                v: 12,
                axis: "act",
                trigger: {
                    key: "W4",
                    guesses: ["ライバル", "競争相手"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは吹き出しかけ、それでもどこか言い足りなそうに笑った。"
            }
        ],
        afterStory: "仲間が昔の失敗談を持ち出し、二人で笑った。ランちゃんが笑うと、胸の奥が妙にあたたかい。ヴェインはその理由を知らないふりをしてノートを閉じた。",
        nextHook: "翌日、二人は物資の買い出しを任される。"
    },
    {
        id: 7,
        q: "「あの店、まだあったんだな。こうして[[W2]]に歩くのも久しぶりだ。……また来よう。そう[[W14]]してくれるか？」",
        vaneThought: "荷物が重いはずなのに、ランちゃんと並んでいると帰りたくなくなる。最後の音は何だろう。",
        words: [
            { key: "W2", type: "repeat2" },
            { key: "W14", type: "new" }
        ],
        resolveChecks: ["W1", "W2"],
        importantChoice: "light",
        opts: [
            {
                t: "また来たいな。……次は荷物なしで、ランちゃんとゆっくり見て歩きたい",
                v: 27,
                axis: "act",
                reaction: "ランちゃんははにかんで、ヴェインの荷物をひとつ持った。"
            },
            {
                t: "次の休み、俺の予定もあるんだけどさ。ランちゃんと行ける日を探してもいい？",
                v: 26,
                axis: "self",
                reaction: "ランちゃんは嬉しそうに頷き、手帳を開く仕草をした。"
            },
            {
                t: "そういえばあの店のプリン、まだ売ってるかな。今すぐ戻っていい？",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは笑ったが、約束の返事を待つように足を止めていた。"
            }
        ],
        insightOpts: [
            {
                id: "s07_insight_twin",
                t: "一緒に来る約束だな。もちろん。……次は俺から誘ってもいいか？",
                v: 30,
                axis: "act",
                reaction: "ランちゃんは一瞬驚き、それから街のざわめきに紛れるほど小さく「ぜひ」と答えた。"
            }
        ],
        misreadOpts: [
            {
                id: "s07_guess_w14",
                t: "次の予定を確認すればいいんだな。じゃあ今すぐ手帳出すよ",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは戸惑って瞬きした。予定より先に聞きたかった言葉があるらしい。"
            }
        ],
        afterStory: "店先の明かりの下で、二人の肩が何度か触れた。ランちゃんが荷物を持ち替えると、ヴェインは空いた手をつい見てしまう。何でもない帰り道を、もう少しだけ長く歩きたかった。",
        nextHook: "その夜、ヴェインは厨房で夜食を作ることにした。"
    },
    {
        id: 8,
        q: "「この料理、お前が作ったのか。……[[W3]]。俺も、もっとお前を[[W13|頼っ]]ていいのかもしれないな。」",
        vaneThought: "料理の話のはずが、ランちゃんは俺の顔を見て言葉を探してる。……こんな近くで見られると、落ち着かないな。",
        words: [
            { key: "W3", type: "repeat2" },
            { key: "W13", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3"],
        importantChoice: false,
        opts: [
            {
                t: "ランちゃんが食べてくれるなら、何皿でも作るぜ。……おかわり、いる？",
                v: 25,
                axis: "act",
                reaction: "ランちゃんは柔らかく笑い、少しだけ皿を差し出した。"
            },
            {
                t: "……その先、言いにくそうだな。飯が冷めてもいいから、ちゃんと聞かせてよ",
                v: 28,
                axis: "self",
                reaction: "ランちゃんはスプーンを置いた。ヴェインと目を合わせ、ゆっくり言葉を探した。"
            },
            {
                t: "あっ、プリンは一人一個だからな！　そこは譲らないぞ！",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは一度目を丸くし、くすっと笑ったあと、まだ話したそうに視線を残した。"
            }
        ],
        insightOpts: [
            {
                id: "s08_insight_twin",
                t: "ありがとな、って。……それから俺を頼りたいって言ってくれたのか？　嬉しいよ",
                v: 30,
                axis: "act",
                reaction: "ランちゃんは驚いたように顔を上げ、頬を赤らめて小さく頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s08_guess_w13",
                t: "俺のこと褒めてくれるのか？　へへ、味なら自信あるぜ！",
                v: 11,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["褒める"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは照れたように笑ったが、伝えたかったことは料理の腕前だけではないらしい。"
            }
        ],
        afterStory: "ランちゃんが言葉を選ぶたび、ヴェインも次の声を待った。皿を片づけながら、二人の手が触れそうになって思わず引っ込める。気づかれただろうか。",
        nextHook: "数日後、二人は短い巡回任務へ復帰する。"
    },
    {
        id: 9,
        q: "「無茶をするなと言っただろう！　……お前は俺にとって[[W5]]なんだ。お前を[[W8|失い]]たくない。」",
        vaneThought: "怒ってる。でも、それだけじゃない。包帯を巻く手が震えてるのを見て、俺まで胸が痛くなった。",
        words: [
            { key: "W5", type: "repeat2" },
            { key: "W8", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W5"],
        importantChoice: "important",
        opts: [
            {
                id: "s09_unknown",
                t: "……ごめんな、勝手に飛び出して。次はランちゃんの合図を待つ。二人で帰ろう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんの指が包帯の上で止まった。ゆっくり頷いてから、傷を痛めないよう手を添えた。"
            },
            {
                id: "s09_misread",
                t: "怒らせたのは分かる。でも、俺にも守りたいものがあるんだ。次は一緒に考えよう",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは反論しかけたが、ヴェインの目を見て言葉を飲み込んだ。"
            },
            {
                id: "s09_understood",
                t: "このくらい平気だって。ほら、そんな顔しないで笑ってくれよ！",
                v: 9,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは笑おうとしたが、上手くいかなかった。包帯を巻く指が少し震えていた。"
            }
        ],
        insightOpts: [
            {
                id: "s09_insight_resonance",
                t: "大切だから失いたくないんだな。……俺もランちゃんを失うのは嫌だ。無茶はしないよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を呑んだ。ヴェインの手を握りかけて、そっと包帯に触れ直した。"
            },
            {
                id: "s09_insight_twin",
                t: "怖い思いをさせたな。次はちゃんと背中を預ける。俺もランちゃんを守りたい",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんはようやく肩の力を抜き、ヴェインの手を一瞬だけ握った。"
            },
            {
                id: "s09_insight_glass",
                t: "そんなに大切に思ってくれてるなら、俺の気持ちも聞いて。俺も一人で決められたくない",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは黙って頷いた。ヴェインの手を放すまでに、少し時間がかかった。"
            }
        ],
        misreadOpts: [
            {
                id: "s09_guess_w8",
                t: "俺を傷つけたくなかったのか？　ならランちゃんが悪いわけじゃないぜ",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは言葉を探し、悲しそうに視線を落とした。"
            },
            {
                id: "s09_guess_w5",
                t: "俺が弱点なんだな。……もっと強くなる。ランちゃんにそんな顔をさせないために",
                v: 8,
                axis: "act",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは驚いて手を止め、今度こそ強く首を横に振った。"
            }
        ],
        afterStory: "包帯を巻き終わっても、ランちゃんはしばらく手を離さなかった。帰り道、少し離れるたびに互いを振り返る。傷よりも、言えなかったことの方が痛かった。",
        nextHook: "その夜から、ランちゃんの言葉数が少しずつ減り始めた。"
    },

    // =========================================================
    // 第3章　静かになる声
    // =========================================================
    {
        id: 10,
        q: "「本当はもっとちゃんと[[W15|伝え]]たい。お前を[[W12|信じ]]ている。……さっきのことは[[W7|忘れ]]てくれ。」",
        vaneThought: "「さっきのこと」のあと、何を言おうとしたんだろう。……ランちゃんがそんな顔をする理由を、俺は知りたい。",
        words: [
            { key: "W15", type: "repeat2" },
            { key: "W12", type: "repeat2" },
            { key: "W7", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W5", "W12", "W15"],
        importantChoice: false,
        opts: [
            {
                t: "さっきのことって、何の話？　……ランちゃんがそんな顔する理由を、もう少し聞きたい",
                v: 27,
                axis: "listen",
                reaction: "ランちゃんは顔を上げたが、答えを探すうちに再び資料へ目を落とした。"
            },
            {
                t: "俺のことなら、俺にも話してくれよ。ランちゃんが一人で決めてしまうのは寂しい",
                v: 26,
                axis: "self",
                reaction: "ランちゃんは資料を握り締め、ヴェインの方へ身体を向けた。"
            },
            {
                t: "分かった、もう聞かない！　俺も仕事戻らなきゃだしな",
                v: 8,
                axis: "act",
                reaction: "ランちゃんは口を開きかけて止めた。引き止めたいのに、言葉が見つからないようだった。"
            }
        ],
        insightOpts: [
            {
                id: "s10_insight_resonance",
                t: "信じてくれてるのに忘れろって、難しいよ。……ランちゃんが本当は何を言いたいのか聞きたい",
                v: 30,
                axis: "listen",
                reaction: "ランちゃんは苦しそうに笑い、閉じた資料へ手を置いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s10_guess_w7",
                t: "何か許してほしいのか？　だったら黙らないで、ちゃんと話してくれよ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは戸惑い、何かを否定するように首を振った。"
            }
        ],
        afterStory: "ランちゃんが資料を閉じる音だけが響いた。ヴェインはその手に触れたいと思ったが、伸ばしかけた指を止めた。言葉を待つことが、こんなに難しいなんて。",
        nextHook: "翌朝、その違和感は確信に変わる。"
    },
    {
        id: 11,
        q: "「お前は俺の[[W4]]だ。だから[[W6|守り]]たい。……なのに、話すことさえ[[W9|怖]]いんだ。」",
        vaneThought: "目をそらされるだけで、こんなに寂しい。昔は何も言わなくても通じると思ってたのに。",
        words: [
            { key: "W4", type: "repeat2" },
            { key: "W6", type: "repeat2" },
            { key: "W9", type: "new" }
        ],
        resolveChecks: ["W1", "W2", "W3", "W4", "W5", "W6", "W12", "W15"],
        importantChoice: false,
        opts: [
            {
                t: "……声、震えてる。無理して言わなくてもいい。でも俺、ここからいなくならないよ",
                v: 28,
                axis: "act",
                reaction: "ランちゃんは木剣を下ろした。しばらく息を整えてから、ヴェインを見た。"
            },
            {
                t: "避けられるのは、俺だって寂しいんだ。せめてランちゃんの顔を見て話したい",
                v: 27,
                axis: "self",
                reaction: "ランちゃんは目を伏せ、やがて一歩だけヴェインに近づいた。"
            },
            {
                t: "よし、気分転換に一本勝負！　勝った方が昼飯奢りな！",
                v: 8,
                axis: "listen",
                reaction: "ランちゃんは木剣を置いたまま、申し訳なさそうに首を横に振った。"
            }
        ],
        insightOpts: [
            {
                id: "s11_insight_resonance",
                t: "親友だから守りたいのに、話すのが怖いのか。……怖くても俺はランちゃんの声が聞きたい",
                v: 30,
                axis: "listen",
                reaction: "ランちゃんは目を見開き、しばらくして、ゆっくり頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s11_guess_w9",
                t: "……俺と話すのが嫌になったんだな。だったら邪魔しない方がいいのか？",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W9",
                    guesses: ["嫌だ"]
                },
                misreadImpact: true,
                reaction: "ランちゃんははっとして顔を上げ、必死に首を横に振った。"
            }
        ],
        afterStory: "稽古を終えても、ランちゃんはなかなか木剣を棚へ戻さなかった。ヴェインが近づくと少し身を引き、次の瞬間には離れたことを後悔したような顔になる。",
        nextHook: "そんな中、ヴェインに新しい任務が入る。"
    },
    {
        id: 12,
        q: "「……まだ[[W1|心配]]なんだ。必ず帰ってくると[[W14]]してくれ。俺は[[W10]]待っている。」",
        vaneThought: "出発の鐘が鳴る前から、もう帰ってきたくなってる。……ランちゃん、俺の顔をそんなに見ないでくれよ。",
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
                t: "帰ってくる。……だから、そんな顔で見送らないでくれよ。俺まで離れがたくなる",
                v: 28,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは荷物の留め具から手を離し、ヴェインの肩にそっと触れた。"
            },
            {
                id: "s12_misread",
                t: "帰る時間までは決められないんだ。……もう心配しないでよ、ランちゃん",
                v: 9,
                axis: "act",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは口を閉ざした。心配を責められたように感じたのか、目を伏せた。"
            },
            {
                id: "s12_understood",
                t: "言いたいこと、まだあるだろ？　鐘が鳴るまで聞くよ。俺は逃げたりしない",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんはヴェインを見つめ、何かを言いかけてから静かに頷いた。"
            }
        ],
        insightOpts: [
            {
                id: "s12_insight_resonance",
                t: "心配してくれてありがとう。約束する。ずっと待ってくれるなら、俺も必ず帰る",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは強く頷き、ヴェインの肩へ添えた手に力を込めた。"
            },
            {
                id: "s12_insight_twin",
                t: "約束する。帰ったら二人で飯を食おうな。俺もランちゃんを待たせたくない",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは照れたように微笑み、ヴェインの手を短く握った。"
            },
            {
                id: "s12_insight_glass",
                t: "必ず帰る。でも、危険なら予定は変えるよ。そこは俺にも選ばせて、ランちゃん",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは長く息を吐き、ヴェインの判断を受け入れた。"
            }
        ],
        misreadOpts: [
            {
                id: "s12_guess_w10",
                t: "今日だけ待つってこと？　……悪い、今日中に帰れるかは分からないんだ",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは驚いたあと、待つ時間の話ではないと伝えようとした。"
            },
            {
                id: "s12_guess_w14",
                t: "帰還予定の確認なら隊に出したぜ。……それだけじゃ足りない？",
                v: 9,
                axis: "act",
                trigger: {
                    key: "W14",
                    guesses: ["確認する", "確認"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは頷きかけて止まった。求めていた返事は別にあったらしい。"
            }
        ],
        afterStory: "荷物の金具を確かめるランちゃんの手は、何度も同じ場所へ戻った。出発の鐘が鳴っても、ヴェインはすぐに背を向けられない。やっと手を振ると、ランちゃんも小さく振り返した。",
        nextHook: "任務先で、その嫌な予感は現実になりかける。"
    },
    {
        id: 13,
        q: "「俺一人で対処できると思った。お前まで巻き込みたくなかった。……もっとお前を[[W13|頼れ]]ばよかった。お前を[[W8|失い]]たくなかったんだ。」",
        vaneThought: "勝手に一人で行って、勝手に傷ついて。怒ってるのに、また会えてほっとしてる自分がいる。",
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
                t: "じゃあ次は俺が先に行く！　ランちゃんには同じ思いをさせないから！",
                v: 9,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは顔を強張らせた。何も解決しないと伝えたいのに、うまく言葉にならない。"
            },
            {
                id: "s13_misread",
                t: "巻き込むかどうか、俺の分まで決めないでよ。……隣に立ちたいのは俺の意思なんだ",
                v: 30,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは視線を上げた。炎の向こうで、ようやくヴェインの言葉を受け止めた。"
            },
            {
                id: "s13_understood",
                t: "一人で行った理由、分かるところからでいい。……俺はちゃんと聞くから",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは焚き火に目を落とし、途切れがちな声で説明を始めた。"
            }
        ],
        insightOpts: [
            {
                id: "s13_insight_twin",
                t: "頼れなかったんだな。でも俺は、ランちゃんと一緒に帰る方がずっと大事だよ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは身を乗り出し、ヴェインの顔をじっと見た。"
            },
            {
                id: "s13_insight_glass",
                t: "失うのが怖くても、俺が何を望むかは聞いてほしかった。……俺は隣にいたいんだ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは目を閉じてから頷き、そっとヴェインの手に触れた。"
            },
            {
                id: "s13_insight_resonance",
                t: "俺を頼ればよかったって言ってくれたんだな。……今度こそ、全部聞かせてほしい",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を吐き、言いかけたことをひとつずつ口にした。"
            }
        ],
        misreadOpts: [
            {
                id: "s13_guess_w13",
                t: "もっと俺を叱ればよかったって？　……うん、怒ってるなら聞くよ",
                v: 11,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは面食らって首を横に振った。今は叱りたいわけではないらしい。"
            },
            {
                id: "s13_guess_w8",
                t: "怪我させるのが嫌だったのか？　だったら一人で危ない所へ行っちゃ駄目だろ",
                v: 12,
                axis: "act",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは火を見つめたまま、静かに頷いた。"
            }
        ],
        afterStory: "焚き火の向こうでは、互いの手が届かない。ヴェインは少し迷ってから回り込み、ランちゃんの隣へ腰を下ろした。それだけで、長く張りつめていた肩が少し下がった。",
        nextHook: "帰還後、ランちゃんは以前よりさらにヴェインとの会話を避けるようになる。"
    },
    {
        id: 14,
        q: "「……俺のことを[[W7|忘れ]]てくれれば、お前はもう苦しまなくて済む。お前がいなくなることが[[W9|怖]]い。……俺はお前を[[W11|愛して]]いるから。」",
        vaneThought: "ランちゃんが俺から離れていく。……嫌だ。大事なところが聞こえないのに、呼び止める理由だけははっきりしてる。",
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
                t: "待って、ランちゃん。急にそんな顔で行かないで。……今の話、もう少し聞かせてよ",
                v: 27,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは扉の前で足を止め、振り返った。うまく説明できない自分を責めるような顔だった。"
            },
            {
                id: "s14_misread",
                t: "……今は無理に話さなくていいよ。俺も聞くのが怖いから、また今度にしよう",
                v: 9,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは静かに目を伏せた。立ち去りかけて、結局そこから動けなかった。"
            },
            {
                id: "s14_understood",
                t: "どんな言葉だったとしても、ランちゃんだけで終わりにしないで。俺も一緒に考えたい",
                v: 30,
                axis: "bond",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは扉から手を離した。ヴェインの声に縋るように、ゆっくり振り向いた。"
            }
        ],
        insightOpts: [
            {
                id: "s14_insight_glass",
                t: "愛してるって言うなら、俺を忘れろなんて決めないで。俺の気持ちだって聞いてよ",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは息を呑み、ヴェインへ向き直った。"
            },
            {
                id: "s14_insight_twin",
                t: "怖かったんだな。……俺もランちゃんを失うのは怖い。だから一緒に考えよう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは頷きかけ、こらえきれないように目を伏せた。"
            },
            {
                id: "s14_insight_resonance",
                t: "いま、俺を愛してるって言った？　……もう一度、ランちゃんの声で聞かせてほしい",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは目を見開き、震える息を整えてからもう一度口を開いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s14_guess_w7",
                t: "俺に許してほしいことがあるのか？　だったら置いていかずに話してくれ",
                v: 10,
                axis: "listen",
                trigger: {
                    key: "W7",
                    guesses: ["許す", "許してほしい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは痛そうに顔を歪めた。伝えたいことが違うらしい。"
            },
            {
                id: "s14_guess_w11",
                t: "……俺のこと、憎んでるのか？　そんなこと言わないでよ、ランちゃん",
                v: 6,
                axis: "self",
                trigger: {
                    key: "W11",
                    guesses: ["嫌う", "憎む"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは驚き、必死にヴェインへ手を伸ばした。"
            }
        ],
        afterStory: "廊下に足音がひとつ響いて、止まった。ヴェインはランちゃんの背中を見つめる。その言葉の向こうに、ずっと知りたかった答えがある気がしてならなかった。",
        nextHook: "翌朝。今度はヴェインの方から、ランちゃんを探しに行く。"
    },

    // =========================================================
    // 第4章　声を聴かせて
    // =========================================================
    {
        id: 15,
        q: "「お前は俺にとって[[W5]]だ。だから、俺のことを[[W7|忘れ]]てほしいと思った。……だが、本当は[[W10]]、お前に聞いてほしかった。」",
        vaneThought: "昨日は怖くて声をかけられなかった。でも今日は、顔をそらさずに聞きたい。……ランちゃんの本当の気持ちを。",
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
                t: "分かった。じゃあもう悩むのはやめようぜ！　俺が何とかしてやるからさ",
                v: 9,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは強張った顔で首を振った。任せきりにしたいわけではないようだった。"
            },
            {
                id: "s15_misread",
                t: "ランちゃんのため、って話だけじゃないよ。俺が何を望むかも聞いてほしい",
                v: 27,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは手すりから手を離し、ヴェインの目を見て頷いた。"
            },
            {
                id: "s15_understood",
                t: "……俺に聞いてほしかったんだな。だったら聞くよ。言葉が欠けても、最後まで",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは小さく息を吐き、ようやくヴェインをまっすぐ見た。"
            }
        ],
        insightOpts: [
            {
                id: "s15_insight_resonance",
                t: "大切だから離れたくて、でもずっと聞いてほしかったんだな。……苦しかっただろ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんの表情が崩れ、何度も頷いた。"
            },
            {
                id: "s15_insight_twin",
                t: "俺を大切に思うなら、一人で抱えないで。これからは二人で選んでいこう",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんはヴェインの隣に並び、静かに頷いた。"
            },
            {
                id: "s15_insight_glass",
                t: "俺のために決めてくれたのは分かる。でも、俺が何を望むかは俺に言わせて",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは反論せず、ヴェインの返事を待った。"
            }
        ],
        misreadOpts: [
            {
                id: "s15_guess_w10",
                t: "今日だけ聞いてほしかったの？　……もっと前に気づけなくて、ごめんな",
                v: 11,
                axis: "listen",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは驚いて首を振った。時間の話だけではないらしい。"
            },
            {
                id: "s15_guess_w5",
                t: "俺が弱点なら、離れた方がいいと思った？　……俺、そんなに頼りない？",
                v: 8,
                axis: "self",
                trigger: {
                    key: "W5",
                    guesses: ["弱点", "足手まとい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは苦しそうに眉を寄せ、違うと首を振った。"
            }
        ],
        afterStory: "甲板の風は冷たいのに、隣に立つランちゃんの体温だけ妙にはっきり意識してしまう。ヴェインはノートを閉じた。今度は文字だけでなく、その顔を見ていたかった。",
        nextHook: "今度は途中で口を閉ざさず、胸の内を最後まで話そうとしている。"
    },
    {
        id: 16,
        q: "「お前は俺の[[W4]]だ。でも、それだけじゃない。お前を[[W8]]のが[[W9]]。だから遠ざけようとした。……それでも、本当は[[W2]]にいたい。」",
        vaneThought: "あの呼び方の先に、まだ何かが続いていた。ランちゃんが遠ざけようとした本当の理由を、今度こそ聞きたい。",
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
                t: "ランちゃん、今のところをもう少し聞かせて。……どうして遠ざけようとしたのか、ちゃんと知りたい",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんはゆっくり頷いた。逃げずに理由を話そうとする、その声はまだ少し震えていた。"
            },
            {
                id: "s16_misread",
                t: "離れるって決める前に、俺にも言ってほしかった。一人で苦しむランちゃんを見るの、つらいよ",
                v: 27,
                axis: "self",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんはヴェインを見つめ、握り締めた手をゆっくり開いた。"
            },
            {
                id: "s16_understood",
                t: "俺の気持ちは、最初からどうでもよかったんだな。……だったら、もう聞かなくてもいい",
                v: 9,
                axis: "bond",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは傷ついた顔で首を振った。伝わらなかった言葉の向こうで、もう一度すれ違いそうになった。"
            }
        ],
        insightOpts: [
            {
                id: "s16_insight_resonance",
                t: "俺を失うのが怖いのに、一緒にいたいんだな。……俺だって、ずっとそう思ってた",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を呑み、何度もヴェインの顔を確かめた。"
            },
            {
                id: "s16_insight_twin",
                t: "一緒にいたいなら、今度は離れないで。二人で怖がればいいだろ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんはそっとヴェインの隣へ寄った。"
            },
            {
                id: "s16_insight_glass",
                t: "怖いから離れるって、俺抜きで決めないで。俺もランちゃんを選びたい",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんはまっすぐヴェインを見つめ、静かに頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s16_guess_w8",
                t: "傷つけるのが怖くて離れたのか？　俺はそんなに弱くないのに",
                v: 10,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは口を結び、否定しきれないように目を伏せた。"
            },
            {
                id: "s16_guess_w9",
                t: "一緒にいるのが苦しいのか？　なら、俺の気持ちを押しつけちゃ駄目だよな",
                v: 8,
                axis: "listen",
                trigger: {
                    key: "W9",
                    guesses: ["苦しい"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは必死に首を振り、ヴェインの方へ手を伸ばした。"
            }
        ],
        afterStory: "何度も聞いた音が重なり、ヴェインの胸の中まで騒がしくする。それでも以前と違うのは、ランちゃんが逃げずに目を合わせてくれることだった。",
        nextHook: "まだ輪郭の掴めない音は残っている。それでも、もう会話は止まらない。"
    },
    {
        id: 17,
        q: "「ここまで聞いてくれて[[W3]]。俺はお前を[[W12|信じ]]ている。これからは、お前を[[W13]]。……それから、もう一つ。俺はお前を[[W11|愛して]]いる。」",
        vaneThought: "聞き慣れた声の中で、大切な言葉がいくつも重なった。ランちゃん、何だか泣きそうな顔をしてる。",
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
                t: "言いたかったこと、まだあるんだろ。……何度でも聞くから、二人で確かめよう",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは椅子を近づけ、言葉を区切りながらもう一度話し始めた。"
            },
            {
                id: "s17_misread",
                t: "ランちゃんの話、聞いた。……次は俺の話も聞いてほしい。ずっと言えなかったんだ",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは姿勢を正し、ヴェインの目を見つめた。"
            },
            {
                id: "s17_understood",
                t: "分かった、そんなにかしこまらなくていいって！　さ、飯にしようぜ",
                v: 9,
                axis: "act",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは手を伸ばしかけて止めた。今の言葉が届かない寂しさが表情に滲んだ。"
            }
        ],
        insightOpts: [
            {
                id: "s17_insight_resonance",
                t: "ありがとな、信じてる、頼りたい……愛してる。全部、ランちゃんの声で聞こえたよ",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を止めた。しばらくして、泣きそうに笑った。"
            },
            {
                id: "s17_insight_twin",
                t: "これからは遠慮なく俺を頼れよ。俺もランちゃんと二人で進みたい",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんはヴェインの肩に触れ、離れる前にもう一度握った。"
            },
            {
                id: "s17_insight_glass",
                t: "最後の言葉、ちゃんと受け取ったよ。……次は俺が言いたいこと、聞いてくれる？",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは頬を赤くし、ヴェインの言葉を待った。"
            }
        ],
        misreadOpts: [
            {
                id: "s17_guess_w13",
                t: "これからは俺を叱るって？　……厳しいな。まあ、ランちゃんになら叱られてもいいか",
                v: 9,
                axis: "self",
                trigger: {
                    key: "W13",
                    guesses: ["叱る"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは驚いて首を振った。真意を伝え直す方法を探していた。"
            },
            {
                id: "s17_guess_w11",
                t: "そんなに尊敬してたのか？　へへ、何だか照れるな",
                v: 11,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは照れたように微笑んだが、肝心な言葉だけが届かないもどかしさを隠せなかった。"
            }
        ],
        afterStory: "ランちゃんの声が途中で途切れるたび、ヴェインは逃げずに待った。向かいの椅子との距離は近い。けれど触れられない一歩が、まだ残っていた。",
        nextHook: "二人は、呪いを受けた場所へ戻ることを決める。"
    },
    {
        id: 18,
        q: "「今度は俺一人でお前を[[W6]]なんて言わない。[[W10]][[W2]]にいると[[W14]]しよう。……二人で帰るんだ。」",
        vaneThought: "「二人で帰る」は聞こえた。いつか、言葉を全部聞き取れたら……俺の気持ちも、ちゃんと伝えられるのかな。",
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
                t: "二人で帰るんだろ？　だったら、俺を置いて先に行くなよ",
                v: 27,
                axis: "act",
                reaction: "ランちゃんは笑い、歩幅を合わせてヴェインの隣に並んだ。"
            },
            {
                t: "もしまた危なくなったら、俺の意見も聞いてくれよ。ランちゃんだけに無理はさせない",
                v: 28,
                axis: "self",
                reaction: "ランちゃんは頷き、差し出された手を一度だけ握った。"
            },
            {
                t: "よし、俺が先に走って全部片づけてくる！　ランちゃんはここにいてな",
                v: 9,
                axis: "listen",
                reaction: "ランちゃんは慌てて呼び止めた。二人で帰るという言葉を、もう一度ゆっくり言った。"
            }
        ],
        insightOpts: [
            {
                id: "s18_insight_twin",
                t: "ずっと一緒にいる約束だな。……うん。俺も、その約束をずっと守りたい",
                v: 30,
                axis: "act",
                reaction: "ランちゃんは照れくさそうに笑い、ヴェインの手を取った。"
            }
        ],
        misreadOpts: [
            {
                id: "s18_guess_w10",
                t: "今日だけじゃ足りないよ。明日も、その先も、ランちゃんの隣がいい",
                v: 18,
                axis: "act",
                trigger: {
                    key: "W10",
                    guesses: ["今日", "今夜"]
                },
                misreadImpact: true,
                reaction: "ランちゃんは驚いてヴェインを見つめ、それから笑って頷いた。"
            }
        ],
        afterStory: "狭い道では自然と肩が触れた。以前なら笑って済ませていた距離が、今は少し照れくさい。それでもヴェインは、ランちゃんの隣から離れなかった。",
        nextHook: "夜が明ける頃、二人は呪いが始まった場所へ辿り着く。"
    },
    {
        id: 19,
        q: "「もう逃げない。ちゃんと[[W15|伝え]]る。お前が[[W5]]だから、お前を[[W8]]のが[[W9]]。それでも俺は、[[W10]][[W2]]にいたい。お前を[[W12|信じ]]て、必要な時にはお前を[[W13]]。これから先もそうすると[[W14]]する。ヴェイン。俺は、お前を[[W11|愛して]]いる。」",
        vaneThought: "何度も欠けた言葉が、今ひとつにつながろうとしている。怖い。でも……この人の声を、もう取りこぼしたくない。",
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
                t: "ランちゃんの話、聞いたよ。今度は俺も話す。……俺たちのこと、二人で考えたい",
                v: 27,
                axis: "listen",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは小さく頷き、ヴェインと向き合った。逃げずに待つことを選んだ顔だった。"
            },
            {
                id: "s19_misread",
                t: "ランちゃんの気持ちを、もっとちゃんと聞きたい。……その前に、俺の気持ちも聞いてくれる？",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは息を呑んだ。やがてヴェインへ向き直り、その返事を待った。"
            },
            {
                id: "s19_understood",
                t: "一度じゃ足りない。……ランちゃん、もう一回聞かせて。その声を忘れたくないんだ",
                v: 26,
                axis: "self",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を呑み、ゆっくり頷いた。もう一度、目をそらさずに言葉を紡いだ。"
            }
        ],
        insightOpts: [
            {
                id: "s19_insight_resonance",
                t: "全部聞こえたよ。……愛してるって。俺もずっと、ランちゃんが好きだった",
                v: 30,
                axis: "listen",
                endingImpact: true,
                route: "resonance",
                reaction: "ランちゃんは息を止め、やがて泣きそうな顔でヴェインの手を握った。"
            },
            {
                id: "s19_insight_twin",
                t: "ずっと一緒にいる約束、俺もする。守るのはどっちか一人じゃない、二人だよ",
                v: 30,
                axis: "act",
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは一歩近づき、ヴェインと肩を並べた。"
            },
            {
                id: "s19_insight_glass",
                t: "俺もランちゃんを愛してる。……でもこれからのことは、俺の声も聞いて一緒に決めて",
                v: 30,
                axis: "self",
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんはヴェインの目を見つめ、何度も頷いた。"
            }
        ],
        misreadOpts: [
            {
                id: "s19_guess_w11",
                t: "俺を尊敬してくれてたのか？　……なんだよ、そんな真剣な顔して",
                v: 10,
                axis: "act",
                trigger: {
                    key: "W11",
                    guesses: ["尊敬する", "敬う"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "twin",
                reaction: "ランちゃんは戸惑い、伝えたかった言葉を飲み込んだ。"
            },
            {
                id: "s19_guess_w8",
                t: "俺を傷つけたくなかったんだな。でも俺には、俺で決めたいことがあるんだ",
                v: 12,
                axis: "self",
                trigger: {
                    key: "W8",
                    guesses: ["傷つける", "傷付ける"]
                },
                misreadImpact: true,
                endingImpact: true,
                route: "glass",
                reaction: "ランちゃんは一度目を伏せ、それから静かに頷いた。"
            }
        ],
        afterStory: "ランちゃんは最後まで目を逸らさなかった。ヴェインも逃げなかった。ノートの頁に触れた指が震えている。恋心を言葉にするのは、呪いがなくてもこんなに難しかったのだ。",
        nextHook: "二人が選んできた向き合い方の先に、それぞれの未来が続いていく。"
    }
];
