import { useEffect, useRef, useState } from "react";
import { useNewsFeed } from "../query/sentiment.query";
import type { NewsArticle } from "../types/sentiment.types";

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {article.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {article.source} • {new Date(article.publishedAt).toLocaleString()}
          </p>
        </div>
        <div className="text-sm font-semibold text-foreground">
          {Math.round(article.sentiment * 100)}%
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{article.summary}</p>
    </div>
  );
}

export function NewsFeed({ symbol }: { symbol?: string }) {
  const [page, setPage] = useState(1);
  const result = useNewsFeed({ symbol, page });
  const data = result.data as
    | { items: NewsArticle[]; total: number }
    | undefined;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setPage((p) => p + 1);
      });
    });
    const el = ref.current.querySelector(".sentinel");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3">
      {(data?.items || []).map((item) => (
        <NewsCard key={item.id} article={item} />
      ))}
      <div className="sentinel h-6" />
    </div>
  );
}
