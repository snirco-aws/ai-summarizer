import { Button, Tooltip } from 'antd';
import { DownloadOutlined, EyeTwoTone, DeleteTwoTone } from '@ant-design/icons'

const ButtonGroup = Button.Group;
const columns = (deleteJob, getJobSummary, downloadSummary) => {

  return ([{
    title: 'User',
    dataIndex: 'username',
    key: 'username',
    width: '15%'
  }, {
    title: 'File Name',
    dataIndex: 'objectKey',
    key: 'objectKey',
    width: '15%'
  }, {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
    render: (date) => new Date(date).toDateString(),
    width: '25%',
  },
  {
    title: 'Job Status',
    dataIndex: 'jobStatus',
    key: 'jobStatus',
    render: (text) => {
      const statusColors = {
        in_progress: 'grey',
        completed: 'green',
        failed: 'red',
      }
      return <span style={{ color: statusColors[text] }}>{text.replace('_', ' ').toUpperCase()}</span>
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (job) => {
      const disabled = job.jobStatus === 'in_progress' 
      // || job.jobStatus === 'failed'

      return (
        <ButtonGroup>
          <Tooltip title="Preview">
            <Button type='text' disabled={ disabled } onClick={getJobSummary({ eTag: job.eTag, username: job.username })}>
              <EyeTwoTone />
            </Button>
          </Tooltip>
          <Tooltip title="Download">
            <Button type='text' disabled={ disabled } onClick={downloadSummary({ eTag: job.eTag, username: job.username })}>
              <DownloadOutlined/>
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type='text' onClick={deleteJob({ eTag: job.eTag, username: job.username })}>
              <DeleteTwoTone twoToneColor="#eb2f96"/>  
            </Button>
          </Tooltip>
        </ButtonGroup>
      )
    }
  }]);
}

export default columns