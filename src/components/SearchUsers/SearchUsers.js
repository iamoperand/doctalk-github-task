import React, { Component } from 'react';
import {
  Input,
  Icon,
  Table,
  Avatar,
  Card,
} from 'antd';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

import { githubApiRoutes } from '../../config/apiRoutes';
import { errorNotify } from '../helpers/messageNotify';
import Headings from '../StyledComponents/Headings';
import FlexCenteredDiv from '../StyledComponents/FlexCenteredDiv';


const {
  CenteredH1,
  CenteredH3,
  CenteredH4,
} = Headings;


const columns = [{
  title: 'Image',
  dataIndex: 'avatar_url',
  key: 'avatar_url',
  render: image => (
    <span>
      {<Avatar size={64} icon="user" src={image} />}
    </span>
  ),
}, {
  title: 'Username',
  dataIndex: 'login',
  key: 'login',
}];


class SearchUsers extends Component {
  state = {
    userName: '',
    users: [],
    count: 0,
    errors: {},
  }

  emitEmpty = () => {
    this.setState({ userName: '' });
  }

  onChangeUserName = async (e) => {
    const searchQuery = e.target.value;
    this.setState({ userName: searchQuery });

    if (searchQuery === '') {
      this.setState({
        users: [],
        count: 0,
        errors: {
          name: 'Input field can\'t be empty',
        },
      });

      return;
    }

    const axiosConfig = {
      method: 'GET',
      'User-Agent': 'TheRemotants',
    };

    try {
      const { data:
        {
          items,
        },
      } = await axios(`${githubApiRoutes.SearchUsers}${searchQuery}`, axiosConfig);

      this.setState({
        users: items,
        count: items.length,
        errors: {},
      });
    } catch (err) {
      this.setState({
        errors: {
          name: 'Too Many Requests...',
        },
      });

      errorNotify('Please wait for a couple of seconds!');
    }
  }

  render() {
    const { userName, users, count, errors } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

    return (
      <FlexCenteredDiv
        style={{
          backgroundColor: '#EEEEEE',
          minHeight: '100vh',
        }}
      >
        <Card style={{ width: '80vw' }}>
          <div>
            <CenteredH1>
              Explore GitHub
            </CenteredH1>
            <Input
              placeholder="Enter user's name on GitHub"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              value={userName}
              onChange={this.onChangeUserName}
              required
            />
            {
              isEmpty(errors) !== true && (
                <CenteredH4
                  style={{ color: 'red' }}
                >
                  {errors.name}
                </CenteredH4>
              )
            }
          </div>
          <div style={{ margin: '2em auto' }}>
            <CenteredH3>
              {count} users found
            </CenteredH3>
            <Table columns={columns} dataSource={users} rowKey={record => record.id} />
          </div>
        </Card>
      </FlexCenteredDiv>
    );
  }
}

export default SearchUsers;
