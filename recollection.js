/*
    声を聴かせて、ランスロット！
    追憶システム

    前提:
    - game.js の重要27択に id / endingImpact / route がある
    - HTML側に rebuildRunState() がある
    - masteredWords / vaneKnownWords / vaneUnderstoodAt がある
*/

const RECOLLECTION_STORAGE_KEY = "vane_recollection_v4";
const FREE_RECOLLECTION_SCENE_ID = 4;

let runMode = "story"; // "story" | "recollection"
let recollectionBaseEndingId = null;

function getImportantRecollectionScenes() {
    return scenario.filter(scene =>
        scene.opts.some(option => option.endingImpact === true)
    );
}

function getSceneIndexById(sceneId) {
    return scenario.findIndex(
        scene => scene.id === Number(sceneId)
    );
}

function getDefaultRecollectionProgress() {
    return {
        version: 4,
        gameCleared: false,
        voiceKeys: 0,

        /*
            鍵はENDごとではなく、
            「このSceneから開始できる権利」を永久解放する。
        */
        unlockedSceneIds: [],

        collectedNormalEndings: [],
        endingSnapshots: {},

        finalRecollectionUnlocked: false
    };
}

function normalizeRecollectionProgress(raw) {
    const base = getDefaultRecollectionProgress();

    const src =
        raw && typeof raw === "object"
            ? raw
            : {};

    const result = {
        ...base,
        ...src
    };

    result.voiceKeys =
        Number.isFinite(Number(result.voiceKeys))
            ? Math.max(
                0,
                Math.floor(Number(result.voiceKeys))
            )
            : 0;

    result.unlockedSceneIds = Array.from(
        new Set(
            (
                Array.isArray(result.unlockedSceneIds)
                    ? result.unlockedSceneIds
                    : []
            )
                .map(Number)
                .filter(id => {
                    return getSceneIndexById(id) >= 0;
                })
        )
    );

    result.collectedNormalEndings = Array.from(
        new Set(
            (
                Array.isArray(
                    result.collectedNormalEndings
                )
                    ? result.collectedNormalEndings
                    : []
            )
                .map(Number)
                .filter(id => {
                    return id >= 1 && id <= 6;
                })
        )
    );

    if (
        !result.endingSnapshots ||
        typeof result.endingSnapshots !== "object"
    ) {
        result.endingSnapshots = {};
    }

    /*
        初回クリア済みなら、
        最初の重要選択Scene4は必ず無料解放。
    */
    if (
        result.gameCleared &&
        !result.unlockedSceneIds.includes(
            FREE_RECOLLECTION_SCENE_ID
        )
    ) {
        result.unlockedSceneIds.push(
            FREE_RECOLLECTION_SCENE_ID
        );
    }

    return result;
}

function loadRecollectionProgress() {
    let saved = null;

    try {
        saved = JSON.parse(
            localStorage.getItem(
                RECOLLECTION_STORAGE_KEY
            ) || "null"
        );
    } catch (e) {
        saved = null;
    }

    if (saved) {
        return normalizeRecollectionProgress(
            saved
        );
    }

    /*
        旧セーブから最低限だけ移行する。

        END snapshotまでは復元できないため、
        存在しない履歴を捏造しない。
    */
    const migrated =
        getDefaultRecollectionProgress();

    let oldCollection = [];

    try {
        oldCollection = JSON.parse(
            localStorage.getItem(
                "vane_collection_v3"
            ) || "[]"
        );
    } catch (e) {
        oldCollection = [];
    }

    migrated.collectedNormalEndings =
        Array.from(
            new Set(
                oldCollection
                    .map(Number)
                    .filter(id => {
                        return id >= 1 && id <= 6;
                    })
            )
        );

    /*
        旧版ですでに通常ENDを持っている場合は、
        追憶システム自体は解放済みとして扱う。
    */
    if (
        migrated.collectedNormalEndings.length > 0
    ) {
        migrated.gameCleared = true;

        migrated.voiceKeys = 3;

        migrated.unlockedSceneIds = [
            FREE_RECOLLECTION_SCENE_ID
        ];
    }

    const masteredNow =
        typeof getMasteredWordSet === "function"
            ? getMasteredWordSet()
            : new Set();

    migrated.finalRecollectionUnlocked =
        migrated.collectedNormalEndings.length >= 3 &&
        masteredNow.size ===
            Object.keys(wordBank).length;

    localStorage.setItem(
        RECOLLECTION_STORAGE_KEY,
        JSON.stringify(migrated)
    );

    return normalizeRecollectionProgress(
        migrated
    );
}

let recollectionProgress =
    loadRecollectionProgress();

function saveRecollectionProgress() {
    localStorage.setItem(
        RECOLLECTION_STORAGE_KEY,
        JSON.stringify(recollectionProgress)
    );
}

/*
    そのENDの記憶において、
    指定Scene開始時点までに
    ヴェインが理解していた語だけを返す。

    startIndexと同じSceneで理解した語は、
    Scene開始時点ではまだ知らないので含めない。
*/
function getSnapshotKnowledgeBeforeScene(
    snapshot,
    startIndex
) {
    if (!snapshot) return [];

    const understoodAt =
        snapshot.vaneUnderstoodAt &&
        typeof snapshot.vaneUnderstoodAt ===
            "object"
            ? snapshot.vaneUnderstoodAt
            : {};

    return Object.keys(wordBank).filter(
        key => {
            const at = Number(
                understoodAt[key]
            );

            return (
                Number.isFinite(at) &&
                at < startIndex
            );
        }
    );
}

/*
    Phase1以前に選択肢本文そのものを
    保存していたデータが混ざった場合も
    option.idへ変換できるようにする。
*/
function normalizeSavedAnswer(
    optionValue,
    sceneIndex
) {
    if (!optionValue) {
        return null;
    }

    const data = scenario[sceneIndex];

    if (!data) {
        return null;
    }

    const byId =
        data.opts.find(
            option => {
                return option.id === optionValue;
            }
        );

    if (byId) {
        return byId.id;
    }

    const byText =
        data.opts.find(
            option => {
                return option.t === optionValue;
            }
        );

    return byText
        ? byText.id
        : null;
}

/*
    現在の一周をEND用snapshotへ変換。
*/
function snapshotCurrentRun() {
    return {
        selectedAnswers:
            selectedAnswers.map(
                (value, index) => {
                    return normalizeSavedAnswer(
                        value,
                        index
                    );
                }
            ),

        vaneKnownWords:
            Array.from(vaneKnownWords),

        /*
            「いつ理解したか」を保存しないと、
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

        clearedAt: Date.now()
    };
}

function updateFinalRecollectionUnlock() {
    const wasUnlocked =
        recollectionProgress
            .finalRecollectionUnlocked;

    recollectionProgress
        .finalRecollectionUnlocked =
            recollectionProgress
                .collectedNormalEndings
                .length >= 3 &&
            masteredWords.size ===
                Object.keys(wordBank).length;

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
    const id = Number(endingId);

    if (
        id < 1 ||
        id > 6
    ) {
        return {
            isFirstClear: false,
            isNewEnding: false,
            keysGained: 0,
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
            .includes(id);

    let keysGained = 0;

    if (isFirstClear) {
        recollectionProgress
            .gameCleared = true;

        recollectionProgress
            .voiceKeys += 3;

        keysGained = 3;

        /*
            最初の重要選択Scene4は
            初回クリア時点で無料解放。
        */
        if (
            !recollectionProgress
                .unlockedSceneIds
                .includes(
                    FREE_RECOLLECTION_SCENE_ID
                )
        ) {
            recollectionProgress
                .unlockedSceneIds
                .push(
                    FREE_RECOLLECTION_SCENE_ID
                );
        }
    }
    else if (!alreadyCollected) {
        recollectionProgress
            .voiceKeys += 1;

        keysGained = 1;
    }

    if (!alreadyCollected) {
        recollectionProgress
            .collectedNormalEndings
            .push(id);
    }

    /*
        同じENDの別履歴で
        基準snapshotを勝手に上書きしない。
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
        finalRecollectionUnlockedNow
    };
}

function isRecollectionSceneUnlocked(
    sceneId
) {
    return recollectionProgress
        .unlockedSceneIds
        .includes(
            Number(sceneId)
        );
}

/*
    声の鍵でSceneショートカットを
    永久解放する。
*/
function unlockRecollectionScene(
    sceneId
) {
    const id = Number(sceneId);

    const validSceneIds =
        getImportantRecollectionScenes()
            .map(
                scene => scene.id
            );

    if (
        !validSceneIds.includes(id)
    ) {
        return false;
    }

    if (
        isRecollectionSceneUnlocked(id)
    ) {
        return true;
    }

    /*
        Scene4だけは無料。
    */
    if (
        id ===
        FREE_RECOLLECTION_SCENE_ID
    ) {
        recollectionProgress
            .unlockedSceneIds
            .push(id);

        saveRecollectionProgress();

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
        .unlockedSceneIds
        .push(id);

    saveRecollectionProgress();

    return true;
}

/*
    途中Sceneから開始するため、
    そのSceneより前までに何回
    各暗号を聞いたかを復元する。
*/
function rebuildSeenWordsBefore(
    startIndex
) {
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
    「このヴェインの状態にする」

    requestedKeysのうち、
    masteredWordsに存在する語だけを
    現在世界線へ反映する。
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
                requestedKeys || []
            );

    /*
        プレイヤーが一度も
        解読したことのない語は
        絶対に解放できない。
    */
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
                    masteredWords.has(key)
                );
            }
        );

    vaneKnownWords =
        new Set(allowed);

    vaneUnderstoodAt = {};

    const oldUnderstoodAt =
        snapshot &&
        snapshot.vaneUnderstoodAt &&
        typeof snapshot
            .vaneUnderstoodAt ===
            "object"
            ? snapshot.vaneUnderstoodAt
            : {};

    allowed.forEach(
        key => {
            const oldAt =
                Number(
                    oldUnderstoodAt[key]
                );

            if (
                Number.isFinite(oldAt) &&
                oldAt < startIndex
            ) {
                /*
                    元の記憶でも
                    このSceneより前に
                    理解していた語。
                */
                vaneUnderstoodAt[key] =
                    oldAt;
            }
            else {
                /*
                    カスタム設定で
                    この世界線へ持ち込んだ語。

                    分岐開始直前から
                    理解済みとして扱う。
                */
                vaneUnderstoodAt[key] =
                    startIndex - 1;
            }
        }
    );

    Object.keys(
        wordBank
    ).forEach(
        key => {
            userDict[key] =
                vaneKnownWords.has(key)
                    ? wordBank[key]
                        .canonical
                    : "";

            renderDictEntryState(key);
        }
    );

    updateIntelUI();

    return Array.from(
        vaneKnownWords
    );
}

/*
    実際に追憶を開始する。
*/
function startRecollection(
    baseEndingId,
    startSceneId,
    requestedKnowledgeKeys
) {
    const endingId =
        Number(baseEndingId);

    const sceneId =
        Number(startSceneId);

    const snapshot =
        recollectionProgress
            .endingSnapshots[
                endingId
            ];

    if (!snapshot) {
        return false;
    }

    if (
        !isRecollectionSceneUnlocked(
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

    runMode =
        "recollection";

    recollectionBaseEndingId =
        endingId;

    /*
        分岐地点より前の選択だけ、
        元ENDの記憶を継承する。
    */
    selectedAnswers =
        new Array(
            scenario.length
        ).fill(null);

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
        selectedAnswers[i] =
            normalizeSavedAnswer(
                savedAnswers[i],
                i
            );
    }

    /*
        分岐地点以降は新しく選択。
    */
    currentStep =
        startIndex;

    viewingStep =
        startIndex;

    interactionPhase =
        "conversation";

    pendingOption = null;

    pendingResolvedKeys = [];

    pendingFinalLine = "";

    /*
        辞書DOMを未継承状態で
        一度作り直してから、
        追憶用理解状態を適用する。
    */
    vaneKnownWords =
        new Set();

    vaneUnderstoodAt = {};

    initDict({});

    applyRecollectionKnowledge(
        requestedKnowledgeKeys,
        snapshot,
        startIndex
    );

    rebuildSeenWordsBefore(
        startIndex
    );

    /*
        通常startGame()と同じく、
        現在Sceneの暗号登場回数も
        Scene開始時に登録する。
    */
    registerSceneWords(
        startIndex
    );

    /*
        prefixの選択履歴から
        interpretation / route等を
        正確に再構築する。
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

    document.getElementById(
        "game-container"
    ).style.display =
        "flex";

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

/*
    通常END1〜6だけを決定する。

    END7は絶対に
    この関数から出さない。
*/
function determineNormalEndingId() {
    rebuildRunState();

    /*
        END1 暁光の誓い

        プレイヤー全体の
        masteredWordsではなく、
        この世界線の
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
                        routeCounts[route] ===
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
            scenario.length - 1;
        i >= 0;
        i--
    ) {
        const optionId =
            selectedAnswers[i];

        if (!optionId) {
            continue;
        }

        const data =
            scenario[i];

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


/* =========================================================
   追憶UI
   ========================================================= */

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

    recollectionProgress =
        normalizeRecollectionProgress(
            loadRecollectionProgress()
        );

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
                (a, b) => {
                    return a - b;
                }
            );

    const endingButtons =
        endings.map(
            id => {
                const hasSnapshot =
                    !!recollectionProgress
                        .endingSnapshots[id];

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
                                endingLabels[id] ||
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
        ).join("");

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
                endingId
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
                        isRecollectionSceneUnlocked(
                            scene.id
                        );

                    if (unlocked) {
                        return `
                            <button
                                class="recollection-card"
                                onclick="renderKnowledgeSelect(${endingId}, ${scene.id})"
                            >
                                <b>
                                    Scene ${
                                        scene.id + 1
                                    }
                                </b>

                                ${
                                    scene.sceneTitle
                                }

                                <br>

                                <span class="recollection-note">
                                    この場面から追憶する
                                </span>
                            </button>
                        `;
                    }

                    return `
                        <button
                            class="recollection-card"
                            onclick="unlockSceneFromUI(${endingId}, ${scene.id})"
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

                            ${
                                scene.sceneTitle
                            }

                            <br>

                            <span class="recollection-note">
                                🔑1個で
                                場面ショートカットを
                                永久解放
                            </span>
                        </button>
                    `;
                }
            )
            .join("");

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
                            endingId
                        ]
                    }
                </h2>

                <div class="recollection-note">
                    分岐地点を選んでください。
                    <br>
                    解放した場面は、
                    ほかの回収済みENDからも
                    使用できます。
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

function unlockSceneFromUI(
    endingId,
    sceneId
) {
    if (
        !unlockRecollectionScene(
            sceneId
        )
    ) {
        return;
    }

    renderRecollectionSceneSelect(
        endingId
    );
}

function renderKnowledgeSelect(
    endingId,
    sceneId
) {
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
                endingId
            ];

    const startIndex =
        getSceneIndexById(
            sceneId
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
        canonicalを見せない。
    */
    const rows =
        Object.keys(
            wordBank
        )
            .map(
                key => {
                    const mastered =
                        masteredWords
                            .has(key);

                    const checked =
                        mastered &&
                        memoryKnowledge
                            .has(key);

                    if (!mastered) {
                        return `
                            <div
                                class="
                                    knowledge-item
                                    locked
                                "
                            >
                                🔒 ${
                                    wordBank[key]
                                        .q
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
                                wordBank[key]
                                    .q
                            }

                            ―

                            ${
                                wordBank[key]
                                    .canonical
                            }
                        </label>
                    `;
                }
            )
            .join("");

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
                        sceneId + 1
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
            プレイヤーが一度理解した実績は消えません。
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
                        ${endingId},
                        ${sceneId}
                    )
                "
            >
                この記憶と同じ
            </button>

            <button
                class="btn-style"
                onclick="
                    setKnowledgePreset(
                        'zero',
                        ${endingId},
                        ${sceneId}
                    )
                "
            >
                理解 0
            </button>

            <button
                class="btn-style"
                onclick="
                    setKnowledgePreset(
                        'max',
                        ${endingId},
                        ${sceneId}
                    )
                "
            >
                現在の理解をすべて反映
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
                        ${endingId},
                        ${sceneId}
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
                        ${endingId}
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
        new Set(keys);

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
                endingId
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

    if (
        mode === "memory"
    ) {
        setKnowledgeCheckboxes(
            getSnapshotKnowledgeBeforeScene(
                snapshot,
                startIndex
            )
        );

        return;
    }

    if (
        mode === "zero"
    ) {
        setKnowledgeCheckboxes(
            []
        );

        return;
    }

    if (
        mode === "max"
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
                    return input.checked;
                }
            )
            .map(
                input => {
                    return input.value;
                }
            );

    startRecollection(
        endingId,
        sceneId,
        keys
    );
}

/*
    END7は通常END判定からではなく、
    「最後の追憶」専用入口からだけ表示。
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

        window.showSpecialEnding(
            7
        );

        return;
    }

    /*
        endings.js側の接続前に
        通常ENDへ誤遷移しないよう止める。
    */
    alert(
        "最後の追憶は解放されています。END7表示処理を接続すると使用できます。"
    );
}
