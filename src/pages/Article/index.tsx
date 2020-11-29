import React from "react";
import { observer } from "mobx-react";
import { withRouter, BrowserRouterProps } from "react-router-dom";
import marked from "marked";

import RedError from "/components/RedError";
import ArticleMeta from "./ArticleMeta";
import CommentContainer from "./CommentContainer";
import { articlesStore, commentsStore, userStore } from "/stores";

@withRouter
@observer
export default class Article extends React.Component {
  componentDidMount() {
    const slug = this.props.match.params.id;
    articlesStore.loadArticle(slug, { acceptCached: true });
    commentsStore.setArticleSlug(slug);
    commentsStore.loadComments();
  }

  handleDeleteArticle = slug => {
    articlesStore
      .deleteArticle(slug)
      .then(() => this.props.history.replace("/"));
  };

  handleDeleteComment = id => {
    commentsStore.deleteComment(id);
  };

  render() {
    const slug = this.props.match.params.id;
    const { currentUser } = userStore;
    const { comments, commentErrors } = commentsStore;
    const article = articlesStore.getArticle(slug);

    if (!article) return <RedError message="Can't load article" />;

    const markup = { __html: marked(article.body, { sanitize: true }) };
    const canModify =
      currentUser && currentUser.username === article.author.username;
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>
            <ArticleMeta
              article={article}
              canModify={canModify}
              onDelete={this.handleDeleteArticle}
            />
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-xs-12">
              <div dangerouslySetInnerHTML={markup} />

              <ul className="tag-list">
                {article.tagList.map(tag => {
                  return (
                    <li className="tag-default tag-pill tag-outline" key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions" />

          <div className="row">
            <CommentContainer
              comments={comments}
              errors={commentErrors}
              slug={slug}
              currentUser={currentUser}
              onDelete={this.handleDeleteComment}
            />
          </div>
        </div>
      </div>
    );
  }
}
