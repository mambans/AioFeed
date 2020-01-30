import React from "react";

import styles from "./Legality.module.scss";

const Legality = () => {
  const scrollTo = new URL(window.location.href).hash;

  if (scrollTo) {
    window.setTimeout(() => {
      const element = document.getElementById(scrollTo);
      element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 1);
  }

  return (
    <div className={styles.container}>
      <div id='#Conditions'>
        <h2>
          <a href='#Conditions'>Conditions of Use</a>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed justo convallis, finibus
          urna vel, pharetra nisl. Duis velit augue, efficitur nec justo non, vehicula ornare
          sapien. Etiam commodo bibendum justo, vitae tristique neque scelerisque vel. Maecenas
          vulputate, leo quis ornare varius, orci ligula tristique ex, vel vehicula ligula augue vel
          diam. Suspendisse ultrices aliquam eros eu commodo. Ut ultrices ipsum lacus, eu vestibulum
          nibh aliquet sit amet. Sed hendrerit lectus et est cursus, et commodo augue viverra.
          Maecenas varius lectus nulla, vel sagittis mi mollis in.
        </p>
        <p>
          Duis a nulla laoreet, maximus arcu sed, pharetra risus. Nulla non odio luctus, faucibus
          metus sed, consectetur mauris. Duis ultricies eros tortor, vel ullamcorper dui molestie
          vel. Praesent at fermentum urna, non congue leo. Etiam imperdiet nibh ut facilisis
          aliquam. Ut pharetra interdum turpis sit amet vestibulum. Suspendisse commodo dapibus
          mollis. Donec ut felis ante. Suspendisse maximus eu justo at tempor. Aenean felis tellus,
          accumsan ut pharetra molestie, gravida et nisi. Phasellus porttitor dapibus justo at
          porttitor. Pellentesque eu congue ante, ut semper est. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer eget purus maximus, rhoncus
          orci a, rutrum mauris.
        </p>
        <p>
          Donec sem sem, ornare id faucibus id, sagittis quis est. Sed finibus auctor risus, non
          congue eros vulputate in. Mauris auctor sed odio at elementum. Etiam laoreet luctus ante
          vel vestibulum. Vivamus a massa non mauris finibus feugiat. Duis aliquam purus ac dui
          aliquet pulvinar. Sed non blandit enim, cursus maximus diam. Aliquam venenatis sapien ac
          dictum posuere. Fusce sagittis ante vel ipsum gravida elementum.
        </p>
        <p>
          Duis a nulla laoreet, maximus arcu sed, pharetra risus. Nulla non odio luctus, faucibus
          metus sed, consectetur mauris. Duis ultricies eros tortor, vel ullamcorper dui molestie
          vel. Praesent at fermentum urna, non congue leo. Etiam imperdiet nibh ut facilisis
          aliquam. Ut pharetra interdum turpis sit amet vestibulum. Suspendisse commodo dapibus
          mollis. Donec ut felis ante. Suspendisse maximus eu justo at tempor. Aenean felis tellus,
          accumsan ut pharetra molestie, gravida et nisi. Phasellus porttitor dapibus justo at
          porttitor. Pellentesque eu congue ante, ut semper est. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer eget purus maximus, rhoncus
          orci a, rutrum mauris.
        </p>
        <p>
          Donec sem sem, ornare id faucibus id, sagittis quis est. Sed finibus auctor risus, non
          congue eros vulputate in. Mauris auctor sed odio at elementum. Etiam laoreet luctus ante
          vel vestibulum. Vivamus a massa non mauris finibus feugiat. Duis aliquam purus ac dui
          aliquet pulvinar. Sed non blandit enim, cursus maximus diam. Aliquam venenatis sapien ac
          dictum posuere. Fusce sagittis ante vel ipsum gravida elementum.
        </p>
      </div>
      <div id='#Privacy'>
        <h2>
          <a href='#Privacy'>Privacy Notice</a>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed justo convallis, finibus
          urna vel, pharetra nisl. Duis velit augue, efficitur nec justo non, vehicula ornare
          sapien. Etiam commodo bibendum justo, vitae tristique neque scelerisque vel. Maecenas
          vulputate, leo quis ornare varius, orci ligula tristique ex, vel vehicula ligula augue vel
          diam. Suspendisse ultrices aliquam eros eu commodo. Ut ultrices ipsum lacus, eu vestibulum
          nibh aliquet sit amet. Sed hendrerit lectus et est cursus, et commodo augue viverra.
          Maecenas varius lectus nulla, vel sagittis mi mollis in.
        </p>
        <p>
          Duis a nulla laoreet, maximus arcu sed, pharetra risus. Nulla non odio luctus, faucibus
          metus sed, consectetur mauris. Duis ultricies eros tortor, vel ullamcorper dui molestie
          vel. Praesent at fermentum urna, non congue leo. Etiam imperdiet nibh ut facilisis
          aliquam. Ut pharetra interdum turpis sit amet vestibulum. Suspendisse commodo dapibus
          mollis. Donec ut felis ante. Suspendisse maximus eu justo at tempor. Aenean felis tellus,
          accumsan ut pharetra molestie, gravida et nisi. Phasellus porttitor dapibus justo at
          porttitor. Pellentesque eu congue ante, ut semper est. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer eget purus maximus, rhoncus
          orci a, rutrum mauris.
        </p>
        <p>
          Donec sem sem, ornare id faucibus id, sagittis quis est. Sed finibus auctor risus, non
          congue eros vulputate in. Mauris auctor sed odio at elementum. Etiam laoreet luctus ante
          vel vestibulum. Vivamus a massa non mauris finibus feugiat. Duis aliquam purus ac dui
          aliquet pulvinar. Sed non blandit enim, cursus maximus diam. Aliquam venenatis sapien ac
          dictum posuere. Fusce sagittis ante vel ipsum gravida elementum.
        </p>
        <p>
          Duis a nulla laoreet, maximus arcu sed, pharetra risus. Nulla non odio luctus, faucibus
          metus sed, consectetur mauris. Duis ultricies eros tortor, vel ullamcorper dui molestie
          vel. Praesent at fermentum urna, non congue leo. Etiam imperdiet nibh ut facilisis
          aliquam. Ut pharetra interdum turpis sit amet vestibulum. Suspendisse commodo dapibus
          mollis. Donec ut felis ante. Suspendisse maximus eu justo at tempor. Aenean felis tellus,
          accumsan ut pharetra molestie, gravida et nisi. Phasellus porttitor dapibus justo at
          porttitor. Pellentesque eu congue ante, ut semper est. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer eget purus maximus, rhoncus
          orci a, rutrum mauris.
        </p>
      </div>
    </div>
  );
};

export default Legality;
