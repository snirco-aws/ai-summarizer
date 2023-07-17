import React, { useMemo, useState, useEffect } from 'react';
import './Summarizer.css'
import Summarize from './Summarize'
import JobHistory from './JobHistory'
import { Tabs, Layout, Button } from 'antd'
import { API, Auth, Hub } from 'aws-amplify';
const { Header, Footer, Content } = Layout

const Summarizer = ({  signOut }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
          console.log("signIn_failure1")
          break;
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
        default:
          break;
      }
    });

    Hub.listen('auth', (data) => {
      if (data.payload.event === 'signIn_failure') {
        console.log("signIn_failure2")
      }
    })

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  const items = [
    { label: 'Summarize', key: '1', children: <Summarize /> },
    { label: 'Job History', key: '2', children: <JobHistory /> },
  ]

  return (
    <div>
      <Layout>
        <Header className="Header" color="blue-4">
          <div className="logo">GenSum AI</div>
          <div>  <span className="user-name">{user ? user.attributes.email : ''}</span>
            {!user ? (
                <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>Sign In</button>
            ) : (
       
              <button onClick={() => Auth.signOut()}>Sign Out</button>
            )}
          </div>
        </Header>
        <Content className="Content">
          <Tabs
            defaultActiveKey="1"
            className="Tabs"
            type="card"
            items={items}
          />
        </Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </div>
  )
}

export default Summarizer
