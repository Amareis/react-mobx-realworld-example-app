import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import RedError from "/components/RedError";
import LoadingSpinner from "/components/LoadingSpinner";
import ArticleList from "/components/ArticleList";
import { articlesStore, profileStore, userStore } from "/stores";

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn"
      >
        <i className="ion-gear-a" /> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }

  let classes = "btn btn-sm action-btn";
  if (props.following) {
    classes += " btn-secondary";
  } else {
    classes += " btn-outline-secondary";
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.following) {
      props.unfollow(props.username);
    } else {
      props.follow(props.username);
    }
  };

  return (
    <button className={classes} onClick={handleClick}>
      <i className="ion-plus-round" />
      &nbsp;
      {props.following ? "Unfollow" : "Follow"} {props.username}
    </button>
  );
};

@withRouter
@observer
export default class Profile extends React.Component {
  componentWillMount() {
    articlesStore.setPredicate(this.getPredicate());
  }

  componentDidMount() {
    profileStore.loadProfile(this.props.match.params.username);
    articlesStore.loadArticles();
  }

  componentDidUpdate(previousProps) {
    if (this.props.location !== previousProps.location) {
      profileStore.loadProfile(this.props.match.params.username);
      articlesStore.setPredicate(this.getPredicate());
      articlesStore.loadArticles();
    }
  }

  getTab() {
    if (/\/favorites/.test(this.props.location.pathname)) return "favorites";
    return "all";
  }

  getPredicate() {
    switch (this.getTab()) {
      case "favorites":
        return { favoritedBy: this.props.match.params.username };
      default:
        return { author: this.props.match.params.username };
    }
  }

  handleFollow = () => profileStore.follow();
  handleUnfollow = () => profileStore.unfollow();

  handleSetPage = page => {
    articlesStore.setPage(page);
    articlesStore.loadArticles();
  };

  renderTabs() {
    const { profile } = profileStore;
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            isActive={(match, location) => {
              return location.pathname.match("/favorites") ? false : true;
            }}
            to={`/@${profile.username}`}
          >
            My Articles
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to={`/@${profile.username}/favorites`}>
            Favorited Articles
          </NavLink>
        </li>
      </ul>
    );
  }

  render() {
    const { profile, isLoadingProfile } = profileStore;
    const { currentUser } = userStore;

    if (isLoadingProfile && !profile) return <LoadingSpinner />;
    if (!profile) return <RedError message="Can't load profile" />;

    const isUser = currentUser && profile.username === currentUser.username;

    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={profile.image} className="user-img" alt="" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                  isUser={isUser}
                  username={profile.username}
                  following={profile.following}
                  follow={this.handleFollow}
                  unfollow={this.handleUnfollow}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">{this.renderTabs()}</div>

              <ArticleList
                articles={articlesStore.articles}
                totalPagesCount={articlesStore.totalPagesCount}
                onSetPage={this.handleSetPage}
                loading={articlesStore.isLoading}
                currentPage={1}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Profile };
