import React, { Component } from 'react';
import { Container, Segment, Table } from 'semantic-ui-react';
import Axios from 'axios';
import _ from 'lodash';
const LAMBDA_URL = 'https://ebt7nq7ri4.execute-api.us-east-2.amazonaws.com/dev/clanlist'

class App extends Component {
  state = {
    loading: true,
    column: null,
    direction: null,
    data: [{
      name: 'loading'
    }]
  }

  componentDidMount() {
    Axios
      .get(LAMBDA_URL)
      .then(({data}) => {
        this.setState({
          loading: false,
          data: data.map(d => ({
            ...d,
            region: d.name.indexOf('EU') >= 0 ? 'Europe' : 'North America'
          }))
        })
      })
  }

  
  handleSort = clickedColumn => () => {
    const { column, direction } = this.state;

    if (column !== clickedColumn) {
        this.setState({
            column: clickedColumn,
            direction: 'ascending',
        });

        return;
    }

    this.setState({
        direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  }
  render() {
    const {loading, data, column, direction} = this.state
    let localData = _.sortBy(data.slice(0), column);
        
    if(direction === "descending") {
      localData = localData.reverse();
    }
  
    return (
      <Container fluid>
        <Segment loading={loading}>
          <Table sortable celled>
            <Table.Header>
              <Table.HeaderCell onClick={this.handleSort('name')} sorted={column === 'name' ? direction: null}>
                Clan
              </Table.HeaderCell>
              <Table.HeaderCell onClick={this.handleSort('region')} sorted={column === 'region' ? direction: null}>
                Region
              </Table.HeaderCell>
              <Table.HeaderCell onClick={this.handleSort('platform')} sorted={column === 'platform' ? direction: null}>
                Platform
              </Table.HeaderCell>
              <Table.HeaderCell onClick={this.handleSort('member_count')} sorted={column === 'member_count' ? direction: null}>
                Member Count
              </Table.HeaderCell>
            </Table.Header>
            <Table.Body>
            {localData.map((datum, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <a href={`https://www.bungie.net/en/ClanV2?groupId=${datum.group_id}`}>{datum.name.toUpperCase()}</a>
                </Table.Cell>
                <Table.Cell>
                  {datum.region}
                </Table.Cell>
                <Table.Cell>
                  {datum.platform}
                </Table.Cell>
                <Table.Cell>
                  <Segment textAlign="center" inverted color={datum.member_count < 100 ? 'green' : 'red'}>{datum.member_count}/100</Segment>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          </Table>
        </Segment>
      </Container>
    );
  }
}

export default App;
