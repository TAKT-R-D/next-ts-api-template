import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

const ApiDocuments: NextPage = () => {
  return (
    <div>
      <Head>
        <title>API Documents</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <API
        apiDescriptionUrl="/elements/ZJ6wMNW4Md4NEu.yaml"
        basePath="/docs"
        router="memory"
      />
    </div>
  );
};

export default ApiDocuments;
