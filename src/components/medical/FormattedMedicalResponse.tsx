import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink, BookOpen } from "lucide-react";

interface PubMedArticle {
  uid: string;
  title: string;
  authors?: Array<{
    name: string;
    authtype?: string;
  }>;
  source?: string;
  pubdate?: string;
  articleids?: Array<{
    idtype: string;
    idtypen: number;
    value: string;
  }>;
  sortpubdate?: string;
  sortfirstauthor?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  fulljournalname?: string;
  description?: string;
  abstract?: string;
}

interface FormattedMedicalResponseProps {
  title?: string;
  articles: PubMedArticle[];
}

export default function FormattedMedicalResponse({
  title = "PubMed Medical Research",
  articles = [],
}: FormattedMedicalResponseProps) {
  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.uid}
              className="space-y-2 pb-4 border-b border-border/30 last:border-0"
            >
              <h3 className="font-semibold text-lg">{article.title}</h3>

              {article.authors && article.authors.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {article.authors
                    .slice(0, 3)
                    .map((author) => author.name)
                    .join(", ")}
                  {article.authors.length > 3 ? " et al." : ""}
                </p>
              )}

              {article.fulljournalname && (
                <p className="text-sm italic">
                  {article.fulljournalname}
                  {article.volume && `, Volume ${article.volume}`}
                  {article.issue && `, Issue ${article.issue}`}
                  {article.pubdate && ` (${article.pubdate})`}
                </p>
              )}

              {(article.description || article.abstract) && (
                <div className="mt-2 text-sm">
                  <p>{article.description || article.abstract}</p>
                </div>
              )}

              <div className="mt-2">
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View on PubMed <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No research articles found</p>
            </div>
          )}

          <div className="mt-4 pt-2 text-xs text-muted-foreground border-t border-border/30">
            <p>Source: PubMed - National Library of Medicine</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
