import React from 'react';
import { commentsStore, User } from '/stores';

export default class CommentInput extends React.Component<{currentUser: User, slug: string}> {
    state = {
      body: ''
    }

    handleBodyChange = ev => {
      this.setState({ body: ev.target.value });
    }

    createComment = ev => {
      ev.preventDefault();
      commentsStore.createComment({ body: this.state.body })
        .then(() => this.setState({ body: '' }));
    }

  render() {
    const { isCreatingComment } = commentsStore;
    return (
      <form className="card comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={this.state.body}
            disabled={isCreatingComment}
            onChange={this.handleBodyChange}
            rows={3}
          />
        </div>
        <div className="card-footer">
          <img
            src={this.props.currentUser.image}
            className="comment-author-img"
            alt=""
          />
          <button
            className="btn btn-sm btn-primary"
            type="submit"
          >
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}
