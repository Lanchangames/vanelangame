
/*
    声を聴かせて、ランスロット！
    recollection.js

    追憶、スナップショット、
    通常END1〜6、最後の追憶

    game.js:
        opts
        insightOpts
        misreadOpts

    index.html:
        selectedAnswers
        sceneChoiceRecords
        vaneKnownWords

    既存のlocalStorageキーは変更しない。
*/

const RECOLLECTION_STORAGE_KEY =
    "vane_recollection_v4";

const RECOLLECTION_SCHEMA_VERSION = 7;

let runMode = "story";

let recollectionBaseEndingId = null;

let recollectionOpenedFromGame = false;

let recollectionKnowledgePreset = "memory";

const recollectionSceneTitles = {
    4: "復帰訓練",
    9: "小さな事故",
    12: "必ず戻る",
    13: "一人で抱えるな",
    14: "遠ざける言葉",
    15: "勝手に黙るな",
    16: "口にした弱さ",
    17: "ほどける緊張",
    19: "声を聴かせて"
};


// =========================================================
// 基本ヘルパー
// =========================================================

function getImportantRecollectionScenes() {
    return scenario.filter(scene =>
        (scene.opts || []).some(
            option => option.endingImpact === true
        )
    );
}


function getSceneIndexById(sceneId) {
    return scenario.findIndex(
        scene => scene.id === Number(sceneId)
    );
}


function isValidNormalEndingId(endingId) {
    const id = Number(endingId);

    return (
        Number.isInteger(id) &&
        id >= 1 &&
        id <= 6
    );
}


function isValidImportantSceneId(sceneId) {
    return getImportantRecollectionScenes().some(
        scene => scene.id === Number(sceneId)
    );
}


function getRecollectionBranchKey(
    endingId,
    sceneId
) {
    return (
        `end${Number(endingId)}` +
        `_scene${Number(sceneId)}`
    );
}


function getRecollectionSceneTitle(sceneId) {
    return (
        recollectionSceneTitles[Number(sceneId)] ||
        `Scene ${Number(sceneId) + 1}`
    );
}


function getCurrentMasteredWordCount() {
    /*
        プレイヤー全体の解読実績。

        現在世界線の
        vaneKnownWordsとは区別する。
    */

    if (
        typeof getMasteredWordSet === "function"
    ) {
        return getMasteredWordSet().size;
    }

    return masteredWords instanceof Set
        ? masteredWords.size
        : 0;
}


// =========================================================
// 3種類の選択肢の共通検索
// =========================================================

function getRecollectionOptions(scene) {
    if (!scene) {
        return [];
    }

    return [
        ...(scene.opts || []),
        ...(scene.insightOpts || []),
        ...(scene.misreadOpts || [])
    ];
}


function getRecollectionOption(
    scene,
    optionId
) {
    return (
        getRecollectionOptions(scene).find(
            option => option.id === optionId
        ) || null
    );
}


function getRecollectionOptionKind(
    scene,
    optionId
) {
    if (
        (scene?.misreadOpts || []).some(
            option => option.id === optionId
        )
    ) {
        return "misread";
    }

    if (
        (scene?.insightOpts || []).some(
            option => option.id === optionId
        )
    ) {
        return "insight";
    }

    if (
        (scene?.opts || []).some(
            option => option.id === optionId
        )
    ) {
        return "base";
    }

    return null;
}


/*
    古いsnapshotで、
    選択肢本文が保存されていた場合も
    現在のoption.idへ変換する。

    3種類の選択肢をすべて検索する。
*/
function normalizeSavedAnswer(
    optionValue,
    sceneIndex
) {
    if (!optionValue) {
        return null;
    }

    const scene = scenario[sceneIndex];

    if (!scene) {
        return null;
    }

    const value =
        typeof optionValue === "object"
            ? (
                optionValue.id ||
                optionValue.t
            )
            : optionValue;

    const options =
        getRecollectionOptions(scene);

    const found =
        options.find(
            option => option.id === value
        ) ||
        options.find(
            option => option.t === value
        );

    return found
        ? found.id
        : null;
}


/*
    選択時点の履歴を正規化する。

    旧データに記録されていない
    誤読履歴は作らない。

    IDにunknownやmisreadと
    書かれているかどうかでは判定しない。
*/
function normalizeSceneChoiceRecord(
    raw,
    sceneIndex,
    savedOptionId
) {
    if (
        !raw ||
        typeof raw !== "object" ||
        !savedOptionId
    ) {
        return null;
    }

    const scene = scenario[sceneIndex];

    if (
        !scene ||
        raw.optionId !== savedOptionId
    ) {
        return null;
    }

    const option =
        getRecollectionOption(
            scene,
            savedOptionId
        );

    if (!option) {
        return null;
    }

    const realKind =
        getRecollectionOptionKind(
            scene,
            savedOptionId
        );

    /*
        履歴の種類と、
        現在の選択肢定義が
        一致する場合だけ復元する。
    */
    if (raw.kind !== realKind) {
        return null;
    }

    const states =
        raw.wordStates &&
        typeof raw.wordStates === "object"
            ? raw.wordStates
            : {};

    const guesses =
        raw.guesses &&
        typeof raw.guesses === "object"
            ? raw.guesses
            : {};

    const wordStates = {};
    const savedGuesses = {};

    for (const item of scene.words || []) {
        const key = item.key;

        if (
            !Object.prototype.hasOwnProperty.call(
                wordBank,
                key
            )
        ) {
            continue;
        }

        if (
            [
                "correct",
                "wrong",
                "blank"
            ].includes(states[key])
        ) {
            wordStates[key] = states[key];
        }

        if (
            typeof guesses[key] === "string"
        ) {
            savedGuesses[key] = guesses[key];
        }
    }

    return {
        sceneId: scene.id,

        optionId: savedOptionId,

        kind: realKind,

        wordStates,

        guesses: savedGuesses,

        misreadKey:
            realKind === "misread"
                ? (raw.misreadKey || null)
                : null,

        route: option.route || null
    };
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

        /*
            内部名voiceKeysは維持する。

            画面上では
            「追憶の欠片」として扱う。
        */
        voiceKeys:
            0,

        /*
            追憶から通常ENDへ
            一度再到達するとtrue。

            以降は欠片を消費せず
            全分岐地点を利用できる。
        */
        recollectionUnlimited:
            false,

        /*
            END × Sceneごとの
            永久解放記録。

            例:
                end3_scene12
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


// =========================================================
// snapshotの正規化
// =========================================================

function normalizeEndingSnapshot(snapshot) {
    if (
        !snapshot ||
        typeof snapshot !== "object"
    ) {
        return null;
    }

    const rawAnswers =
        Array.isArray(snapshot.selectedAnswers)
            ? snapshot.selectedAnswers
            : [];

    const selected =
        scenario.map(
            (_, index) =>
                normalizeSavedAnswer(
                    rawAnswers[index],
                    index
                )
        );

    const rawRecords =
        Array.isArray(snapshot.sceneChoiceRecords)
            ? snapshot.sceneChoiceRecords
            : [];

    return {
        ...snapshot,

        selectedAnswers:
            selected,

        /*
            旧snapshotには
            sceneChoiceRecordsがない。

            その場合はnullのまま
            引き継ぐ。
        */
        sceneChoiceRecords:
            scenario.map(
                (_, index) =>
                    normalizeSceneChoiceRecord(
                        rawRecords[index],
                        index,
                        selected[index]
                    )
            ),

        vaneKnownWords:
            Array.isArray(snapshot.vaneKnownWords)
                ? [
                    ...new Set(
                        snapshot.vaneKnownWords.filter(
                            key => wordBank[key]
                        )
                    )
                ]
                : [],

        vaneUnderstoodAt:
            snapshot.vaneUnderstoodAt &&
            typeof snapshot.vaneUnderstoodAt === "object"
                ? {
                    ...snapshot.vaneUnderstoodAt
                }
                : {},

        /*
            最終時点のノート。

            過去シーン復元時には
            直接使用しない。

            未来の答えの逆流を
            防止するため。
        */
        userDict:
            snapshot.userDict &&
            typeof snapshot.userDict === "object"
                ? {
                    ...snapshot.userDict
                }
                : {},

        clearedAt:
            snapshot.clearedAt || null
    };
}


// =========================================================
// 進行データの正規化
// =========================================================

function normalizeRecollectionProgress(raw) {
    const base =
        getDefaultRecollectionProgress();

    const src =
        raw &&
        typeof raw === "object"
            ? raw
            : {};

    const collectedNormalEndings = [
        ...new Set(
            (
                Array.isArray(
                    src.collectedNormalEndings
                )
                    ? src.collectedNormalEndings
                    : []
            )
                .map(Number)
                .filter(isValidNormalEndingId)
        )
    ];

    const endingSnapshots = {};

    if (
        src.endingSnapshots &&
        typeof src.endingSnapshots === "object"
    ) {
        for (
            const key of Object.keys(
                src.endingSnapshots
            )
        ) {
            const id = Number(key);

            if (
                !isValidNormalEndingId(id)
            ) {
                continue;
            }

            const normalized =
                normalizeEndingSnapshot(
                    src.endingSnapshots[key]
                );

            if (normalized) {
                endingSnapshots[id] =
                    normalized;
            }
        }
    }

    const branches = new Set();

    /*
        現行形式の
        unlockedBranchesを復元する。
    */
    const rawBranches =
        Array.isArray(src.unlockedBranches)
            ? src.unlockedBranches
            : [];

    for (const rawBranch of rawBranches) {
        const match =
            String(rawBranch).match(
                /^end([1-6])_scene(-?\d+)$/
            );

        if (!match) {
            continue;
        }

        const endId =
            Number(match[1]);

        const sceneId =
            Number(match[2]);

        if (
            isValidImportantSceneId(sceneId)
        ) {
            branches.add(
                getRecollectionBranchKey(
                    endId,
                    sceneId
                )
            );
        }
    }

    /*
        旧v4のunlockedSceneIdsから移行。

        旧版ではシーン解放が
        ENDをまたいで共通だった。

        その時点で所持していたENDへ
        アクセス権を引き継ぐ。
    */
    const oldSceneIds =
        Array.isArray(src.unlockedSceneIds)
            ? src.unlockedSceneIds
                .map(Number)
                .filter(
                    isValidImportantSceneId
                )
            : [];

    const migratedEndings =
        new Set([
            ...collectedNormalEndings,
            ...Object.keys(
                endingSnapshots
            ).map(Number)
        ]);

    for (const sceneId of oldSceneIds) {
        for (const endId of migratedEndings) {
            branches.add(
                getRecollectionBranchKey(
                    endId,
                    sceneId
                )
            );
        }
    }

    const numericKeys =
        Number(src.voiceKeys);

    const voiceKeys =
        Number.isFinite(numericKeys)
            ? Math.max(
                0,
                Math.floor(numericKeys)
            )
            : 0;

    /*
        END7解放条件は従来どおり。

        通常ENDを3種類以上回収し、
        全15語の解読実績を得る。
    */
    const finalRecollectionUnlocked =
        collectedNormalEndings.length >= 3 &&
        getCurrentMasteredWordCount() ===
            Object.keys(wordBank).length;

    return {
        ...base,

        version:
            RECOLLECTION_SCHEMA_VERSION,

        gameCleared:
            Boolean(src.gameCleared) ||
            collectedNormalEndings.length > 0,

        voiceKeys,

        recollectionUnlimited:
            Boolean(src.recollectionUnlimited),

        unlockedBranches:
            [...branches],

        collectedNormalEndings,

        endingSnapshots,

        finalRecollectionUnlocked
    };
}


// =========================================================
// セーブ読み込み
// =========================================================

function loadRecollectionProgress() {
    let saved = null;

    try {
        saved =
            JSON.parse(
                localStorage.getItem(
                    RECOLLECTION_STORAGE_KEY
                ) || "null"
            );
    }
    catch (e) {
        saved = null;
    }

    if (
        saved &&
        typeof saved === "object"
    ) {
        const normalized =
            normalizeRecollectionProgress(saved);

        localStorage.setItem(
            RECOLLECTION_STORAGE_KEY,
            JSON.stringify(normalized)
        );

        return normalized;
    }

    /*
        追憶セーブが無い場合のみ
        旧コレクションから移行する。

        存在しないsnapshotは
        作り出さない。
    */
    const migrated =
        getDefaultRecollectionProgress();

    let oldCollection = [];

    try {
        oldCollection =
            JSON.parse(
                localStorage.getItem(
                    "vane_collection_v3"
                ) || "[]"
            );
    }
    catch (e) {
        oldCollection = [];
    }

    migrated.collectedNormalEndings = [
        ...new Set(
            (
                Array.isArray(oldCollection)
                    ? oldCollection
                    : []
            )
                .map(Number)
                .filter(isValidNormalEndingId)
        )
    ];

    if (
        migrated.collectedNormalEndings.length > 0
    ) {
        migrated.gameCleared = true;

        /*
            初回クリア済みの場合、
            欠片3個を付与した状態で移行。
        */
        migrated.voiceKeys = 3;
    }

    const normalized =
        normalizeRecollectionProgress(
            migrated
        );

    localStorage.setItem(
        RECOLLECTION_STORAGE_KEY,
        JSON.stringify(normalized)
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
// END snapshot
// =========================================================

/*
    指定シーン開始時点で
    ヴェインが理解していた語を返す。

    同じシーンで理解した語は
    まだ含めない。
*/
function getSnapshotKnowledgeBeforeScene(
    snapshot,
    startIndex
) {
    if (!snapshot) {
        return [];
    }

    const understoodAt =
        snapshot.vaneUnderstoodAt || {};

    return Object.keys(wordBank).filter(
        key => {
            if (
                !Object.prototype
                    .hasOwnProperty.call(
                        understoodAt,
                        key
                    )
            ) {
                return false;
            }

            const at =
                Number(understoodAt[key]);

            return (
                Number.isFinite(at) &&
                at < startIndex
            );
        }
    );
}


/*
    現在の世界線を
    END用snapshotへ変換する。

    各場面の理解状態と
    実際に選んだ返答を保存する。
*/
function snapshotCurrentRun() {
    const selected =
        scenario.map(
            (_, index) =>
                normalizeSavedAnswer(
                    selectedAnswers[index],
                    index
                )
        );

    const records =
        scenario.map(
            (_, index) =>
                normalizeSceneChoiceRecord(
                    Array.isArray(
                        sceneChoiceRecords
                    )
                        ? sceneChoiceRecords[index]
                        : null,

                    index,

                    selected[index]
                )
        );

    return {
        selectedAnswers:
            selected,

        sceneChoiceRecords:
            records,

        vaneKnownWords:
            [...vaneKnownWords],

        vaneUnderstoodAt: {
            ...vaneUnderstoodAt
        },

        /*
            終了時点のノート。

            追憶時に直接
            過去へコピーしない。
        */
        userDict: {
            ...userDict
        },

        clearedAt:
            Date.now()
    };
}


// =========================================================
// END進行・追憶報酬
// =========================================================

function updateFinalRecollectionUnlock() {
    const wasUnlocked =
        recollectionProgress
            .finalRecollectionUnlocked;

    recollectionProgress
        .finalRecollectionUnlocked =
            recollectionProgress
                .collectedNormalEndings
                .length >= 3 &&
            getCurrentMasteredWordCount() ===
                Object.keys(wordBank).length;

    return (
        !wasUnlocked &&
        recollectionProgress
            .finalRecollectionUnlocked
    );
}


/*
    通常END1〜6到達時に
    endings.jsから呼び出す。

    初回クリア:
        欠片3個を獲得。

    追憶から通常ENDへ再到達:
        追憶完全解放。

    ENDごとに
    最初のsnapshotを保持する。
*/
function recordEndingProgress(endingId) {
    const id =
        Number(endingId);

    const empty = {
        isFirstClear: false,
        isNewEnding: false,
        keysGained: 0,
        recollectionUnlimitedUnlockedNow: false,
        finalRecollectionUnlockedNow: false
    };

    if (
        !isValidNormalEndingId(id)
    ) {
        return empty;
    }

    const isFirstClear =
        !recollectionProgress.gameCleared;

    const alreadyCollected =
        recollectionProgress
            .collectedNormalEndings
            .includes(id);

    let keysGained = 0;

    if (isFirstClear) {
        recollectionProgress
            .gameCleared = true;

        recollectionProgress
            .voiceKeys += 3;

        keysGained = 3;
    }

    let recollectionUnlimitedUnlockedNow =
        false;

    if (
        !isFirstClear &&
        runMode === "recollection" &&
        !recollectionProgress
            .recollectionUnlimited
    ) {
        recollectionProgress
            .recollectionUnlimited = true;

        recollectionUnlimitedUnlockedNow =
            true;
    }

    if (!alreadyCollected) {
        recollectionProgress
            .collectedNormalEndings
            .push(id);
    }

    /*
        同じENDを再取得しても
        基準世界線は上書きしない。
    */
    if (
        !recollectionProgress
            .endingSnapshots[id]
    ) {
        recollectionProgress
            .endingSnapshots[id] =
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

        recollectionUnlimitedUnlockedNow,

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
    if (
        recollectionProgress
            .recollectionUnlimited
    ) {
        return true;
    }

    return recollectionProgress
        .unlockedBranches
        .includes(
            getRecollectionBranchKey(
                endingId,
                sceneId
            )
        );
}


/*
    欠片1個を使用して
    END × Sceneの分岐地点を解放する。

    同じ分岐地点の再利用では
    追加消費しない。
*/
function unlockRecollectionBranch(
    endingId,
    sceneId
) {
    const endId =
        Number(endingId);

    const id =
        Number(sceneId);

    if (
        !isValidNormalEndingId(endId) ||
        !isValidImportantSceneId(id)
    ) {
        return false;
    }

    if (
        !recollectionProgress
            .endingSnapshots[endId]
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
        recollectionProgress.voiceKeys <= 0
    ) {
        return false;
    }

    recollectionProgress.voiceKeys--;

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
    開始シーンより前の
    暗号登場回数を復元する。
*/
function rebuildSeenWordsBefore(startIndex) {
    wordSeenCounts = {};

    seenSceneIds = new Set();

    for (
        let i = 0;
        i < startIndex;
        i++
    ) {
        registerSceneWords(i);
    }
}


/*
    記憶継承によって
    選択された理解済み単語を反映する。

    vaneKnownWords ⊆ masteredWords

    の関係を保つ。
*/
function applyRecollectionKnowledge(
    requestedKeys,
    snapshot,
    startIndex
) {
    const requested =
        Array.isArray(requestedKeys)
            ? requestedKeys
            : Array.from(
                requestedKeys || []
            );

    const allowed = [
        ...new Set(requested)
    ].filter(
        key =>
            Object.prototype
                .hasOwnProperty.call(
                    wordBank,
                    key
                ) &&
            masteredWords.has(key)
    );

    vaneKnownWords =
        new Set(allowed);

    vaneUnderstoodAt = {};

    const oldAt =
        snapshot?.vaneUnderstoodAt || {};

    allowed.forEach(
        key => {
            const recorded =
                Object.prototype
                    .hasOwnProperty.call(
                        oldAt,
                        key
                    )
                    ? Number(oldAt[key])
                    : NaN;

            vaneUnderstoodAt[key] =
                Number.isFinite(recorded) &&
                recorded < startIndex
                    ? recorded
                    : startIndex - 1;
        }
    );

    Object.keys(wordBank).forEach(
        key => {
            userDict[key] =
                vaneKnownWords.has(key)
                    ? wordBank[key].canonical
                    : "";

            renderDictEntryState(key);
        }
    );

    updateIntelUI();

    return allowed;
}


/*
    過去のノートの仮説を復元する。

    最終時点のuserDictを直接戻すと、
    未来に解いた言葉が
    過去へ逆流してしまう。

    そのため、
    各シーンで実際に返答した時点の
    guessesだけを時系列で再生する。
*/
function restoreNotebookGuessesBeforeScene(
    snapshot,
    startIndex
) {
    /*
        「初見の状態」なら
        過去の推測も持ち込まない。
    */
    if (
        recollectionKnowledgePreset === "zero"
    ) {
        return;
    }

    const records =
        Array.isArray(
            snapshot?.sceneChoiceRecords
        )
            ? snapshot.sceneChoiceRecords
            : [];

    for (
        let i = 0;
        i < startIndex;
        i++
    ) {
        const record = records[i];

        if (
            !record ||
            !record.guesses
        ) {
            continue;
        }

        for (
            const [key, guess]
            of Object.entries(
                record.guesses
            )
        ) {
            if (
                !wordBank[key] ||
                vaneKnownWords.has(key)
            ) {
                continue;
            }

            if (
                typeof guess === "string"
            ) {
                userDict[key] = guess;
            }
        }
    }

    /*
        理解済み語だけは
        常に正しい基本形を優先する。
    */
    for (const key of vaneKnownWords) {
        userDict[key] =
            wordBank[key].canonical;
    }

    if (activeDictKey) {
        renderActiveDictEntry();
    }

    renderWordList();
}


// =========================================================
// END画面からのゲームUI復元
// =========================================================

/*
    endings.jsは
    #display.innerHTMLを
    END本文に置き換える。

    追憶開始時は
    現行index.htmlと同じ
    会話用DOMを復元する。

    face-emoji等の
    旧要素は使用しない。
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
            "chara-header"
        ) &&
        document.getElementById(
            "speaker-name"
        ) &&
        document.getElementById(
            "message-text"
        ) &&
        document.getElementById(
            "vane-thought-block"
        ) &&
        document.getElementById(
            "vane-thought-text"
        ) &&
        document.getElementById(
            "story-block"
        ) &&
        document.getElementById(
            "story-text"
        ) &&
        document.getElementById(
            "resolution-block"
        ) &&
        document.getElementById(
            "resolution-text"
        )
    ) {
        return;
    }

    display.innerHTML = `
        <div id="chara-header">
            <span id="speaker-name">
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
                VANE
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
        Number(baseEndingId);

    const sceneId =
        Number(startSceneId);

    if (
        !isValidNormalEndingId(
            endingId
        ) ||
        !isValidImportantSceneId(
            sceneId
        )
    ) {
        return false;
    }

    const snapshot =
        recollectionProgress
            .endingSnapshots[
                endingId
            ];

    if (
        !snapshot ||
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

    if (startIndex < 0) {
        return false;
    }

    /*
        基準ENDの履歴を読み込む。
    */
    const savedAnswers =
        Array.isArray(
            snapshot.selectedAnswers
        )
            ? snapshot.selectedAnswers
            : [];

    const savedRecords =
        Array.isArray(
            snapshot.sceneChoiceRecords
        )
            ? snapshot.sceneChoiceRecords
            : [];

    /*
        以降の履歴は
        新しい世界線として初期化する。
    */
    selectedAnswers =
        new Array(
            scenario.length
        ).fill(null);

    sceneChoiceRecords =
        new Array(
            scenario.length
        ).fill(null);

    /*
        開始地点より前の選択だけ
        元のsnapshotから継承する。
    */
    for (
        let i = 0;
        i < startIndex;
        i++
    ) {
        const answer =
            normalizeSavedAnswer(
                savedAnswers[i],
                i
            );

        selectedAnswers[i] = answer;

        sceneChoiceRecords[i] =
            normalizeSceneChoiceRecord(
                savedRecords[i],
                i,
                answer
            );
    }

    runMode = "recollection";

    recollectionBaseEndingId =
        endingId;

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

    pendingChoiceContext =
        null;

    activeDictKey =
        null;

    mainViewMode =
        "play";

    /*
        END画面から移動した場合、
        会話用DOMを復元する。
    */
    restoreGameDisplayShell();

    /*
        ノートを初期化する。

        masteredWordsは
        プレイヤー全体の解読実績なので
        消去しない。
    */
    initDict({});

    /*
        今回の追憶で選択した
        ヴェインの理解状態を適用する。
    */
    applyRecollectionKnowledge(
        requestedKnowledgeKeys,
        snapshot,
        startIndex
    );

    /*
        元の記憶での推測を
        当時の履歴から復元する。

        最終ノートの答えを
        直接持ち込まない。
    */
    restoreNotebookGuessesBeforeScene(
        snapshot,
        startIndex
    );

    /*
        分岐開始以前の
        暗号遭遇履歴を復元する。
    */
    rebuildSeenWordsBefore(
        startIndex
    );

    /*
        現在のシーンも
        遭遇済みとして登録する。
    */
    registerSceneWords(
        startIndex
    );

    /*
        過去の選択から
        lovePoints、axis、routeを
        再集計する。

        誤読返答は
        sceneChoiceRecordsで管理する。
    */
    rebuildRunState();

    /*
        追憶・タイトル・チュートリアル等の
        オーバーレイを閉じる。
    */
    for (
        const id of [
            "recollection-overlay",
            "device-check-overlay",
            "intro-overlay",
            "tutorial-overlay",
            "load-overlay"
        ]
    ) {
        const element =
            document.getElementById(id);

        if (element) {
            element.style.display =
                "none";
        }
    }

    const gameContainer =
        document.getElementById(
            "game-container"
        );

    if (gameContainer) {
        gameContainer.style.display =
            "flex";
    }

    recollectionOpenedFromGame =
        true;

    /*
        過去LOGを表示していた状態でも
        会話タブへ切り替える。
    */
    switchMainView("play");

    renderTabs();

    updateUI(true);

    const display =
        document.getElementById(
            "display"
        );

    if (display) {
        display.scrollTop = 0;
    }

    return true;
}


// =========================================================
// 通常END判定
// =========================================================

/*
    新仕様：

    言葉の理解：
        vaneKnownWords

    返答傾向：
        routeCounts

    誤読返答：
        sceneChoiceRecords

    この3つを別々に評価する。

    interpretationCountsは使用しない。

    END7は絶対にここで返さない。
*/

/*
    END判定の初期閾値。

    テストプレイ後に
    この数字を調整できる。
*/
const ENDING_RULES =
    Object.freeze({
        /*
            END5：

            実際の誤読返答を
            3回以上選んだ。
        */
        misreadRepliesForPudding: 3,

        /*
            END4：

            理解が確定した語が
            3語以下。
        */
        maximumUnderstoodForSilence: 3,

        /*
            未理解が12語以上。
        */
        minimumUnresolvedForSilence: 12
    });


// =========================================================
// 実際の誤読返答回数
// =========================================================

function countActualMisreadReplies() {
    if (
        !Array.isArray(
            sceneChoiceRecords
        )
    ) {
        return 0;
    }

    let count = 0;

    sceneChoiceRecords.forEach(
        (record, index) => {
            if (
                !record ||
                record.kind !== "misread"
            ) {
                return;
            }

            const scene =
                scenario[index];

            /*
                実際にmisreadOptsから
                選ばれたものか確認する。
            */
            const option =
                (
                    scene?.misreadOpts || []
                ).find(
                    option =>
                        option.id ===
                            record.optionId &&
                        option.misreadImpact ===
                            true
                );

            if (
                !option ||
                selectedAnswers[index] !==
                    option.id
            ) {
                return;
            }

            const key =
                option.trigger?.key;

            if (
                !key ||
                record.misreadKey !== key
            ) {
                return;
            }

            /*
                当時の理解状態が
                wrongだったことを確認。
            */
            if (
                record.wordStates?.[key] !==
                "wrong"
            ) {
                return;
            }

            const guess =
                record.guesses?.[key];

            if (
                typeof guess !== "string" ||
                !normalizeGuess(guess)
            ) {
                return;
            }

            /*
                正答だった場合は
                誤読に数えない。
            */
            if (
                isAcceptedGuess(
                    key,
                    guess
                )
            ) {
                return;
            }

            /*
                当時の誤答が
                trigger.guessesに
                実際に一致するか確認する。
            */
            const matches =
                (
                    option.trigger?.guesses ||
                    []
                ).some(
                    candidate =>
                        normalizeGuess(candidate) ===
                        normalizeGuess(guess)
                );

            if (!matches) {
                return;
            }

            count++;
        }
    );

    return count;
}


// =========================================================
// 同点ルートの決定
// =========================================================

/*
    routeが同数の場合は、
    最後に選んだ該当ルートを優先する。

    3種類の選択肢すべてを検索する。
*/
function getLatestTiedRoute(tiedRoutes) {
    for (
        let i = scenario.length - 1;
        i >= 0;
        i--
    ) {
        const option =
            getRecollectionOption(
                scenario[i],
                selectedAnswers[i]
            );

        if (
            option?.route &&
            tiedRoutes.has(option.route)
        ) {
            return option.route;
        }
    }

    /*
        全ルート0点など、
        該当する選択肢がない場合。
    */
    return "twin";
}


// =========================================================
// END1〜6の決定
// =========================================================

function determineNormalEndingId() {
    /*
        今の世界線の選択だけで
        ルート点を再計算する。
    */
    rebuildRunState();

    const total =
        Object.keys(wordBank).length;

    const understood =
        [...vaneKnownWords].filter(
            key => wordBank[key]
        ).length;

    const unresolved =
        total - understood;

    const misreadReplies =
        countActualMisreadReplies();


    // -----------------------------------------------------
    // END1　暁光の誓い
    // -----------------------------------------------------

    /*
        現在世界線で
        全15語を理解している。

        masteredWordsでは判定しない。
    */
    if (
        understood === total
    ) {
        return 1;
    }


    // -----------------------------------------------------
    // END5　プリンの迷宮
    // -----------------------------------------------------

    /*
        実際の誤読返答を
        複数回選んだ場合。

        ノートに誤答が残っている
        だけでは到達しない。
    */
    if (
        misreadReplies >=
        ENDING_RULES
            .misreadRepliesForPudding
    ) {
        return 5;
    }


    // -----------------------------------------------------
    // END4　静寂のあとで
    // -----------------------------------------------------

    /*
        大半の言葉を理解できないまま
        最後まで会話を続けた場合。

        END5は上で判定済み。
    */
    if (
        understood <=
            ENDING_RULES
                .maximumUnderstoodForSilence &&
        unresolved >=
            ENDING_RULES
                .minimumUnresolvedForSilence
    ) {
        return 4;
    }


    // -----------------------------------------------------
    // END2 / END3 / END6
    // -----------------------------------------------------

    /*
        残りはヴェインの返答傾向で判定。

        どの言葉を理解したかとは
        独立している。
    */
    const max =
        Math.max(
            routeCounts.twin || 0,
            routeCounts.glass || 0,
            routeCounts.resonance || 0
        );

    const tied =
        new Set(
            [
                "twin",
                "glass",
                "resonance"
            ].filter(
                route =>
                    (
                        routeCounts[route] ||
                        0
                    ) === max
            )
        );

    const winner =
        getLatestTiedRoute(tied);

    if (
        winner === "glass"
    ) {
        return 3;
    }

    if (
        winner === "resonance"
    ) {
        return 6;
    }

    return 2;
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
        document.createElement("style");

    style.textContent = `
        #recollection-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.98);
            z-index: 160;
            display: none;
            justify-content: center;
            align-items: center;
            color: #ecf0f1;
        }

        #recollection-panel {
            width: min(900px,92vw);
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
                    minmax(220px,1fr)
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
            opacity: .45;
            cursor: default;
        }

        .recollection-note {
            color: #aeb6bf;
            font-size: .9em;
            line-height: 1.7;
        }

        .knowledge-list {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(180px,1fr)
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
            opacity: .4;
        }

        .recollection-actions {
            margin-top: 22px;
        }
    `;

    document.head.appendChild(style);

    const overlay =
        document.createElement("div");

    overlay.id =
        "recollection-overlay";

    overlay.innerHTML = `
        <div id="recollection-panel">
            <div id="recollection-content">
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
}


const endingLabels = {
    1: "💍 暁光の誓い",
    2: "🤝 不滅の双璧",
    3: "⌛ 硝子の距離",
    4: "❄️ 静寂のあとで",
    5: "🍮 プリンの迷宮",
    6: "🌌 魂の共鳴"
};


// =========================================================
// 追憶画面を開く・閉じる
// =========================================================

function openRecollection() {
    ensureRecollectionOverlay();

    const gameContainer =
        document.getElementById(
            "game-container"
        );

    /*
        元の画面がゲーム中か
        タイトル画面かを記録。
    */
    recollectionOpenedFromGame =
        !!(
            gameContainer &&
            window.getComputedStyle(
                gameContainer
            ).display !== "none"
        );

    /*
        追憶セーブを
        最新状態へ同期する。
    */
    recollectionProgress =
        loadRecollectionProgress();

    /*
        プレイヤー全体の
        解読実績を同期する。
    */
    if (
        typeof getMasteredWordSet ===
        "function"
    ) {
        masteredWords =
            getMasteredWordSet();
    }

    document.getElementById(
        "recollection-overlay"
    ).style.display = "flex";

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
        タイトル画面から開いていた場合、
        環境確認画面へ戻す。
    */
    if (
        !recollectionOpenedFromGame
    ) {
        const device =
            document.getElementById(
                "device-check-overlay"
            );

        if (device) {
            device.style.display =
                "flex";
        }
    }
}


// =========================================================
// 追憶ホーム
// =========================================================

function renderRecollectionHome() {
    const content =
        document.getElementById(
            "recollection-content"
        );

    if (!content) {
        return;
    }

    const endings = [
        ...recollectionProgress
            .collectedNormalEndings
    ].sort(
        (a, b) => a - b
    );

    const endingButtons =
        endings.map(
            id => {
                const available =
                    !!recollectionProgress
                        .endingSnapshots[id];

                return `
                    <button
                        class="recollection-card"
                        ${
                            available
                                ? ""
                                : "disabled"
                        }
                        onclick="
                            renderRecollectionSceneSelect(${id})
                        "
                    >
                        <b>
                            ${
                                endingLabels[id] ||
                                `END ${id}`
                            }
                        </b>

                        <br>

                        <span class="recollection-note">
                            ${
                                available
                                    ? "この記憶から別の可能性を辿る"
                                    : "追憶用の記録がありません。新形式で一度この結末へ到達すると使用できます。"
                            }
                        </span>
                    </button>
                `;
            }
        ).join("");

    const finalButton =
        recollectionProgress
            .finalRecollectionUnlocked
            ? `
                <button
                    class="recollection-card"
                    onclick="
                        startFinalRecollectionFromUI()
                    "
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

    const access =
        recollectionProgress
            .recollectionUnlimited
            ? "✨ 追憶完全解放"
            : `
                ✨ 追憶の欠片
                <b>
                    ${recollectionProgress.voiceKeys}
                </b>
            `;

    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37
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
                ${access}
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
                    color:#fff
                "
                onclick="closeRecollection()"
            >
                閉じる
            </button>
        </div>
    `;
}


// =========================================================
// 分岐地点選択
// =========================================================

function renderRecollectionSceneSelect(endingId) {
    const endId =
        Number(endingId);

    const content =
        document.getElementById(
            "recollection-content"
        );

    if (!content) {
        return;
    }

    if (
        !recollectionProgress
            .endingSnapshots[endId]
    ) {
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

                    const title =
                        getRecollectionSceneTitle(
                            scene.id
                        );

                    if (unlocked) {
                        return `
                            <button
                                class="recollection-card"
                                onclick="
                                    renderKnowledgeSelect(
                                        ${endId},
                                        ${scene.id}
                                    )
                                "
                            >
                                <b>
                                    Scene ${
                                        scene.id + 1
                                    }
                                </b>

                                ${title}

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
                            onclick="
                                unlockBranchFromUI(
                                    ${endId},
                                    ${scene.id}
                                )
                            "
                            ${
                                recollectionProgress
                                    .voiceKeys > 0
                                    ? ""
                                    : "disabled"
                            }
                        >
                            <b>
                                🔒 Scene ${
                                    scene.id + 1
                                }
                            </b>

                            ${title}

                            <br>

                            <span class="recollection-note">
                                ✨追憶の欠片1個で、
                                この結末のこの分岐地点を
                                永久解放
                            </span>
                        </button>
                    `;
                }
            ).join("");

    const access =
        recollectionProgress
            .recollectionUnlimited
            ? "✨ 追憶完全解放"
            : `
                ✨ 追憶の欠片
                <b>
                    ${
                        recollectionProgress
                            .voiceKeys
                    }
                </b>
            `;

    const note =
        recollectionProgress
            .recollectionUnlimited
            ? `
                この結末の記憶から、
                分岐地点を選んでください。

                <br>

                追憶は完全解放されています。
                すべての分岐地点を自由に辿れます。
            `
            : `
                この結末の記憶から、
                分岐地点を選んでください。

                <br>

                解放状態は
                ENDごと・Sceneごとに保存されます。
            `;

    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37
                    "
                >
                    ${
                        endingLabels[endId]
                    }
                </h2>

                <div class="recollection-note">
                    ${note}
                </div>
            </div>

            <div>
                ${access}
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
                    color:#fff
                "
                onclick="
                    renderRecollectionHome()
                "
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
        unlockRecollectionBranch(
            endingId,
            sceneId
        )
    ) {
        renderRecollectionSceneSelect(
            endingId
        );
    }
}


// =========================================================
// ヴェインの理解状態選択
// =========================================================

function renderKnowledgeSelect(
    endingId,
    sceneId
) {
    const endId =
        Number(endingId);

    const id =
        Number(sceneId);

    const content =
        document.getElementById(
            "recollection-content"
        );

    if (!content) {
        return;
    }

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
            .endingSnapshots[endId];

    const startIndex =
        getSceneIndexById(id);

    if (
        !snapshot ||
        startIndex < 0
    ) {
        renderRecollectionHome();
        return;
    }

    recollectionKnowledgePreset =
        "memory";

    const memory =
        new Set(
            getSnapshotKnowledgeBeforeScene(
                snapshot,
                startIndex
            )
        );

    const rows =
        Object.keys(wordBank).map(
            key => {
                const mastered =
                    masteredWords.has(key);

                if (!mastered) {
                    return `
                        <div
                            class="
                                knowledge-item
                                locked
                            "
                        >
                            🔒 ${
                                wordBank[key].q
                            }

                            <div class="recollection-note">
                                未解読
                            </div>
                        </div>
                    `;
                }

                return `
                    <label class="knowledge-item">
                        <input
                            type="checkbox"
                            class="recollection-word-check"
                            value="${key}"
                            ${
                                memory.has(key)
                                    ? "checked"
                                    : ""
                            }
                            onchange="
                                markRecollectionKnowledgeCustom()
                            "
                        >

                        ${wordBank[key].q}

                        ―

                        ${
                            wordBank[key].canonical
                        }
                    </label>
                `;
            }
        ).join("");

    content.innerHTML = `
        <div class="recollection-head">
            <div>
                <h2
                    style="
                        margin:0;
                        color:#d4af37
                    "
                >
                    ヴェインの理解状態
                </h2>

                <div class="recollection-note">
                    Scene ${
                        id + 1
                    }

                    「${
                        getRecollectionSceneTitle(id)
                    }」

                    から開始
                </div>
            </div>

            <div>
                解読実績

                <b>
                    ${
                        masteredWords.size
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
            この追憶でヴェインがどの言葉を理解しているかを
            設定します。
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
                    color:#000
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
                    color:#fff
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


// =========================================================
// 理解状態のチェックボックス
// =========================================================

function getKnowledgeCheckboxes() {
    return [
        ...document.querySelectorAll(
            ".recollection-word-check"
        )
    ];
}


function setKnowledgeCheckboxes(keys) {
    const target =
        new Set(keys);

    getKnowledgeCheckboxes().forEach(
        input => {
            input.checked =
                target.has(
                    input.value
                );
        }
    );
}


function markRecollectionKnowledgeCustom() {
    recollectionKnowledgePreset =
        "custom";
}


// =========================================================
// 理解状態のプリセット
// =========================================================

function setKnowledgePreset(
    mode,
    endingId,
    sceneId
) {
    const snapshot =
        recollectionProgress
            .endingSnapshots[
                Number(endingId)
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
        元のENDでの
        このシーン開始直前の状態。
    */
    if (
        mode === "memory"
    ) {
        setKnowledgeCheckboxes(
            getSnapshotKnowledgeBeforeScene(
                snapshot,
                startIndex
            )
        );
    }

    /*
        現在世界線だけ
        理解0語に戻す。

        全体の解読実績は消さない。
    */
    else if (
        mode === "zero"
    ) {
        setKnowledgeCheckboxes([]);
    }

    /*
        これまでの周回で
        解読したすべての単語を継承。
    */
    else if (
        mode === "max"
    ) {
        setKnowledgeCheckboxes(
            [...masteredWords]
        );
    }

    else {
        return;
    }

    recollectionKnowledgePreset =
        mode;
}


// =========================================================
// 理解状態を確定して追憶開始
// =========================================================

function startSelectedRecollection(
    endingId,
    sceneId
) {
    const keys =
        getKnowledgeCheckboxes()
            .filter(
                input => input.checked
            )
            .map(
                input => input.value
            );

    return startRecollection(
        endingId,
        sceneId,
        keys
    );
}


// =========================================================
// END7　最後の追憶
// =========================================================

/*
    END7は通常END判定から
    絶対に到達しない。

    追憶専用入口から表示する。
*/
function startFinalRecollectionFromUI() {
    if (
        !recollectionProgress
            .finalRecollectionUnlocked
    ) {
        return;
    }

    if (
        typeof window.showSpecialEnding !==
        "function"
    ) {
        alert(
            "最後の追憶は解放されています。END7表示処理を接続すると使用できます。"
        );

        return;
    }

    closeRecollection();

    /*
        タイトル画面から開いた場合も
        END表示領域を表示する。
    */
    const gameContainer =
        document.getElementById(
            "game-container"
        );

    if (gameContainer) {
        gameContainer.style.display =
            "flex";
    }

    const device =
        document.getElementById(
            "device-check-overlay"
        );

    if (device) {
        device.style.display =
            "none";
    }

    window.showSpecialEnding(7);
}
