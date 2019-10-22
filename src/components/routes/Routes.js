import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Feed from "../feed/Feed";
import HandleRefresh from "../navigation/HandleRefresh";
import Home from "../home/Home";
import NoMatch from "../navigation/NoMatch";
import NotifiesAccount from "../account/NotifiesAccount";
import NotifiesCreateAccount from "../account/NotifiesCreateAccount";
import NotifiesLogin from "../account/NotifiesLogin";
import NavigationBar from "../navigation/Navigation";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import YoutubeAuth from "../auth/YoutubeAuth";
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";
import style from "./Routes.module.scss";

import TwitterAuth from "../twitter/TwitterAuth";
import streamOnlineWebhook from "../twitch/Twitchwebhooks";

function Routes() {
  return (
    <Router>
      <HandleRefresh>
        {data => (
          <>
            <NavigationBar fixed data={data} />
            <div id={style.contentContainer}>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/index' component={Home} />
                <Route exact path='/home' component={Home} />
                <Route
                  exact
                  path='/feed'
                  // component={Feed}
                  render={() => {
                    return <Feed data={data} />;
                  }}
                />
                <Route exact path='/twitch/notifications' component={streamOnlineWebhook} />
                <Route exact path='/auth/youtube' component={YoutubeAuth} />
                <Route exact path='/auth/twitch' component={TwitchAuth} />
                <Route
                  exact
                  path='/auth/twitch/callback'
                  // component={TwitchAuthCallback}
                  render={() => {
                    return <TwitchAuthCallback data={data} />;
                  }}
                />
                <Route
                  exact
                  path='/auth/youtube/callback'
                  // component={YoutubeAuthCallback}
                  render={() => {
                    return <YoutubeAuthCallback data={data} />;
                  }}
                />
                <Route exact path='/auth/twitter' component={TwitterAuth} />
                <Route exact path='/auth/twitter/callback' component={TwitterAuth} />
                <Route exact path='/account' render={() => <NotifiesAccount data={data} />} />
                <Route
                  exact
                  path='/account/create'
                  render={() => <NotifiesCreateAccount data={data} />}
                />
                <Route exact path='/account/login' render={() => <NotifiesLogin data={data} />} />

                <Route component={NoMatch} />
              </Switch>
            </div>
          </>
        )}
      </HandleRefresh>
    </Router>
  );
}

export default Routes;
