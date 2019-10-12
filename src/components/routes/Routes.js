import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HandleRefresh from "../navigation/HandleRefresh";
import Home from "../home/Home";
import Feed from "../feed/Feed";
import YoutubeAuth from "../auth/YoutubeAuth";
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import NotifiesCreateAccount from "../account/NotifiesCreateAccount";
import NotifiesLogin from "../account/NotifiesLogin";
import NotifiesAccount from "../account/NotifiesAccount";
import NoMatch from "../navigation/NoMatch";
import NavigationBar from "../navigation/Navigation";

import YoutubeNewVideo from "../youtube/YoutubeNewVideo";
import TwitterAuth from "../twitter/TwitterAuth";
import streamOnlineWebhook from "../twitch/Twitchwebhooks";

function Routes() {
  return (
    <Router>
      <HandleRefresh>
        {data => (
          <>
            <NavigationBar data={data} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/index' component={Home} />
              <Route exact path='/home' component={Home} />
              <Route
                exact
                path='/feed'
                component={Feed}
                // render={() => {
                //   return <Feed />;
                // }}
              />
              <Route exact path='/twitch/notifications' component={streamOnlineWebhook} />
              <Route exact path='/youtube/notifications' component={YoutubeNewVideo} />
              <Route exact path='/auth/youtube' component={YoutubeAuth} />
              <Route exact path='/auth/twitch' component={TwitchAuth} />
              <Route exact path='/auth/twitch/callback' component={TwitchAuthCallback} />
              <Route exact path='/auth/youtube/callback' component={YoutubeAuthCallback} />
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
          </>
        )}
      </HandleRefresh>
    </Router>
  );
}

export default Routes;
