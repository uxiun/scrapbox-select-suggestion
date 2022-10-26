import { Candidate, CandidateWithPoint, makeFilter } from "./search.ts";

export interface IncrementalSearchOptions {
  /** 一度に検索する候補の最大数
   *
   * @default 1000
   */
  chunk?: number;
  /** 検索結果を返す時間間隔 (単位はms)
   *
   * @default 500
   */
  interval?: number;
}

/** 中断可能な検索メソッド */
export const incrementalSearch = (
  query: string,
  source: Candidate[],
  listener: (candidates: CandidateWithPoint[]) => void,
  options?: IncrementalSearchOptions,
): () => void => {
  const filter = makeFilter(query);
  if (!filter) {
    listener([]);
    return () => {};
  }

  let terminate = false;
  let timer: number | undefined;
  const candidates: CandidateWithPoint[] = [];
  const update = () => {
    listener(candidates);
    timer = undefined;
  };
  const total = Math.floor(source.length / (options?.chunk ?? 1000)) + 1;
  const chunk = options?.chunk ?? 1000;
  (async () => {
    // 検索する
    for (let i = 0; i < total; i++) {
      // 検索中断命令を受け付けるためのinterval
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (terminate) return;

      candidates.push(...filter(source.slice(i * chunk, (i + 1) * chunk)));
      if (timer !== undefined) continue;
      update();
      timer = setTimeout(update, options?.interval ?? 500);
    }
  })();

  // 検索を中断させる
  return () => {
    terminate = true;
    clearTimeout(timer);
  };
};
