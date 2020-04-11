import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { AccountProvider } from "./../account/AccountContext";
import ChannelPage from "./../twitch/channelPage";
import Feed from "../feed";
import { FeedsProvider } from "./../feed/FeedsContext";
import Footer from "../footer";
import Home from "../home";
import Legality from "../legality";
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
                      <CSSTransition key={key} timeout={200} classNames='RoutesFade'>
                        <main id={style.contentContainer}>
                          <Switch location={location}>
                            <Route exact path={["/", "/index", "/home"]}>
                              <Home />
                            </Route>
                            <Route exact path='/feed'>
                              <Feed />
                            </Route>
                            <Route
                              exact
                              path={["/live/:id", "/player/:id", "/video/:id", "/vod/:id"]}
                              children={<Player />}
                            />
                            <Route
                              exact
                              path={["/channel/:id", "/c/:id"]}
                              children={<ChannelPage />}
                            />
                            <Route exact path='/clip/:id' children={<PlayerClip />} />
                            <Route
                              exact
                              path={["/game/:category?", "/category/:category?", "/top/:category?"]}
                              children={<TopStreams />}
                            />
                            <Route exact path='/auth/youtube'>
                              <YoutubeAuth />
                            </Route>
                            <Route exact path='/auth/twitch'>
                              <TwitchAuth />
                            </Route>
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
                            <Route exact path={["/legality", "/privacy"]}>
                              <Legality />
                            </Route>
                            <Route>
                              <NoMatch />
                            </Route>
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
