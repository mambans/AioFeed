import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AccountModal from "../account/AccountModal";
import { AccountProvider } from "./../account/AccountContext";
import ChannelPage from "./../twitch/channelPage";
import CreateAccountModal from "../account/CreateAccountModal";
import Feed from "../feed";
import { FeedsProvider } from "./../feed/FeedsContext";
import Footer from "../footer";
import Home from "../home";
import Legality from "../legality";
import LoginModal from "../account/LoginModal";
import Navbar from "../navigation";
import { NavigationProvider } from "./../navigation/NavigationContext";
import NoMatch from "./NoMatch";
import { NotificationsProvider } from "./../notifications/NotificationsContext";
import Player from "./../twitch/player/Player";
import PlayerClip from "../twitch/player/PlayerClip";
import style from "./Routes.module.scss";
import TopStreams from "../twitch/categoryTopStreams";
import TwitchAuth from "../auth/TwitchAuth";
import TwitchAuthCallback from "../auth/TwitchAuthCallback";
import { VodsProvider } from "./../twitch/vods/VodsContext";
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
