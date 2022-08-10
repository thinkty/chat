import React from 'react';

type Props = {
  message: string;
} & typeof defaultProps;

const defaultProps = {
  message: 'Hello World!',
};

export const App = (props: Props): JSX.Element => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>
        { props.message }
      </h1>
    </div>
  );
}
App.defaultProps = defaultProps;
