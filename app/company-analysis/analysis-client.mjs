export const ANALYSIS_ENDPOINT = process.env.NEXT_PUBLIC_KANALYZER_API_URL || "https://kanalyzer-analysis-api.onrender.com/api/v1/annual-reports/search";

/** Static Pages calls the public analysis service directly; EDINET credentials stay on the server. */
export async function requestAnalysis(payload, { fetchImpl = globalThis.fetch, timeoutMs = 180000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(ANALYSIS_ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: controller.signal, credentials: "omit",
    });
    let data;
    try { data = await response.json(); }
    catch { throw new Error("分析サービスから読み取れる結果が届きませんでした。時間をおいて再度お試しください。"); }
    if (!response.ok) {
      const message = typeof data.detail === "string" ? data.detail : typeof data.error === "string" ? data.error : "分析サービスが一時的に利用できません。時間をおいて再度お試しください。";
      throw new Error(message);
    }
    if (!data || !Array.isArray(data.documents)) throw new Error("分析結果の形式を確認できませんでした。時間をおいて再度お試しください。");
    return data;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("分析に時間がかかっています。検索期間を短くして、再度お試しください。");
    if (error instanceof TypeError) throw new Error("分析サービスに接続できません。時間をおいて再度お試しください。");
    throw error;
  } finally { clearTimeout(timer); }
}
