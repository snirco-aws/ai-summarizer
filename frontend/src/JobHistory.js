import React, { useEffect, useState, useRef } from 'react';
import './JobHistory.css';
import { Table, Modal, Button, Tooltip } from 'antd';
import columns from './tableColumns';
import axios from 'axios';
import { ReloadOutlined } from '@ant-design/icons';
import constants from './constants'

const JobHistory = ({  user,token }) => {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState('');
  const [summariesCache, setSummariesCache] = useState({});
  const [downloadRequested, setDownloadRequested] = useState(false);

  const dataLoaded = useRef(false)

  useEffect(() => {
    if (!dataLoaded.current) {
      fetchJobs(user.attributes.email);  
      dataLoaded.current = true;
    }
  }, [])

  useEffect(() => {
    if (summariesCache[activeJob] && downloadRequested) {
      runDownload()
      setDownloadRequested(false)
    }
  }, [downloadRequested, summariesCache[activeJob]])

  const fetchJobs = async (username) => {
    console.log(username)
    setLoading(true);
    const res = await axios.post(constants.base + constants.getJobs, {
      username
    }, { headers: {  'Authorization': token }  })
    console.log(res)
    const parsedData = res.data.map(item => {
      const objectKey = item.objectKey.replace('data/', '').replace('.gensum', ' - url');
      return { ...item, objectKey };
    });
    setJobs(parsedData);
    setLoading(false);
  };

  const deleteJob = ({ eTag, username }) => async () => {
    setLoading(true)
    const res = await axios.post(constants.base + constants.deleteJob, {
      eTag,
      username,
    }, { headers: {  'Authorization': token }  }
    )
    if (res.status === 200) {
      fetchJobs(user.attributes.email)
    }
  }

  const fetchSummary = ({ eTag, username }) => {
    return axios.post(constants.base + constants.getJobSummary, {
      eTag,
      username,
    }, { headers: {  'Authorization': token }  })
  }

  const getJobSummary = ({ eTag, username }) => async () => {
    setIsModalOpen(true);
    if (summariesCache[eTag]) {
      setActiveJob(eTag)
      return
    }
    const res = await fetchSummary({ eTag, username  })
    if (res.status === 200) {
      setSummariesCache({ ...summariesCache, [eTag]: res.data.summary })
      setActiveJob(eTag)
    }
  }

  const handleOk = () => {    
    setIsModalOpen(false);
    setActiveJob('')
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setActiveJob('')
  };

  const runDownload = () => {
    const blob = new Blob([summariesCache[activeJob]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Job Summary.txt`;
    link.click();
  }

  const downloadSummary = ({ eTag, username }) => async () => {
    if (!summariesCache[eTag]) {
      fetchSummary({ eTag, username }).then(res => {
        setSummariesCache({ ...summariesCache, [eTag]: res.data.summary })
        setActiveJob(eTag)
        setDownloadRequested(true)
      })
    } else runDownload()
  }

  const renderJobs = (jobs) => {
    return (
    <>
      <Table
        className='Table'
        loading={loading}
        columns={columns(deleteJob, getJobSummary, downloadSummary)}
        dataSource={jobs}
        rowKey={(record) => record.eTag}
      />
      <Modal title="Job Summary" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>{summariesCache[activeJob]}</p>
      </Modal>
    </>
    )
  }

  return (
    <div className='FileBox'>
      <div className='FileBoxHeader'>
        <h2>Your Summarizing Jobs History</h2>
        <Tooltip title="Refresh Jobs">
          <Button className='RefreshButton'  onClick={() => fetchJobs(user.attributes.email)} icon={<ReloadOutlined />} />
          
        </Tooltip>
      </div>
      { renderJobs(jobs) }
    </div>
    )
}

export default JobHistory