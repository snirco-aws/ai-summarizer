import React, { useRef, useState,useEffect } from 'react';
import './Summarize.css';
import { Radio, Upload, Input, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import fileTypes from './fileTypes';
import { API,  Hub, Auth } from 'aws-amplify';
import axios from 'axios';
const { TextArea } = Input;

const preSignedUrlAPIUName = 'S3SignedURLAPI';

const acceptableFileTyoes={
  'text/*': ['.txt'],
  'application/pdf': ['.pdf'],
  'video/*': ['.mp3', '.mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls', '.xlsm']
}

const maxFileSize=209715200

const Summarize = () => {

  const [summaryType, setSummaryType] = useState('file');
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [processing, setProcessing] = useState(false);
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
        default:
          break;
      }
    });
    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  const handleSummaryTypeChange = (e) => {
    setSummaryType(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if ((summaryType=='free-text' || summaryType=="link") && inputValue){
      let myfile={}
      myfile.type="text/plain"
      myfile.name=Date.now()  +".gensum"
      myfile.value=inputValue
      myfile.inputType=summaryType
      handleUpload(myfile)
  }
  };

  const handleUpload= (file)=>{
    setProcessing(true);
    API.get(preSignedUrlAPIUName, '/', {
      queryStringParameters: {
        'contentType': file.type,
        'name': encodeURIComponent(file.name),
        "email": encodeURIComponent(user.attributes.email)
      }
    })
      .then((response) => {
        axios.put(response.uploadURL, file, {
          headers: {
            'content-type': file.type
          }
        }).catch((error) => {
          setError(error);
          console.error(error);
        });
      })
      setTimeout(() => {
        setProcessing(false);
        setInputValue('');
      }, 7000);
  }

  const renderFileOption = () => {
    return (
      <Upload  accept={Object.keys(fileTypes).join(',')}  beforeUpload={(file) =>  handleUpload(file)}>
        <Button>
          <UploadOutlined />
          Upload File
        </Button>
        <div className='SupportedFileTypes'>
          Supported File Type:
          {fileTypes}
        </div>
      </Upload>
    )
  }
  const renderWebsiteOption = () => <Input placeholder="Enter Website or Youtube URL"  className='Website' onChange={handleInputChange} />
  const renderTextOption = () => <TextArea rows={10} className='TextArea'  onChange={handleInputChange} />
  
  return (
    <div className='FileBox'>
      <h2>Select file type to summarize</h2>
      <Radio.Group onChange={handleSummaryTypeChange} value={summaryType} className='RadioGroup' >
        <Radio value="upload">File</Radio>
        <Radio value="link">Website/Youtube</Radio>
        <Radio value="free-text">Free Text</Radio>
      </Radio.Group>
      <div className='Input'>
        {summaryType === 'upload' && renderFileOption() }
        {summaryType === 'link' && renderWebsiteOption() }
        {summaryType === 'free-text' && renderTextOption() }
      </div>
      <Button type="primary" className='Button' onClick={handleSubmit}>
        Generate Summary
      </Button>

      {processing && <p><div class="loader "></div>
            Working on it! , 
              Go to "Job History" to see your summary</p>}
    </div>
    )
}

export default Summarize