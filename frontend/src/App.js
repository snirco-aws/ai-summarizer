import './App.css';
import Summarizer from './Summarizer';
// import { Amplify } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import awsconfig from './aws-exports';
// import '@aws-amplify/ui-react/styles.css';

// Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Summarizer/>
      </header>
    </div>
  );
}

export default App;
