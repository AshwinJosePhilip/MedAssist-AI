import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink, BookOpen, Calendar, User, FileDigit, Award, BookOpenCheck, FileSearch, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  formattedUrl?: string;
  keywords?: string[];
}

interface FormattedMedicalResponseProps {
  title?: string;
  articles: PubMedArticle[];
}

export default function FormattedMedicalResponse({
  title = "PubMed Medical Research",
  articles = [],
}: FormattedMedicalResponseProps) {
  // Ensure we have a clear indication this is from PubMed
  const displayTitle = articles.length > 0 ? "PubMed Research Evidence" : title;
  
  // Format publication date to be more readable
  const formatDate = (dateString: string) => {
    try {
      // Handle various PubMed date formats
      const cleanDate = dateString.replace(/\s+/g, " ").trim();
      const date = new Date(cleanDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateString; // Return original if parsing fails
    } catch (e) {
      return dateString;
    }
  };

  // Extract year from publication date for citation
  const extractYear = (dateString: string) => {
    try {
      const match = dateString.match(/(19|20)\d{2}/);
      return match ? match[0] : "";
    } catch (e) {
      return "";
    }
  };

  // Format citation in APA style
  const formatCitation = (article: PubMedArticle) => {
    const year = article.pubdate ? extractYear(article.pubdate) : "";
    const authors = article.authors && article.authors.length > 0 
      ? article.authors.map(author => author.name).join(", ")
      : "";
    const lastAuthorIndex = authors.lastIndexOf(", ");
    const formattedAuthors = lastAuthorIndex !== -1 
      ? `${authors.substring(0, lastAuthorIndex)} & ${authors.substring(lastAuthorIndex + 2)}` 
      : authors;
    
    return `${formattedAuthors}${formattedAuthors ? " (" : ""}${year}${formattedAuthors ? ")" : ""}${(formattedAuthors || year) ? ". " : ""}${article.title}${article.title ? ". " : ""}${article.fulljournalname || ""}${article.fulljournalname ? ", " : ""}${article.volume || ""}${article.issue ? `(${article.issue})` : ""}${article.pages ? `, ${article.pages}` : ""}${article.articleids?.some(id => id.idtype === "doi") ? `. doi:${article.articleids.find(id => id.idtype === "doi")?.value}` : ""}`;
  };

  return (
    <Card className="w-full bg-card/90 backdrop-blur-sm shadow-md border border-primary/20">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          {displayTitle}
          <Badge variant="outline" className="ml-auto text-xs bg-primary/5">
            {articles.length} {articles.length === 1 ? "Article" : "Articles"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {articles.length > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md mb-4">
              <p className="flex items-center gap-1 mb-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="font-medium">About these results:</span>
              </p>
              <p>The following research articles from PubMed are relevant to your query. Each article has been peer-reviewed and published in medical journals.</p>
            </div>
          )}

          {articles.map((article, index) => {
            const citation = formatCitation(article);
            
            return (
              <div
                key={article.uid}
                className="space-y-3 pb-5 border-b border-border/30 last:border-0"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  <Badge variant="outline" className="text-xs bg-primary/5 whitespace-nowrap">
                    PubMed ID: {article.uid}
                  </Badge>
                </div>

                {article.authors && article.authors.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <p className="truncate">
                      {article.authors
                        .slice(0, 3)
                        .map((author) => author.name)
                        .join(", ")}
                      {article.authors.length > 3 ? " et al." : ""}
                    </p>
                  </div>
                )}

                {article.pubdate && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <p>{formatDate(article.pubdate)}</p>
                  </div>
                )}

                {article.fulljournalname && (
                  <div className="flex items-center gap-1 text-sm italic">
                    <Award className="h-3 w-3 flex-shrink-0 text-primary/70" />
                    <p>
                      {article.fulljournalname}
                      {article.volume && `, Volume ${article.volume}`}
                      {article.issue && `, Issue ${article.issue}`}
                      {article.pages && `, Pages ${article.pages}`}
                    </p>
                  </div>
                )}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`abstract-${index}`} className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                      <span className="flex items-center gap-1">
                        <FileSearch className="h-3 w-3" /> Abstract
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {(article.description || article.abstract) ? (
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          <p className="whitespace-pre-line">{article.description || article.abstract}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No abstract available for this article.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    asChild
                  >
                    <a
                      href={article.formattedUrl || `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View on PubMed
                    </a>
                  </Button>
                  
                  {article.articleids?.some(id => id.idtype === "doi") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      asChild
                    >
                      <a
                        href={`https://doi.org/${article.articleids.find(id => id.idtype === "doi")?.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        <FileDigit className="h-3 w-3" /> View Full Article
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground bg-muted/20 p-2 rounded">
                  <p className="font-medium">Citation:</p>
                  <p className="italic">{citation}</p>
                </div>
              </div>
            );
          })}

          {articles.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No research articles found</p>
              <p className="text-sm mt-2">Try refining your search with more specific medical terms</p>
            </div>
          )}

          <div className="mt-4 pt-2 text-xs text-muted-foreground border-t border-border/30">
            <p className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Source: PubMed - National Library of Medicine (NLM), National Institutes of Health (NIH)
            </p>
            <p className="mt-1 text-xs">
              Disclaimer: This information is provided for educational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
