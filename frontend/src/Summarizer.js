import React, { useState, useEffect } from 'react';
import './Summarizer.css'
import Summarize from './Summarize'
import JobHistory from './JobHistory'
import { Tabs, Layout } from 'antd'
import { Auth, Hub } from 'aws-amplify';
const { Header, Footer, Content } = Layout

const Summarizer = ({  signOut }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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
    getToken().then(userToken => setToken(userToken));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }


  const getToken = async () => {  
    let session= await Auth.currentSession().catch(() => console.log('Not signed in'));
    if (!session) {
      return null
    }
    let jwt =  session.getIdToken().getJwtToken()
    return jwt
  }

  const items = [
    { label: 'Summarize', key: '1', children: <Summarize user={user} token={token}/> },
    { label: 'Job History', key: '2', children: <JobHistory user={user} token={token}/> },
  ]

  return (
    <div>
      <Layout>
        <Header className="Header" color="black-4">
          <div className="logo">GenSum AI - general summerizer</div>
          <div>  <span className="user-name">{user ? user.attributes.email : ''}</span>
            {!user ? (
                <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>Sign In</button>
            ) : (
       
              <button onClick={() => Auth.signOut()}>Sign Out</button>
            )}
          </div>
        </Header>
        <Content className="Content">
        {user ? (
          <Tabs
            defaultActiveKey="1"
            className="Tabs"
            type="card"
            items={items}
            destroyInactiveTabPane
          />
          ) : (<div></div>)}
        </Content>
        { <Footer>Created by Dov Amir, Snir Cohen, Meidan Nasi</Footer> }
      </Layout>
    </div>
  )
}

export default Summarizer
