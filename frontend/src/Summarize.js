import React, { useRef, useState } from 'react';
import './Summarize.css';
import { Radio, Upload, Input, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import fileTypes from './fileTypes';

const { TextArea } = Input;

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

  const handleSummaryTypeChange = (e) => {
    setSummaryType(e.target.value);
  };





  const renderFileOption = () => {
    return (
      <Upload>
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
  const renderWebsiteOption = () => <Input placeholder="Enter Website or Youtube URL"  className='Website'/>
  const renderTextOption = () => <TextArea rows={10} className='TextArea'/>
  
  return (
    <div className='FileBox'>
      <h2>Select file type to summarize</h2>
      <Radio.Group onChange={handleSummaryTypeChange} value={summaryType} className='RadioGroup'>
        <Radio value="file">File</Radio>
        <Radio value="website">Website/Youtube</Radio>
        <Radio value="text">Free Text</Radio>
      </Radio.Group>
      <div className='Input'>
        {summaryType === 'file' && renderFileOption() }
        {summaryType === 'website' && renderWebsiteOption() }
        {summaryType === 'text' && renderTextOption() }
      </div>
      <Button type="primary" className='Button'>
        Generate Summary
      </Button>
    </div>
    )
}

export default Summarize