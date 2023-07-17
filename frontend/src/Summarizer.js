import React, { useState } from 'react'
import './Summarizer.css'
import Summarize from './Summarize'
import JobHistory from './JobHistory'
import { Tabs, Layout, Button } from 'antd'
const { Header, Footer, Content } = Layout

const Summarizer = ({ user, signOut }) => {
  const items = [
    { label: 'Summarize', key: '1', children: <Summarize /> },
    { label: 'Job History', key: '2', children: <JobHistory /> },
  ]

  return (
    <div>
      <Layout>
        <Header className="Header" color="blue-4">
          <div className="logo">GenSum AI</div>
          <div>
            {!user ? (
              'Login'
            ) : (
              <Button onClick={signOut} className="Button">
                Logout
              </Button>
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
        <Footer>Footer</Footer>
      </Layout>
    </div>
  )
}

export default Summarizer
