/*
    声を聴かせて、ランスロット！
    追憶システム

    前提:
    - game.js の重要27択に id / endingImpact / route がある
    - HTML側に rebuildRunState() がある
    - masteredWords / vaneKnownWords / vaneUnderstoodAt がある

    現仕様:
    - 声の鍵1個で
      「END snapshot × Scene」の分岐地点を1つ永久解放する
    - 一度解放した同じ分岐地点では再度鍵を消費しない
    - Scene単位の全END共通解放は行わない
    - 無料Sceneは設けない
    - 初回クリア時に声の鍵+3
    - 以降、新しい通常END初回回収ごとに声の鍵+1
    - 同じENDの再回収では鍵を増やさない
    - プレイヤーの解読実績 masteredWords と
      現在世界線のヴェインの理解 vaneKnownWords は分離する
    - END7は通常END判定では出現せず、
      「最後の追憶」からのみ表示する
*/

const RECOLLECTION_STORAGE_KEY =
    "vane_recollection_v4";

const RECOLLECTION_SCHEMA_VERSION =
    5;

let runMode =
    "story"; // "story" | "recollection"

let recollectionBaseEndingId =
    null;

/*
    追憶画面を
    タイトルから開いたのか、
    ゲーム中／END画面から開いたのかを記録する。
*/
let recollectionOpenedFromGame =
    false;


// =========================================================
// 基本ヘルパー
// =========================================================

function getImportantRecollectionScenes() {
    return scenario.filter(
        scene => {
            return scene.opts.some(
                option => {
                    return (
                        option.endingImpact ===
                        true
                    );
                }
            );
        }
    );
}

function getSceneIndexById(
    sceneId
) {
    return scenario.findIndex(
        scene => {
            return (
                scene.id ===
                Number(sceneId)
            );
        }
    );
}

function isValidNormalEndingId(
    endingId
) {
    const id =
        Number(endingId);

    return (
        Number.isInteger(id) &&
        id >= 1 &&
        id <= 6
    );
}

function isValidImportantSceneId(
    sceneId
) {
    const id =
        Number(sceneId);

    return getImportantRecollectionScenes()
        .some(
            scene => {
                return (
                    scene.id === id
                );
            }
        );
}

/*
    END snapshot × Scene を
    一意に表すキー。

    例:
        END3 / Scene12
        → end3_scene12
*/
function getRecollectionBranchKey(
    endingId,
    sceneId
) {
    return (
        `end${Number(endingId)}` +
        `_scene${Number(sceneId)}`
    );
}

function getCurrentMasteredWordCount() {
    if (
        typeof masteredWords !==
            "undefined" &&
        masteredWords instanceof Set
    ) {
        return masteredWords.size;
    }

    if (
        typeof getMasteredWordSet ===
        "function"
    ) {
        return getMasteredWordSet()
            .size;
    }

    return 0;
}


// =========================================================
// セーブデータ
// =========================================================

function getDefaultRecollectionProgress() {
    return {
        version:
            RECOLLECTION_SCHEMA_VERSION,

        gameCleared:
            false,

        voiceKeys:
            0,

        /*
            例:
            [
                "end3_scene12",
                "end3_scene15",
                "end4_scene12"
            ]

            同じSceneでも、
            基準ENDが違えば別の分岐として扱う。
        */
        unlockedBranches:
            [],

        collectedNormalEndings:
            [],

        endingSnapshots:
            {},

        finalRecollectionUnlocked:
            false
    };
}


/*
    保存済み進行データを
    現行仕様へ正規化する。

    旧v4の
        unlockedSceneIds

    が残っている場合は、

        旧仕様で使用可能だった
        回収済みEND × 解放済みScene

    を unlockedBranches へ変換する。

    これにより、
    旧版ですでに得ていたアクセス権は失わせない。
*/
function normalizeRecollectionProgress(
    raw
) {
    const base =
        getDefaultRecollectionProgress();

    const src =
        raw &&
        typeof raw === "object"
            ? raw
            : {};

    const collectedNormalEndings =
        Array.from(
            new Set(
                (
                    Array.isArray(
                        src.collectedNormalEndings
                    )
                        ? src
                            .collectedNormalEndings
                        : []
                )
                    .map(Number)
                    .filter(
                        id => {
                            return (
                                id >= 1 &&
                                id <= 6
                            );
                        }
                    )
            )
        );

    const endingSnapshots =
        {};

    if (
        src.endingSnapshots &&
        typeof src.endingSnapshots ===
            "object"
    ) {
        Object.keys(
            src.endingSnapshots
        ).forEach(
            key => {
                const id =
                    Number(key);

                const snapshot =
                    src.endingSnapshots[
                        key
                    ];

                if (
                    isValidNormalEndingId(
                        id
                    ) &&
                    snapshot &&
                    typeof snapshot ===
                        "object"
                ) {
                    endingSnapshots[id] =
                        snapshot;
                }
            }
        );
    }

    const validBranches =
        new Set();

    /*
        現行形式の
        unlockedBranchesを読み込む。
    */
    const rawBranches =
        Array.isArray(
            src.unlockedBranches
        )
            ? src.unlockedBranches
            : [];

    rawBranches.forEach(
        value => {
            const match =
                String(value)
                    .match(
                        /^end([1-6])_scene(-?\d+)$/
                    );

            if (!match) {
                return;
            }

            const endingId =
                Number(match[1]);

            const sceneId =
                Number(match[2]);

            if (
                !isValidNormalEndingId(
                    endingId
                ) ||
                !isValidImportantSceneId(
                    sceneId
                )
            ) {
                return;
            }

            validBranches.add(
                getRecollectionBranchKey(
                    endingId,
                    sceneId
                )
            );
        }
    );


    /*
        旧形式
        unlockedSceneIds
        からの移行。

        旧版では一度Sceneを開くと
        全END共通だったため、
        その時点で所有していたENDについては
        同じSceneを解放済みとして引き継ぐ。
    */
    const legacyUnlockedSceneIds =
        Array.from(
            new Set(
                (
                    Array.isArray(
                        src.unlockedSceneIds
                    )
                        ? src
                            .unlockedSceneIds
                        : []
                )
                    .map(Number)
                    .filter(
                        sceneId => {
                            return (
                                isValidImportantSceneId(
                                    sceneId
                                )
                            );
                        }
                    )
            )
        );

    const migrationEndingIds =
        Array.from(
            new Set([
                ...collectedNormalEndings,
                ...Object.keys(
                    endingSnapshots
                )
                    .map(Number)
                    .filter(
                        id => {
                            return (
                                isValidNormalEndingId(
                                    id
                                )
                            );
                        }
                    )
            ])
        );

    legacyUnlockedSceneIds
        .forEach(
            sceneId => {
                migrationEndingIds
                    .forEach(
                        endingId => {
                            validBranches.add(
                                getRecollectionBranchKey(
                                    endingId,
                                    sceneId
                                )
                            );
                        }
                    );
            }
        );


    const voiceKeys =
        Number.isFinite(
            Number(
                src.voiceKeys
            )
        )
            ? Math.max(
                0,
                Math.floor(
                    Number(
                        src.voiceKeys
                    )
                )
            )
            : 0;


    const gameCleared =
        Boolean(
            src.gameCleared
        ) ||
        collectedNormalEndings
            .length > 0;


    const masteredCount =
        typeof getMasteredWordSet ===
            "function"
            ? getMasteredWordSet()
                .size
            : getCurrentMasteredWordCount();


    const finalRecollectionUnlocked =
        collectedNormalEndings
            .length >= 3 &&
        masteredCount ===
            Object.keys(
                wordBank
            ).length;


    return {
        ...base,

        version:
            RECOLLECTION_SCHEMA_VERSION,

        gameCleared,

        voiceKeys,

        unlockedBranches:
            Array.from(
                validBranches
            ),

        collectedNormalEndings,

        endingSnapshots,

        finalRecollectionUnlocked
    };
}


function loadRecollectionProgress() {
    let saved =
        null;

    try {
        saved =
            JSON.parse(
                localStorage.getItem(
                    RECOLLECTION_STORAGE_KEY
                ) || "null"
            );
    }
    catch (e) {
        saved =
            null;
    }


    /*
        現行／旧v4の
        追憶セーブが存在する場合。
    */
    if (
        saved &&
        typeof saved === "object"
    ) {
        const normalized =
            normalizeRecollectionProgress(
                saved
            );

        /*
            旧構造からの移行結果も
            その場で保存する。
        */
        localStorage.setItem(
            RECOLLECTION_STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );

        return normalized;
    }


    /*
        追憶セーブがまだ存在しない場合のみ、
        vane_collection_v3 から最低限移行する。

        END snapshotは存在しないため、
        架空の履歴は作らない。
    */
    const migrated =
        getDefaultRecollectionProgress();

    let oldCollection =
        [];

    try {
        oldCollection =
            JSON.parse(
                localStorage.getItem(
                    "vane_collection_v3"
                ) || "[]"
            );
    }
    catch (e) {
        oldCollection =
            [];
    }


    migrated
        .collectedNormalEndings =
            Array.from(
                new Set(
                    (
                        Array.isArray(
                            oldCollection
                        )
                            ? oldCollection
                            : []
                    )
                        .map(Number)
                        .filter(
                            id => {
                                return (
                                    id >= 1 &&
                                    id <= 6
                                );
                            }
                        )
                )
            );


    /*
        旧版ですでに通常ENDを
        回収している場合、
        追憶システム自体は解放済み扱い。

        新システムの報酬仕様に合わせ、
        初END +3、
        2個目以降 +1として
        未使用分の鍵を付与する。

        例:
        END1個 → 3個
        END2個 → 4個
        END3個 → 5個
    */
    if (
        migrated
            .collectedNormalEndings
            .length > 0
    ) {
        migrated.gameCleared =
            true;

        migrated.voiceKeys =
            3 +
            (
                migrated
                    .collectedNormalEndings
                    .length -
                1
            );
    }


    /*
        旧collectionしかない場合、
        どのENDのどのSceneを
        解放していたかは分からないので、
        unlockedBranchesは作らない。
    */
    migrated.unlockedBranches =
        [];


    const masteredNow =
        typeof getMasteredWordSet ===
            "function"
            ? getMasteredWordSet()
            : new Set();


    migrated
        .finalRecollectionUnlocked =
            migrated
                .collectedNormalEndings
                .length >= 3 &&
            masteredNow.size ===
                Object.keys(
                    wordBank
                ).length;


    const normalized =
        normalizeRecollectionProgress(
            migrated
        );


    localStorage.setItem(
        RECOLLECTION_STORAGE_KEY,
        JSON.stringify(
            normalized
        )
    );


    return normalized;
}


let recollectionProgress =
    loadRecollectionProgress();


function saveRecollectionProgress() {
    recollectionProgress =
        normalizeRecollectionProgress(
            recollectionProgress
        );

    localStorage.setItem(
        RECOLLECTION_STORAGE_KEY,
        JSON.stringify(
            recollectionProgress
        )
    );
}


// =========================================================
// snapshot
// =========================================================

/*
    そのENDの記憶において、
    指定Scene開始時点までに
    ヴェインが理解していた語だけを返す。

    startIndexと同じSceneで理解した語は、
    Scene開始時点ではまだ知らないため含めない。
*/
function getSnapshotKnowledgeBeforeScene(
    snapshot,
    startIndex
) {
    if (!snapshot) {
        return [];
    }

    const understoodAt =
        snapshot.vaneUnderstoodAt &&
        typeof snapshot
            .vaneUnderstoodAt ===
            "object"
            ? snapshot.vaneUnderstoodAt
            : {};


    return Object.keys(
        wordBank
    ).filter(
        key => {
            const at =
                Number(
                    understoodAt[key]
                );

            return (
                Number.isFinite(
                    at
                ) &&
                at < startIndex
            );
        }
    );
}


/*
    Phase1以前に
    選択肢本文そのものを保存していたデータが
    混ざっていてもoption.idへ変換する。
*/
function normalizeSavedAnswer(
    optionValue,
    sceneIndex
) {
    if (!optionValue) {
        return null;
    }

    const data =
        scenario[
            sceneIndex
        ];

    if (!data) {
        return null;
    }


    const byId =
        data.opts.find(
            option => {
                return (
                    option.id ===
                    optionValue
                );
            }
        );

    if (byId) {
        return byId.id;
    }


    const byText =
        data.opts.find(
            option => {
                return (
                    option.t ===
                    optionValue
                );
            }
        );


    return byText
        ? byText.id
        : null;
}


/*
    現在の一周を
    END用snapshotへ変換する。
*/
function snapshotCurrentRun() {
    return {
        selectedAnswers:
            selectedAnswers.map(
                (
                    value,
                    index
                ) => {
                    return normalizeSavedAnswer(
                        value,
                        index
                    );
                }
            ),

        vaneKnownWords:
            Array.from(
                vaneKnownWords
            ),

        /*
            「いつ理解したか」を保存する。

            これがないと、
            Scene15へ戻った時に
            Scene19で理解した語まで
            過去へ逆流してしまう。
        */
        vaneUnderstoodAt: {
            ...(
                typeof vaneUnderstoodAt ===
                    "object"
                    ? vaneUnderstoodAt
                    : {}
            )
        },

        clearedAt:
            Date.now()
    };
}


// =========================================================
// END進行・鍵報酬
// =========================================================

function updateFinalRecollectionUnlock() {
    const wasUnlocked =
        recollectionProgress
            .finalRecollectionUnlocked;


    const masteredCount =
        getCurrentMasteredWordCount();


    recollectionProgress
        .finalRecollectionUnlocked =
            recollectionProgress
                .collectedNormalEndings
                .length >= 3 &&
            masteredCount ===
                Object.keys(
                    wordBank
                ).length;


    return (
        !wasUnlocked &&
        recollectionProgress
            .finalRecollectionUnlocked
    );
}


/*
    通常END1〜6へ到達した時、
    endings.jsから1回だけ呼ぶ。

    初回:
      鍵 +3

    2個目以降の新END:
      鍵 +1

    同じEND:
      +0
*/
function recordEndingProgress(
    endingId
) {
    const id =
        Number(
            endingId
        );


    if (
        !isValidNormalEndingId(
            id
        )
    ) {
        return {
            isFirstClear:
                false,

            isNewEnding:
                false,

            keysGained:
                0,

            finalRecollectionUnlockedNow:
                false
        };
    }


    const isFirstClear =
        !recollectionProgress
            .gameCleared;


    const alreadyCollected =
        recollectionProgress
            .collectedNormalEndings
            .includes(
                id
            );


    let keysGained =
        0;


    if (isFirstClear) {
        recollectionProgress
            .gameCleared =
                true;

        recollectionProgress
            .voiceKeys +=
                3;

        keysGained =
            3;
    }
    else if (
        !alreadyCollected
    ) {
        recollectionProgress
            .voiceKeys +=
                1;

        keysGained =
            1;
    }


    if (
        !alreadyCollected
    ) {
        recollectionProgress
            .collectedNormalEndings
            .push(
                id
            );
    }


    /*
        同じENDを別ルートで再取得しても、
        基準snapshotは勝手に上書きしない。

        ENDごとに最初に保存された履歴を
        基準記憶として扱う。
    */
    if (
        !recollectionProgress
            .endingSnapshots[
                id
            ]
    ) {
        recollectionProgress
            .endingSnapshots[
                id
            ] =
                snapshotCurrentRun();
    }


    const finalRecollectionUnlockedNow =
        updateFinalRecollectionUnlock();


    saveRecollectionProgress();


    return {
        isFirstClear,

        isNewEnding:
            !alreadyCollected,

        keysGained,

        finalRecollectionUnlockedNow
    };
}


// =========================================================
// 分岐地点解放
// =========================================================

function isRecollectionBranchUnlocked(
    endingId,
    sceneId
) {
    const branchKey =
        getRecollectionBranchKey(
            endingId,
            sceneId
        );


    return recollectionProgress
        .unlockedBranches
        .includes(
            branchKey
        );
}


/*
    声の鍵1個を使用し、

    END snapshot × Scene

    の分岐地点を永久解放する。

    一度解放した同じ分岐地点では
    再度鍵を消費しない。
*/
function unlockRecollectionBranch(
    endingId,
    sceneId
) {
    const endId =
        Number(
            endingId
        );

    const id =
        Number(
            sceneId
        );


    if (
        !isValidNormalEndingId(
            endId
        )
    ) {
        return false;
    }


    if (
        !isValidImportantSceneId(
            id
        )
    ) {
        return false;
    }


    /*
        基準snapshotが存在しないENDからは
        分岐を作れない。
    */
    if (
        !recollectionProgress
            .endingSnapshots[
                endId
            ]
    ) {
        return false;
    }


    if (
        isRecollectionBranchUnlocked(
            endId,
            id
        )
    ) {
        return true;
    }


    if (
        recollectionProgress
            .voiceKeys <= 0
    ) {
        return false;
    }


    recollectionProgress
        .voiceKeys--;


    recollectionProgress
        .unlockedBranches
        .push(
            getRecollectionBranchKey(
                endId,
                id
            )
        );


    saveRecollectionProgress();


    return true;
}


// =========================================================
// 世界線状態復元
// =========================================================

/*
    途中Sceneから開始するため、
    そのSceneより前までに
    各暗号を何回聞いたか復元する。
*/
function rebuildSeenWordsBefore(
    startIndex
) {
    wordSeenCounts =
        {};

    seenSceneIds =
        new Set();


    for (
        let i = 0;
        i < startIndex;
        i++
    ) {
        registerSceneWords(
            i
        );
    }
}


/*
    「このヴェインの状態にする」

    requestedKeysのうち、
    masteredWordsに存在する語だけを
    現在世界線へ反映する。

    常に
        vaneKnownWords ⊆ masteredWords
    を保つ。
*/
function applyRecollectionKnowledge(
    requestedKeys,
    snapshot,
    startIndex
) {
    const requested =
        Array.isArray(
            requestedKeys
        )
            ? requestedKeys
            : Array.from(
                requestedKeys ||
                []
            );


    const allowed =
        requested.filter(
            key => {
                return (
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            wordBank,
                            key
                        ) &&
                    masteredWords
                        .has(
                            key
                        )
                );
            }
        );


    vaneKnownWords =
        new Set(
            allowed
        );


    vaneUnderstoodAt =
        {};


    const oldUnderstoodAt =
        snapshot &&
        snapshot.vaneUnderstoodAt &&
        typeof snapshot
            .vaneUnderstoodAt ===
            "object"
            ? snapshot
                .vaneUnderstoodAt
            : {};


    allowed.forEach(
        key => {
            const oldAt =
                Number(
                    oldUnderstoodAt[
                        key
                    ]
                );


            if (
                Number.isFinite(
                    oldAt
                ) &&
                oldAt <
                    startIndex
            ) {
                /*
                    元の記憶でも
                    このScene以前に
                    理解済みだった語。
                */
                vaneUnderstoodAt[
                    key
                ] =
                    oldAt;
            }
            else {
                /*
                    カスタム設定によって
                    この追憶へ持ち込んだ語。

                    分岐開始直前から
                    理解済みとして扱う。
                */
                vaneUnderstoodAt[
                    key
                ] =
                    startIndex -
                    1;
            }
        }
    );


    Object.keys(
        wordBank
    ).forEach(
        key => {
            userDict[
                key
            ] =
                vaneKnownWords
                    .has(
                        key
                    )
                    ? wordBank[
                        key
                    ].canonical
                    : "";


            renderDictEntryState(
                key
            );
        }
    );


    updateIntelUI();


    return Array.from(
        vaneKnownWords
    );
}


// =========================================================
// END画面から追憶へ戻るためのUI復元
// =========================================================

/*
    endings.js はEND表示時に
    #display.innerHTML を
    エンディング本文へ置き換える。

    その状態から直接追憶を開始すると、
    updateUI() が必要とする

        speaker-name
        face-emoji
        message-text
        vane-thought-text
        story-text
        resolution-text

    が存在しない。

    そのため、追憶開始時に必要な場合だけ
    元のゲーム表示DOMを復元する。
*/
function restoreGameDisplayShell() {
    const display =
        document.getElementById(
            "display"
        );

    if (!display) {
        return;
    }


    if (
        document.getElementById(
            "message-text"
        ) &&
        document.getElementById(
            "vane-thought-text"
        ) &&
        document.getElementById(
            "story-text"
        ) &&
        document.getElementById(
            "resolution-text"
        )
    ) {
        return;
    }


    display.innerHTML = `
        <div id="chara-header">
            <span
                id="face-emoji"
                style="
                    font-size:2em;
                    margin-right:15px;
                "
            >
                😊
            </span>

            <span
                id="speaker-name"
                style="
                    font-weight:bold;
                    letter-spacing:0.1em;
                    color:var(--main);
                "
            >
                LANCELOT
            </span>
        </div>

        <div
            class="bubble"
            id="message-text"
        >
            ......
        </div>

        <div id="vane-thought-block">
            <div class="block-label">
                💭 VANE
            </div>

            <div
                class="thought-bubble"
                id="vane-thought-text"
            ></div>
        </div>

        <div
            id="story-block"
            style="display:none;"
        >
            <div class="block-label">
                STORY
            </div>

            <div
                class="story-bubble"
                id="story-text"
            ></div>
        </div>

        <div
            id="resolution-block"
            style="display:none;"
        >
            <div class="block-label">
                UNDERSTANDING
            </div>

            <div
                class="resolution-bubble"
                id="resolution-text"
            ></div>
        </div>
    `;
}


// =========================================================
// 追憶開始
// =========================================================

function startRecollection(
    baseEndingId,
    startSceneId,
    requestedKnowledgeKeys
) {
    const endingId =
        Number(
            baseEndingId
        );

    const sceneId =
        Number(
            startSceneId
        );


    if (
        !isValidNormalEndingId(
            endingId
        )
    ) {
        return false;
    }


    const snapshot =
        recollectionProgress
            .endingSnapshots[
                endingId
            ];


    if (!snapshot) {
        return false;
    }


    /*
        このEND × このSceneが
        解放済みでなければ開始不可。
    */
    if (
        !isRecollectionBranchUnlocked(
            endingId,
            sceneId
        )
    ) {
        return false;
    }


    const startIndex =
        getSceneIndexById(
            sceneId
        );


    if (
        startIndex < 0
    ) {
        return false;
    }


    runMode =
        "recollection";


    recollectionBaseEndingId =
        endingId;


    /*
        分岐地点より前の選択だけ
        元ENDのsnapshotを継承する。
    */
    selectedAnswers =
        new Array(
            scenario.length
        ).fill(
            null
        );


    const savedAnswers =
        Array.isArray(
            snapshot.selectedAnswers
        )
            ? snapshot
                .selectedAnswers
            : [];


    for (
        let i = 0;
        i < startIndex;
        i++
    ) {
        selectedAnswers[
            i
        ] =
            normalizeSavedAnswer(
                savedAnswers[
                    i
                ],
                i
            );
    }


    /*
        分岐地点以降は
        新しい世界線として選び直す。
    */
    currentStep =
        startIndex;

    viewingStep =
        startIndex;

    interactionPhase =
        "conversation";

    pendingOption =
        null;

    pendingResolvedKeys =
        [];

    pendingFinalLine =
        "";


    /*
        END表示によって
        #displayが書き換えられている場合だけ
        ゲームUIを復元する。
    */
    restoreGameDisplayShell();


    /*
        辞書をいったん
        現在世界線未設定状態へ戻す。
    */
    vaneKnownWords =
        new Set();

    vaneUnderstoodAt =
        {};


    initDict(
        {}
    );


    /*
        選択されたヴェインの理解状態を
        適用する。
    */
    applyRecollectionKnowledge(
        requestedKnowledgeKeys,
        snapshot,
        startIndex
    );


    /*
        分岐地点以前の暗号登場回数を復元。
    */
    rebuildSeenWordsBefore(
        startIndex
    );


    /*
        通常startGame()と同じく、
        現在Sceneの暗号も
        Scene開始時に登録する。
    */
    registerSceneWords(
        startIndex
    );


    /*
        分岐地点以前の選択履歴から
        lovePoints /
        interpretation /
        axis /
        route
        を再構築する。
    */
    rebuildRunState();


    const overlay =
        document.getElementById(
            "recollection-overlay"
        );


    if (overlay) {
        overlay.style.display =
            "none";
    }


    /*
        タイトル画面から直接
        追憶を開始した場合にも対応。
    */
    const deviceOverlay =
        document.getElementById(
            "device-check-overlay"
        );

    if (deviceOverlay) {
        deviceOverlay.style.display =
            "none";
    }


    const introOverlay =
        document.getElementById(
            "intro-overlay"
        );

    if (introOverlay) {
        introOverlay.style.display =
            "none";
    }


    const tutorialOverlay =
        document.getElementById(
            "tutorial-overlay"
        );

    if (tutorialOverlay) {
        tutorialOverlay.style.display =
            "none";
    }


    const loadOverlay =
        document.getElementById(
            "load-overlay"
        );

    if (loadOverlay) {
        loadOverlay.style.display =
            "none";
    }


    document.getElementById(
        "game-container"
    ).style.display =
        "flex";


    recollectionOpenedFromGame =
        true;


    renderTabs();

    updateUI(
        true
    );


    const display =
        document.getElementById(
            "display"
        );


    if (display) {
        display.scrollTop =
            0;
    }


    return true;
}


// =========================================================
// 通常END判定
// =========================================================

/*
    通常END1〜6だけを決定する。

    END7は絶対に
    この関数から返さない。
*/
function determineNormalEndingId() {
    rebuildRunState();


    /*
        END1 暁光の誓い

        プレイヤー全体の
        masteredWordsではなく、
        現在世界線の
        vaneKnownWordsを見る。
    */
    if (
        vaneKnownWords.size ===
        Object.keys(
            wordBank
        ).length
    ) {
        return 1;
    }


    /*
        END5 プリンの迷宮
    */
    if (
        interpretationCounts
            .misread >= 5
    ) {
        return 5;
    }


    /*
        END4 静寂のあとで
    */
    if (
        interpretationCounts
            .unknown >= 5
    ) {
        return 4;
    }


    /*
        残りは
        END2 / END3 / END6。
    */
    const maxRoute =
        Math.max(
            routeCounts.twin,
            routeCounts.glass,
            routeCounts.resonance
        );


    const tiedRoutes =
        new Set(
            [
                "twin",
                "glass",
                "resonance"
            ].filter(
                route => {
                    return (
                        routeCounts[
                            route
                        ] ===
                        maxRoute
                    );
                }
            )
        );


    let winningRoute =
        "twin";


    /*
        route同数なら、
        最後に選んだ
        同数routeを採用する。
    */
    for (
        let i =
            scenario.length -
            1;
        i >= 0;
        i--
    ) {
        const optionId =
            selectedAnswers[
                i
            ];


        if (!optionId) {
            continue;
        }


        const data =
            scenario[
                i
            ];


        const option =
            data.opts.find(
                o => {
                    return (
                        o.id ===
                        optionId
                    );
                }
            );


        if (
            option &&
            option.route &&
            tiedRoutes.has(
                option.route
            )
        ) {
            winningRoute =
                option.route;

            break;
        }
    }


    if (
        winningRoute ===
        "twin"
    ) {
        return 2;
    }


    if (
        winningRoute ===
        "glass"
    ) {
        return 3;
    }


    return 6;
}


// =========================================================
// 追憶UI
// =========================================================

function ensureRecollectionOverlay() {
    if (
        document.getElementById(
            "recollection-overlay"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.textContent = `
        #recollection-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.98);
            z-index: 160;
            display: none;
            justify-content: center;
            align-items: center;
            color: #ecf0f1;
        }

        #recollection-panel {
            width: min(900px, 92vw);
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid #d4af37;
            border-radius: 8px;
            padding: 28px;
            box-sizing: border-box;
            background: #111;
        }

        .recollection-head {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            margin-bottom: 20px;
        }

        .recollection-grid {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        220px,
                        1fr
                    )
                );
            gap: 12px;
        }

        .recollection-card {
            width: 100%;
            padding: 14px;
            box-sizing: border-box;
            border: 1px solid #555;
            border-radius: 6px;
            background: #1d1d1d;
            color: #fff;
            text-align: left;
            cursor: pointer;
        }

        .recollection-card:hover:not(:disabled) {
            border-color: #d4af37;
        }

        .recollection-card:disabled {
            opacity: 0.45;
            cursor: default;
        }

        .recollection-note {
            color: #aeb6bf;
            font-size: 0.9em;
            line-height: 1.7;
        }

        .knowledge-list {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        180px,
                        1fr
                    )
                );
            gap: 8px;
            margin: 18px 0;
        }

        .knowledge-item {
            padding: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #181818;
        }

        .knowledge-item.locked {
            opacity: 0.4;
        }

        .recollection-actions {
            margin-top: 22px;
        }
    `;


    document.head.appendChild(
        style
    );


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "recollection-overlay";


    overlay.innerHTML = `
        <div id="recollection-panel">
            <div id="recollection-content"></div>
        </div>
    `;


    document.body.appendChild(
        overlay
    );
}


const endingLabels = {
    1: "💍 暁光の誓い",
    2: "🤝 不滅の双璧",
    3: "⌛ 硝子の距離",
    4: "❄️ 静寂のあとで",
    5: "🍮 プリンの迷宮",
    6: "🌌 魂の共鳴"
};


function openRecollection() {
    ensureRecollectionOverlay();


    const gameContainer =
        document.getElementById(
            "game-container"
        );


    /*
        閉じた時に
        元の画面へ戻せるよう記録。
    */
    recollectionOpenedFromGame =
        !!(
            gameContainer &&
            window.getComputedStyle(
                gameContainer
            ).display !==
                "none"
        );


    /*
        localStorageの最新状態と同期。
    */
    recollectionProgress =
        loadRecollectionProgress();


    /*
        プレイヤー全体の解読実績も
        最新状態へ同期する。
    */
    if (
        typeof getMasteredWordSet ===
        "function"
    ) {
        masteredWords =
            getMasteredWordSet();
    }


    const overlay =
        document.getElementById(
            "recollection-overlay"
        );


    overlay.style.display =
        "flex";


    renderRecollectionHome();
}


function closeRecollection() {
    const overlay =
        document.getElementById(
            "recollection-overlay"
        );


    if (overlay) {
        overlay.style.display =
            "none";
    }


    /*
        タイトル画面から
        追憶を開いていただけなら、
        閉じた時にタイトル相当の
        環境確認画面へ戻す。

        これがないと黒画面になる。
    */
    if (
        !recollectionOpenedFromGame
    ) {
        const deviceOverlay =
            document.getElementById(
                "device-check-overlay"
            );


        if (deviceOverlay) {
            deviceOverlay.style.display =
                "flex";
        }
    }
}


function renderRecollectionHome() {
    const content =
        document.getElementById(
            "recollection-content"
        );


    if (!content) {
        return;
    }


    const endings =
        recollectionProgress
            .collectedNormalEndings
            .slice()
            .sort(
                (
                    a,
                    b
                ) => {
                    return (
                        a -
                        b
                    );
                }
            );


    const endingButtons =
        endings
            .map(
                id => {
                    const hasSnapshot =
                        !!recollectionProgress
                            .endingSnapshots[
                                id
                            ];


                    return `
                        <button
                            class="recollection-card"
                            ${
                                hasSnapshot
                                    ? ""
                                    : "disabled"
                            }
                            onclick="renderRecollectionSceneSelect(${id})"
                        >
                            <b>
                                ${
                                    endingLabels[
                                        id
                                    ] ||
                                    `END ${id}`
                                }
                            </b>

                            <br>

                            <span class="recollection-note">
                                ${
                                    hasSnapshot
                                        ? "この記憶から別の可能性を辿る"
                                        : "追憶用の記録がありません。新形式で一度この結末へ到達すると使用できます。"
                                }
                            </span>
                        </button>
                    `;
                }
            )
            .join(
                ""
            );


    const finalButton =
        recollectionProgress
            .finalRecollectionUnlocked
            ? `
                <button
                    class="recollection-card"
                    onclick="startFinalRecollectionFromUI()"
                >
                    <b>
                        🌅 最後の追憶
                    </b>

                    <br>

                    <span class="recollection-note">
                        複数の記憶を辿り、
                        すべての言葉を知った先へ。
                    </span>
                </button>
            `
            : "";


    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37;
                    "
                >
                    追憶
                </h2>

                <div class="recollection-note">
                    回収した記憶を起点に、
                    別の可能性を辿ります。
                </div>
            </div>

            <div>
                🔑 声の鍵

                <b>
                    ${
                        recollectionProgress
                            .voiceKeys
                    }
                </b>
            </div>
        </div>

        <div class="recollection-grid">
            ${
                endingButtons ||
                `
                    <div class="recollection-note">
                        まだ追憶できる結末がありません。
                    </div>
                `
            }

            ${finalButton}
        </div>

        <div class="recollection-actions">
            <button
                class="btn-style"
                style="
                    background:#7f8c8d;
                    color:#fff;
                "
                onclick="closeRecollection()"
            >
                閉じる
            </button>
        </div>
    `;
}


function renderRecollectionSceneSelect(
    endingId
) {
    const endId =
        Number(
            endingId
        );


    const content =
        document.getElementById(
            "recollection-content"
        );


    if (!content) {
        return;
    }


    const snapshot =
        recollectionProgress
            .endingSnapshots[
                endId
            ];


    if (!snapshot) {
        renderRecollectionHome();
        return;
    }


    const sceneButtons =
        getImportantRecollectionScenes()
            .map(
                scene => {
                    const unlocked =
                        isRecollectionBranchUnlocked(
                            endId,
                            scene.id
                        );


                    if (unlocked) {
                        return `
                            <button
                                class="recollection-card"
                                onclick="renderKnowledgeSelect(${endId}, ${scene.id})"
                            >
                                <b>
                                    Scene ${
                                        scene.id +
                                        1
                                    }
                                </b>

                                ${
                                    scene.sceneTitle
                                }

                                <br>

                                <span class="recollection-note">
                                    この記憶のこの場面から追憶する
                                </span>
                            </button>
                        `;
                    }


                    return `
                        <button
                            class="recollection-card"
                            onclick="unlockBranchFromUI(${endId}, ${scene.id})"
                            ${
                                recollectionProgress
                                    .voiceKeys > 0
                                    ? ""
                                    : "disabled"
                            }
                        >
                            <b>
                                🔒 Scene ${
                                    scene.id +
                                    1
                                }
                            </b>

                            ${
                                scene.sceneTitle
                            }

                            <br>

                            <span class="recollection-note">
                                🔑1個で、
                                この結末のこの分岐地点を
                                永久解放
                            </span>
                        </button>
                    `;
                }
            )
            .join(
                ""
            );


    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37;
                    "
                >
                    ${
                        endingLabels[
                            endId
                        ]
                    }
                </h2>

                <div class="recollection-note">
                    この結末の記憶から、
                    分岐地点を選んでください。
                    <br>
                    解放状態は
                    ENDごと・Sceneごとに保存されます。
                </div>
            </div>

            <div>
                🔑

                <b>
                    ${
                        recollectionProgress
                            .voiceKeys
                    }
                </b>
            </div>
        </div>

        <div class="recollection-grid">
            ${sceneButtons}
        </div>

        <div class="recollection-actions">
            <button
                class="btn-style"
                style="
                    background:#7f8c8d;
                    color:#fff;
                "
                onclick="renderRecollectionHome()"
            >
                戻る
            </button>
        </div>
    `;
}


function unlockBranchFromUI(
    endingId,
    sceneId
) {
    if (
        !unlockRecollectionBranch(
            endingId,
            sceneId
        )
    ) {
        return;
    }


    renderRecollectionSceneSelect(
        endingId
    );
}


// =========================================================
// ヴェイン理解状態選択
// =========================================================

function renderKnowledgeSelect(
    endingId,
    sceneId
) {
    const endId =
        Number(
            endingId
        );

    const id =
        Number(
            sceneId
        );


    const content =
        document.getElementById(
            "recollection-content"
        );


    if (!content) {
        return;
    }


    /*
        解放していない分岐地点を
        直接呼び出すことはできない。
    */
    if (
        !isRecollectionBranchUnlocked(
            endId,
            id
        )
    ) {
        renderRecollectionSceneSelect(
            endId
        );

        return;
    }


    const snapshot =
        recollectionProgress
            .endingSnapshots[
                endId
            ];


    const startIndex =
        getSceneIndexById(
            id
        );


    if (
        !snapshot ||
        startIndex < 0
    ) {
        renderRecollectionHome();
        return;
    }


    const memoryKnowledge =
        new Set(
            getSnapshotKnowledgeBeforeScene(
                snapshot,
                startIndex
            )
        );


    /*
        masteredWordsだけが選択可能。

        未解読語については
        canonicalを表示しない。
    */
    const rows =
        Object.keys(
            wordBank
        )
            .map(
                key => {
                    const mastered =
                        masteredWords
                            .has(
                                key
                            );


                    const checked =
                        mastered &&
                        memoryKnowledge
                            .has(
                                key
                            );


                    if (!mastered) {
                        return `
                            <div
                                class="
                                    knowledge-item
                                    locked
                                "
                            >
                                🔒 ${
                                    wordBank[
                                        key
                                    ].q
                                }

                                <div class="recollection-note">
                                    未解読
                                </div>
                            </div>
                        `;
                    }


                    return `
                        <label
                            class="knowledge-item"
                        >
                            <input
                                type="checkbox"
                                class="recollection-word-check"
                                value="${key}"
                                ${
                                    checked
                                        ? "checked"
                                        : ""
                                }
                            >

                            ${
                                wordBank[
                                    key
                                ].q
                            }

                            ―

                            ${
                                wordBank[
                                    key
                                ].canonical
                            }
                        </label>
                    `;
                }
            )
            .join(
                ""
            );


    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37;
                    "
                >
                    ヴェインの理解状態
                </h2>

                <div class="recollection-note">
                    Scene ${
                        id +
                        1
                    }

                    「${
                        scenario[
                            startIndex
                        ].sceneTitle
                    }」
                    から開始
                </div>
            </div>

            <div>
                解読実績

                <b>
                    ${
                        masteredWords
                            .size
                    }
                    /
                    ${
                        Object.keys(
                            wordBank
                        ).length
                    }
                </b>
            </div>
        </div>

        <p class="recollection-note">
            プレイヤーが一度解読した実績は消えません。
            ここでは、この追憶のヴェインが
            どの言葉を理解している状態かだけを設定します。
            未解読の言葉は選択できません。
        </p>

        <div>
            <button
                class="btn-style"
                onclick="
                    setKnowledgePreset(
                        'memory',
                        ${endId},
                        ${id}
                    )
                "
            >
                この記憶での状態
            </button>

            <button
                class="btn-style"
                onclick="
                    setKnowledgePreset(
                        'zero',
                        ${endId},
                        ${id}
                    )
                "
            >
                初見の状態
            </button>

            <button
                class="btn-style"
                onclick="
                    setKnowledgePreset(
                        'max',
                        ${endId},
                        ${id}
                    )
                "
            >
                現在利用できる最大状態
            </button>
        </div>

        <div class="knowledge-list">
            ${rows}
        </div>

        <div class="recollection-actions">
            <button
                class="btn-style"
                style="
                    background:#d4af37;
                    color:#000;
                "
                onclick="
                    startSelectedRecollection(
                        ${endId},
                        ${id}
                    )
                "
            >
                このヴェインの状態にする
            </button>

            <button
                class="btn-style"
                style="
                    background:#7f8c8d;
                    color:#fff;
                "
                onclick="
                    renderRecollectionSceneSelect(
                        ${endId}
                    )
                "
            >
                戻る
            </button>
        </div>
    `;
}


function getKnowledgeCheckboxes() {
    return Array.from(
        document.querySelectorAll(
            ".recollection-word-check"
        )
    );
}


function setKnowledgeCheckboxes(
    keys
) {
    const target =
        new Set(
            keys
        );


    getKnowledgeCheckboxes()
        .forEach(
            input => {
                input.checked =
                    target.has(
                        input.value
                    );
            }
        );
}


function setKnowledgePreset(
    mode,
    endingId,
    sceneId
) {
    const snapshot =
        recollectionProgress
            .endingSnapshots[
                Number(
                    endingId
                )
            ];


    const startIndex =
        getSceneIndexById(
            sceneId
        );


    if (
        !snapshot ||
        startIndex < 0
    ) {
        return;
    }


    /*
        そのEND snapshotの
        そのScene開始時点と同じ状態。
    */
    if (
        mode ===
        "memory"
    ) {
        setKnowledgeCheckboxes(
            getSnapshotKnowledgeBeforeScene(
                snapshot,
                startIndex
            )
        );

        return;
    }


    /*
        解読実績そのものは消さず、
        現在世界線のヴェインだけ
        0語理解状態へする。
    */
    if (
        mode ===
        "zero"
    ) {
        setKnowledgeCheckboxes(
            []
        );

        return;
    }


    /*
        プレイヤーがこれまでに
        解読した全単語を
        現在世界線へ反映する。
    */
    if (
        mode ===
        "max"
    ) {
        setKnowledgeCheckboxes(
            Array.from(
                masteredWords
            )
        );
    }
}


function startSelectedRecollection(
    endingId,
    sceneId
) {
    const keys =
        getKnowledgeCheckboxes()
            .filter(
                input => {
                    return (
                        input.checked
                    );
                }
            )
            .map(
                input => {
                    return (
                        input.value
                    );
                }
            );


    startRecollection(
        endingId,
        sceneId,
        keys
    );
}


// =========================================================
// END7
// =========================================================

/*
    END7は通常END判定からではなく、
    「最後の追憶」専用入口からだけ表示する。
*/
function startFinalRecollectionFromUI() {
    if (
        !recollectionProgress
            .finalRecollectionUnlocked
    ) {
        return;
    }


    if (
        typeof window
            .showSpecialEnding ===
            "function"
    ) {
        closeRecollection();


        /*
            タイトル画面から
            最後の追憶を開いた場合でも、
            END表示領域を見える状態にする。
        */
        const gameContainer =
            document.getElementById(
                "game-container"
            );


        if (gameContainer) {
            gameContainer.style.display =
                "flex";
        }


        const deviceOverlay =
            document.getElementById(
                "device-check-overlay"
            );


        if (deviceOverlay) {
            deviceOverlay.style.display =
                "none";
        }


        window.showSpecialEnding(
            7
        );


        return;
    }


    /*
        endings.js側が
        まだ接続されていない場合のみ。
    */
    alert(
        "最後の追憶は解放されています。END7表示処理を接続すると使用できます。"
    );
}
