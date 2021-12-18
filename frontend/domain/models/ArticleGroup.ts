export interface ArticleGroup {
  id: string,
  title: string,
  children: ArticleGroup[],
  articleId: string | null,
}
