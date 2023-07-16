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
      const color = text === 'in progress' ? 'black' : 'green'
      return <span style={{ color: color }}>{"in_progress" ? 'In Progress' : 'Completed'}</span>
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (job) => {
      return (
        <ButtonGroup>
          <Tooltip title="Preview">
            <Button type='text' onClick={getJobSummary({ eTag: job.eTag, username: job.username })}>
              <EyeTwoTone />
            </Button>
          </Tooltip>
          <Tooltip title="Download" onClick={downloadSummary({ eTag: job.eTag, username: job.username })}>
            <Button type='text'>
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