/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Visualization Component',
    imageUrl: 'img/hero/semantic.png',
    description: (
      <>
        MapillaryJS client-side JavaScript library for building street imagery
        map experiences on the web. You can use MapillaryJS as a component in
        your web application with just a few lines of code.
      </>
    ),
  },
  {
    title: 'Interact and Navigate',
    imageUrl: 'img/hero/mjs.png',
    description: (
      <>
        MapillaryJS takes spatial, semantic, and texture data and renders it
        using WebGL. You can interact with the undistorted virtual 3D world and
        navigate the imagery on the street level or from a bird&apos;s eye view.
      </>
    ),
  },
  {
    title: 'Extend and Augment',
    imageUrl: 'img/hero/dropoff.png',
    description: (
      <>
        You can use the extension APIs to customize and augment the MapillaryJS
        experience with your own data providers, semantic meshes, 3D models,
        animations, camera controls, and user interactivity.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img
            className={clsx(styles.featureImage, 'margin-vert--md')}
            src={imgUrl}
            alt={title}
          />
        </div>
      )}
      <div className="text--center">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img
            className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
            alt="Mapillary logo"
            src={useBaseUrl('img/logo_black.svg')}
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({title, imageUrl, description}) => (
                  <Feature
                    key={title}
                    title={title}
                    imageUrl={imageUrl}
                    description={description}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
