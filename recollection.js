const RECOLLECTION_STORAGE_KEY = "vane_recollection_v4";
const RECOLLECTION_SCHEMA_VERSION = 8;

let runMode = "story"; // "story" | "recollection"
let recollectionBaseEndingId = null;

const endingLabels = {
    1: "言葉の果てで、君と",
    2: "隣り合う剣",
    3: "それぞれの歩幅",
    4: "声が戻るまで",
    5: "プリンと遠回りの恋",
    6: "その声をたよりに"
};

const CONTINUATION_SCENE_INDICES = Object.freeze([0, 10, 19]);

function isValidNormalEndingId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id >= 1 && id <= 6;
}

function getRecollectionOptions(scene) {
    if (!scene) return [];
    return [
        ...(scene.opts || []),
        ...(scene.insightOpts || []),
        ...(scene.misreadOpts || [])
    ];
}

function getRecollectionOption(scene, optionId) {
    return getRecollectionOptions(scene).find(option => option.id === optionId) || null;
}

function getRecollectionOptionKind(scene, optionId) {
    if ((scene?.misreadOpts || []).some(option => option.id === optionId)) return "misread";
    if ((scene?.insightOpts || []).some(option => option.id === optionId)) return "insight";
    if ((scene?.opts || []).some(option => option.id === optionId)) return "base";
    return null;
}

function normalizeSavedAnswer(optionValue, sceneIndex) {
    const scene = scenario[sceneIndex];
    if (!scene || !optionValue) return null;
    const value = typeof optionValue === "object"
        ? (optionValue.id || optionValue.t)
        : optionValue;
    const options = getRecollectionOptions(scene);
    const option = options.find(item => item.id === value)
        || options.find(item => item.t === value);
    return option ? option.id : null;
}

/*
    過去の実際の返答記録だけを正規化する。
    旧データに存在しない誤読イベントを、選択肢IDから補完しない。
*/
function normalizeSceneChoiceRecord(raw, sceneIndex, savedOptionId) {
    const scene = scenario[sceneIndex];
    if (!scene || !raw || typeof raw !== "object" || !savedOptionId) return null;
    if (raw.optionId !== savedOptionId) return null;

    const option = getRecollectionOption(scene, savedOptionId);
    const kind = getRecollectionOptionKind(scene, savedOptionId);
    if (!option || !kind || raw.kind !== kind) return null;

    const rawStates = raw.wordStates && typeof raw.wordStates === "object"
        ? raw.wordStates : {};
    const rawGuesses = raw.guesses && typeof raw.guesses === "object"
        ? raw.guesses : {};
    const rawNotebook = raw.notebookGuesses && typeof raw.notebookGuesses === "object"
        ? raw.notebookGuesses : null;
    const wordStates = {};
    const guesses = {};
    const notebookGuesses = {};

    for (const { key } of scene.words || []) {
        if (!wordBank[key]) continue;
        if (["correct", "wrong", "blank"].includes(rawStates[key])) {
            wordStates[key] = rawStates[key];
        }
        if (typeof rawGuesses[key] === "string") guesses[key] = rawGuesses[key];
    }

    if (rawNotebook) {
        for (const [key, value] of Object.entries(rawNotebook)) {
            if (wordBank[key] && typeof value === "string") notebookGuesses[key] = value;
        }
    }

    return {
        sceneId: scene.id,
        wordStates,
        optionId: savedOptionId,
        kind,
        misreadKey: kind === "misread" ? (raw.misreadKey || null) : null,
        route: option.route || null,
        guesses,
        ...(rawNotebook ? { notebookGuesses } : {})
    };
}

// ---------------------------------------------------------
// スナップショットの保存と正規化
// ---------------------------------------------------------

function normalizeEndingSnapshot(raw) {
    if (!raw || typeof raw !== "object") return null;
    const rawAnswers = Array.isArray(raw.selectedAnswers) ? raw.selectedAnswers : [];
    const selectedAnswersNormalized = scenario.map((_, i) =>
        normalizeSavedAnswer(rawAnswers[i], i)
    );
    const rawRecords = Array.isArray(raw.sceneChoiceRecords) ? raw.sceneChoiceRecords : [];
    const sceneChoiceRecordsNormalized = scenario.map((_, i) =>
        normalizeSceneChoiceRecord(rawRecords[i], i, selectedAnswersNormalized[i])
    );
    const understoodAt = {};
    if (raw.vaneUnderstoodAt && typeof raw.vaneUnderstoodAt === "object") {
        for (const [key, at] of Object.entries(raw.vaneUnderstoodAt)) {
            if (wordBank[key] && Number.isFinite(Number(at))) {
                understoodAt[key] = Number(at);
            }
        }
    }
    return {
        selectedAnswers: selectedAnswersNormalized,
        sceneChoiceRecords: sceneChoiceRecordsNormalized,
        vaneKnownWords: [...new Set(
            (Array.isArray(raw.vaneKnownWords) ? raw.vaneKnownWords : [])
                .filter(key => !!wordBank[key])
        )],
        vaneUnderstoodAt: understoodAt,
        // 終了時点の推測。途中からの再開に丸ごとコピーしない。
        userDict: raw.userDict && typeof raw.userDict === "object"
            ? Object.fromEntries(Object.entries(raw.userDict).filter(([key, value]) =>
                !!wordBank[key] && typeof value === "string"
            )) : {},
        clearedAt: Number.isFinite(Number(raw.clearedAt))
            ? Number(raw.clearedAt) : null
    };
}

function snapshotCurrentRun() {
    const selected = scenario.map((_, i) =>
        normalizeSavedAnswer(selectedAnswers[i], i)
    );
    const records = scenario.map((_, i) =>
        normalizeSceneChoiceRecord(
            Array.isArray(sceneChoiceRecords) ? sceneChoiceRecords[i] : null,
            i,
            selected[i]
        )
    );
    return {
        selectedAnswers: selected,
        sceneChoiceRecords: records,
        vaneKnownWords: [...vaneKnownWords].filter(key => !!wordBank[key]),
        vaneUnderstoodAt: { ...vaneUnderstoodAt },
        userDict: { ...userDict },
        clearedAt: Date.now()
    };
}

function getSnapshotKnowledgeBeforeScene(snapshot, startIndex) {
    if (!snapshot) return [];
    const understoodAt = snapshot.vaneUnderstoodAt || {};
    return Object.keys(wordBank).filter(key =>
        Object.prototype.hasOwnProperty.call(understoodAt, key)
        && Number.isFinite(Number(understoodAt[key]))
        && Number(understoodAt[key]) < startIndex
    );
}

function getCurrentMasteredWordCount() {
    if (typeof getMasteredWordSet === "function") return getMasteredWordSet().size;
    return masteredWords instanceof Set ? masteredWords.size : 0;
}

// ---------------------------------------------------------
// 進行セーブと旧版からの移行
// ---------------------------------------------------------

function getDefaultRecollectionProgress() {
    return {
        version: RECOLLECTION_SCHEMA_VERSION,
        gameCleared: false,
        // 旧欠片制度の互換フィールド。新UIでは不使用。
        voiceKeys: 0,
        recollectionUnlimited: false,
        unlockedBranches: [],
        collectedNormalEndings: [],
        endingSnapshots: {}, // ENDごと、初到達時の基準記録
        latestRunEndingId: null, // 直近にクリアしたEND
        latestRunSnapshot: null, // 直近の周回を再開するための記録
        finalRecollectionUnlocked: false
    };
}

function getLegacyImportantSceneIds() {
    return scenario.filter(scene => getRecollectionOptions(scene).some(option =>
        option.endingImpact === true
    )).map(scene => scene.id);
}

function normalizeRecollectionProgress(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    const defaults = getDefaultRecollectionProgress();

    const collectedNormalEndings = [...new Set(
        (Array.isArray(src.collectedNormalEndings) ? src.collectedNormalEndings : [])
            .map(Number)
            .filter(isValidNormalEndingId)
    )];
    const endingSnapshots = {};
    if (src.endingSnapshots && typeof src.endingSnapshots === "object") {
        for (const [key, value] of Object.entries(src.endingSnapshots)) {
            if (!isValidNormalEndingId(key)) continue;
            const snapshot = normalizeEndingSnapshot(value);
            if (snapshot) endingSnapshots[Number(key)] = snapshot;
        }
    }

    // 旧任意シーン解放は利用しないが、獲得済みの値を消さない。
    const branches = new Set(
        (Array.isArray(src.unlockedBranches) ? src.unlockedBranches : [])
            .filter(value => typeof value === "string")
    );
    const legacyScenes = new Set(getLegacyImportantSceneIds());
    const oldUnlockedScenes = Array.isArray(src.unlockedSceneIds) ? src.unlockedSceneIds : [];
    for (const sceneIdRaw of oldUnlockedScenes) {
        const sceneId = Number(sceneIdRaw);
        if (!legacyScenes.has(sceneId)) continue;
        for (const endingId of new Set([
            ...collectedNormalEndings,
            ...Object.keys(endingSnapshots).map(Number)
        ])) {
            branches.add(`end${endingId}_scene${sceneId}`);
        }
    }

    const voiceKeysRaw = Number(src.voiceKeys);
    const voiceKeys = Number.isFinite(voiceKeysRaw)
        ? Math.max(0, Math.floor(voiceKeysRaw)) : 0;
    const finalRecollectionUnlocked =
        collectedNormalEndings.length >= 3
        && getCurrentMasteredWordCount() === Object.keys(wordBank).length;

    let latestRunSnapshot = normalizeEndingSnapshot(src.latestRunSnapshot);
    let latestRunEndingId = isValidNormalEndingId(src.latestRunEndingId)
        ? Number(src.latestRunEndingId) : null;

    // v6/v7は直近保存欄を持たない。既存の基準snapshotから代替を選ぶ。
    // その後のクリアで本当の直近周回が保存される。
    if (!latestRunSnapshot) {
        const candidates = Object.entries(endingSnapshots)
            .map(([endingId, snapshot]) => ({ endingId: Number(endingId), snapshot }))
            .sort((a, b) =>
                (b.snapshot.clearedAt || 0) - (a.snapshot.clearedAt || 0)
            );
        if (candidates.length) {
            latestRunSnapshot = candidates[0].snapshot;
            latestRunEndingId = candidates[0].endingId;
        }
    }
    if (!latestRunSnapshot) latestRunEndingId = null;

    return {
        ...defaults,
        version: RECOLLECTION_SCHEMA_VERSION,
        gameCleared: !!src.gameCleared || collectedNormalEndings.length > 0,
        voiceKeys,
        recollectionUnlimited: !!src.recollectionUnlimited,
        unlockedBranches: [...branches],
        collectedNormalEndings,
        endingSnapshots,
        latestRunEndingId,
        latestRunSnapshot,
        finalRecollectionUnlocked
    };
}

function loadRecollectionProgress() {
    let saved = null;
    try {
        saved = JSON.parse(localStorage.getItem(RECOLLECTION_STORAGE_KEY) || "null");
    } catch (error) {
        saved = null;
    }

    if (!saved || typeof saved !== "object") {
        const legacy = getDefaultRecollectionProgress();
        let oldCollection = [];
        try {
            oldCollection = JSON.parse(localStorage.getItem("vane_collection_v3") || "[]");
        } catch (error) {
            oldCollection = [];
        }
        legacy.collectedNormalEndings = [...new Set(
            (Array.isArray(oldCollection) ? oldCollection : [])
                .map(Number).filter(isValidNormalEndingId)
        )];
        if (legacy.collectedNormalEndings.length) {
            legacy.gameCleared = true;
            legacy.voiceKeys = 3; // 旧データ互換のみ
        }
        saved = legacy;
    }

    const normalized = normalizeRecollectionProgress(saved);
    localStorage.setItem(RECOLLECTION_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
}

let recollectionProgress = loadRecollectionProgress();

function saveRecollectionProgress() {
    recollectionProgress = normalizeRecollectionProgress(recollectionProgress);
    localStorage.setItem(RECOLLECTION_STORAGE_KEY, JSON.stringify(recollectionProgress));
}

function updateFinalRecollectionUnlock() {
    const before = recollectionProgress.finalRecollectionUnlocked;
    recollectionProgress.finalRecollectionUnlocked =
        recollectionProgress.collectedNormalEndings.length >= 3
        && getCurrentMasteredWordCount() === Object.keys(wordBank).length;
    return !before && recollectionProgress.finalRecollectionUnlocked;
}

function recordEndingProgress(endingId) {
    const id = Number(endingId);
    const empty = {
        isFirstClear: false,
        isNewEnding: false,
        keysGained: 0,
        recollectionUnlimitedUnlockedNow: false,
        finalRecollectionUnlockedNow: false
    };
    if (!isValidNormalEndingId(id)) return empty;

    const isFirstClear = !recollectionProgress.gameCleared;
    const isNewEnding = !recollectionProgress.collectedNormalEndings.includes(id);
    const snapshot = snapshotCurrentRun();

    recollectionProgress.gameCleared = true;
    if (isFirstClear) recollectionProgress.voiceKeys += 3; // 旧データ互換のみ
    if (isNewEnding) recollectionProgress.collectedNormalEndings.push(id);

    // ENDごとの基準記憶は上書きしない。
    if (!recollectionProgress.endingSnapshots[id]) {
        recollectionProgress.endingSnapshots[id] = snapshot;
    }
    // 「つづきから」は毎回、本当に直近の周回を引き継ぐ。
    recollectionProgress.latestRunEndingId = id;
    recollectionProgress.latestRunSnapshot = snapshot;

    const recollectionUnlimitedUnlockedNow =
        !isFirstClear && runMode === "recollection"
        && !recollectionProgress.recollectionUnlimited;
    if (recollectionUnlimitedUnlockedNow) {
        recollectionProgress.recollectionUnlimited = true;
    }

    const finalRecollectionUnlockedNow = updateFinalRecollectionUnlock();
    saveRecollectionProgress();
    return {
        isFirstClear,
        isNewEnding,
        // 欠片はUI上廃止。「3個獲得」と表示しない。
        keysGained: 0,
        recollectionUnlimitedUnlockedNow,
        finalRecollectionUnlockedNow
    };
}

// ---------------------------------------------------------
// 過去のノートを復元するための任意ヘルパー
// ---------------------------------------------------------

/*
    保存時点のノート全体ではなく、開始地点より前に実際に
    選んだ返答の guesses を時系列で再生する。
    白紙モードでは推測を引き継がない。
*/
function restoreNotebookGuessesBeforeScene(snapshot, startIndex, mode = "memory") {
    if (mode === "zero" || !snapshot) return;
    const records = Array.isArray(snapshot.sceneChoiceRecords)
        ? snapshot.sceneChoiceRecords : [];
    for (let i = 0; i < startIndex; i++) {
        const record = records[i];
        if (!record) continue;
        // 新形式は場面確定時点のノート全体を復元する。
        // 旧形式はそのシーンで使用した単語の推測だけを補完する。
        const guesses = record.notebookGuesses || record.guesses;
        if (!guesses || typeof guesses !== "object") continue;
        for (const [key, guess] of Object.entries(guesses)) {
            if (wordBank[key] && !vaneKnownWords.has(key) && typeof guess === "string") {
                userDict[key] = guess;
            }
        }
    }
    for (const key of vaneKnownWords) userDict[key] = wordBank[key].canonical;
    if (typeof renderActiveDictEntry === "function") renderActiveDictEntry();
    if (typeof renderWordList === "function") renderWordList();
}

// ---------------------------------------------------------
// 通常END1〜6の判定
// ---------------------------------------------------------

/*
    優先順位:
    1) 全15語理解 -> END1
    2) 実際の誤読返答を3回以上 -> END5
    3) 理解確定0〜3語 -> END4
    4) それ以外 -> route最多の END2 / END3 / END6

    END7は絶対に返さない。
*/
const ENDING_RULES = Object.freeze({
    misreadRepliesForPudding: 3,
    maximumUnderstoodForSilence: 3,
    minimumUnresolvedForSilence: 12
});

function countActualMisreadReplies() {
    if (!Array.isArray(sceneChoiceRecords)) return 0;
    let count = 0;
    sceneChoiceRecords.forEach((record, index) => {
        if (!record || record.kind !== "misread") return;
        const scene = scenario[index];
        const option = (scene?.misreadOpts || []).find(item =>
            item.id === record.optionId && item.misreadImpact === true
        );
        if (!option || selectedAnswers[index] !== option.id) return;
        const key = option.trigger?.key;
        if (!key || record.misreadKey !== key) return;
        if (record.wordStates?.[key] !== "wrong") return;
        const guess = record.guesses?.[key];
        if (typeof guess !== "string" || !normalizeGuess(guess)) return;
        if (isAcceptedGuess(key, guess)) return;
        if (!(option.trigger?.guesses || []).some(candidate =>
            normalizeGuess(candidate) === normalizeGuess(guess)
        )) return;
        count++;
    });
    return count;
}

function getLatestTiedRoute(tiedRoutes) {
    for (let i = scenario.length - 1; i >= 0; i--) {
        const option = getRecollectionOption(scenario[i], selectedAnswers[i]);
        if (option?.endingImpact && option.route && tiedRoutes.has(option.route)) {
            return option.route;
        }
    }
    return "twin";
}

function determineNormalEndingId() {
    rebuildRunState();
    const total = Object.keys(wordBank).length;
    const understood = [...vaneKnownWords].filter(key => !!wordBank[key]).length;
    const unresolved = total - understood;

    if (understood === total) return 1;
    if (countActualMisreadReplies() >= ENDING_RULES.misreadRepliesForPudding) return 5;
    if (understood <= ENDING_RULES.maximumUnderstoodForSilence
        && unresolved >= ENDING_RULES.minimumUnresolvedForSilence) return 4;

    const max = Math.max(
        routeCounts.twin || 0,
        routeCounts.glass || 0,
        routeCounts.resonance || 0
    );
    const tied = new Set(["twin", "glass", "resonance"].filter(route =>
        (routeCounts[route] || 0) === max
    ));
    const winner = getLatestTiedRoute(tied);
    return winner === "glass" ? 3 : winner === "resonance" ? 6 : 2;
}

// ---------------------------------------------------------
// 「つづきから」と最後の追憶
// ---------------------------------------------------------

/*
    互換用の入口。
    旧版のEND×任意SCENE選択パネルは作らない。
    index.html末尾の openContinueSetup() へ接続する。
*/
function openRecollection() {
    if (typeof openContinueSetup === "function") openContinueSetup();
}

/*
    END7専用入口。
    END7は通常END判定ではなく、解放後の「つづきから」に現れる。
*/
function startFinalRecollectionFromUI() {
    recollectionProgress = loadRecollectionProgress();
    if (!recollectionProgress.finalRecollectionUnlocked) return false;
    if (typeof window.showSpecialEnding !== "function") return false;

    [
        "continue-overlay", "recollection-overlay", "device-check-overlay",
        "intro-overlay", "tutorial-overlay", "load-overlay"
    ].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = "none";
    });
    const game = document.getElementById("game-container");
    if (!game) return false;
    game.style.display = "flex";
    window.showSpecialEnding(7);
    return true;
}
