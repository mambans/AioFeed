import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AccountModal from "../account/AccountModal";
import AccountProvider from "./../account/AccountProvider";
import ChannelPage from "./../twitch/channelPage/Index";
import CreateAccountModal from "../account/CreateAccountModal";
import Feed from "../feed/Index";
import FeedsProvider from "./../feed/FeedsProvider";
import Footer from "../footer/Index";
import Home from "../home/Index";
import Legality from "../legality/Index";
import LoginModal from "../account/LoginModal";
import Navbar from "../navigation/Index";
import NavigationProvider from "./../navigation/NavigationProvider";
import NoMatch from "./NoMatch";
import NotificationsProvider from "./../notifications/NotificationsProvider";
import Player from "./../twitch/player/Player";
import PlayerClip from "../twitch/player/PlayerClip";
import style from "./Routes.module.scss";
import TopStreams from "../twitch/categoryTopStreams/Index";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import VodsProvider from "./../twitch/vods/VodsProvider";
import YoutubeAuth from "../auth/YoutubeAuth";
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";

export default () => {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <NotificationsProvider>
          <AccountProvider>
            <FeedsProvider>
              <Navbar fixed />
              <Route
                render={({ location }) => {
                  const { key } = location;

                  return (
                    <TransitionGroup component={null}>
                      <CSSTransition key={key} timeout={200} classNames='fade-02'>
                        <main id={style.contentContainer}>
                          <Switch location={location}>
                            <Route exact path={["/", "/index", "/home"]} component={Home} />
                            <Route
                              exact
                              path='/feed'
                              render={() => {
                                return (
                                  <VodsProvider>
                                    <Feed />
                                  </VodsProvider>
                                );
                              }}
                            />
                            <Route
                              exact
                              path={["/live/:id", "/player/:id", "/video/:id", "/vod/:id"]}>
                              <Player />
                            </Route>
                            <Route exact path={["/channel/:id", "/c/:id"]}>
                              <ChannelPage />
                            </Route>
                            <Route exact path='/clip/:id'>
                              <PlayerClip />
                            </Route>
                            <Route exact path={["/game/:category?", "/category/:category?"]}>
                              <TopStreams />
                            </Route>
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
                            <Route
                              exact
                              path='/account'
                              render={() => (
                                <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                                  <AccountModal></AccountModal>
                                </div>
                              )}
                            />
                            <Route
                              exact
                              path='/account/create'
                              render={() => (
                                <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                                  <CreateAccountModal />
                                </div>
                              )}
                            />
                            <Route
                              exact
                              path='/account/login'
                              render={() => (
                                <div style={{ width: "1000px", margin: "auto", marginTop: "55px" }}>
                                  <LoginModal />;
                                </div>
                              )}
                            />
                            <Route exact path={["/legality", "/privacy"]} component={Legality} />
                            <Route component={NoMatch} />
                          </Switch>
                        </main>
                      </CSSTransition>
                    </TransitionGroup>
                  );
                }}
              />
              <Footer />
            </FeedsProvider>
          </AccountProvider>
        </NotificationsProvider>
      </NavigationProvider>
    </BrowserRouter>
  );
};
