import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Feed from "../feed/Feed";
import FeedsContext from "./../feed/FeedsContext";
import FeedsProvider from "./../feed/FeedsProvider";
import Footer from "../footer/Footer";
import Home from "../home/Home";
import Legality from "../legality/Legality";
import NavigationBar from "../navigation/Navigation";
import NavigationContext from "./../navigation/NavigationContext";
import NavigationProvider from "./../navigation/NavigationProvider";
import NoMatch from "./NoMatch";
import NotificationsProvider from "./../notifications/NotificationsProvider";
import NotifiesAccount from "../account/NotifiesAccount";
import NotifiesCreateAccount from "../account/NotifiesCreateAccount";
import NotifiesLogin from "../account/NotifiesLogin";
import RenderTopStreams from "../twitch/top/RenderTopStreams";
import streamOnlineWebhook from "../twitch/Twitchwebhooks";
import style from "./Routes.module.scss";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import TwitterAuth from "../twitter/TwitterAuth";
import YoutubeAuth from "../auth/YoutubeAuth";
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";
import AccountProvider from "./../account/AccountProvider";

const Routes = () => {
  return (
    <Router>
      <NavigationProvider>
        <NotificationsProvider>
          <AccountProvider>
            <FeedsProvider>
              <NavigationBar fixed />
              <main id={style.contentContainer}>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/index' component={Home} />
                  <Route exact path='/home' component={Home} />
                  <Route
                    exact
                    path='/feed'
                    render={() => {
                      return (
                        <NavigationContext.Consumer>
                          {navProps => {
                            return (
                              <FeedsContext.Consumer>
                                {props => {
                                  return <Feed {...props} {...navProps} />;
                                }}
                              </FeedsContext.Consumer>
                            );
                          }}
                        </NavigationContext.Consumer>
                      );
                    }}
                  />
                  <Route path='/twitch/top/' component={RenderTopStreams} />
                  <Route exact path='/twitch/notifications' component={streamOnlineWebhook} />
                  <Route exact path='/auth/youtube' component={YoutubeAuth} />
                  <Route exact path='/auth/twitch' component={TwitchAuth} />
                  <Route
                    exact
                    path='/auth/twitch/callback'
                    render={() => {
                      return <TwitchAuthCallback />;
                    }}
                  />
                  <Route
                    exact
                    path='/auth/youtube/callback'
                    render={() => {
                      return <YoutubeAuthCallback />;
                    }}
                  />
                  <Route exact path='/auth/twitter' component={TwitterAuth} />
                  <Route exact path='/auth/twitter/callback' component={TwitterAuth} />
                  <Route
                    exact
                    path='/account'
                    render={() => (
                      <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                        <NavigationContext.Consumer>
                          {navProps => {
                            return (
                              <FeedsContext.Consumer>
                                {feedsProps => {
                                  return (
                                    <NotifiesAccount
                                      {...feedsProps}
                                      {...navProps}></NotifiesAccount>
                                  );
                                }}
                              </FeedsContext.Consumer>
                            );
                          }}
                        </NavigationContext.Consumer>
                      </div>
                    )}
                  />
                  <Route
                    exact
                    path='/account/create'
                    render={() => (
                      <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                        <NotifiesCreateAccount />
                      </div>
                    )}
                  />
                  <Route
                    exact
                    path='/account/login'
                    render={() => (
                      <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                        <NavigationContext.Consumer>
                          {navProps => {
                            return <NotifiesLogin {...navProps} />;
                          }}
                        </NavigationContext.Consumer>
                      </div>
                    )}
                  />
                  <Route exact path='/legality' component={Legality} />

                  <Route component={NoMatch} />
                </Switch>
              </main>
              <Footer />
            </FeedsProvider>
          </AccountProvider>
        </NotificationsProvider>
      </NavigationProvider>
    </Router>
  );
};

export default Routes;
