import ArticlePreview from './ArticlePreview';
import ListPagination, { PaginationProps } from './ListPagination';
import LoadingSpinner from './LoadingSpinner';
import React from 'react';
import type { Article } from '/stores';

const ArticleList = (props: {
    loading: boolean
    articles: Article[]  
} & PaginationProps) => {
  if (props.loading && props.articles.length === 0) {
    return (
      <LoadingSpinner />
    );
  }

  if (props.articles.length === 0) {
    return (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    );
  }

  return (
    <div>
      {
        props.articles.map(article => {
          return (
            <ArticlePreview article={article} key={article.slug} />
          );
        })
      }

      <ListPagination
        onSetPage={props.onSetPage}
        totalPagesCount={props.totalPagesCount}
        currentPage={props.currentPage}
      />
    </div>
  );
};

export default ArticleList;
