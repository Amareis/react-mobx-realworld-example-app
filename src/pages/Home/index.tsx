import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import { observer } from 'mobx-react';
import { commonStore } from '/stores';

@observer
export default class Home extends React.Component {
  componentDidMount() {
    commonStore.loadTags();
  }

  render() {
    const { tags, token, appName } = commonStore;
    return (
      <div className="home-page">

        <Banner token={token} appName={appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={tags}
                />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
