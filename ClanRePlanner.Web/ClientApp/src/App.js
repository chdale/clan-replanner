import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Roster } from './components/Roster';
import { MyTeam } from './components/MyTeam';

import './main.scss'

export default class App extends Component {
  static displayName = App.name;

  render () {
    const testData = 
    {
      "userName": "testuser",
      "teams": [
        {
          "team": [
            {
              "userCharacterId": 1,
              "characterName": "Djeeta",
              "userName": "testuser",
              "isSupportUnit": false,
              "stars": 4
            },
            {
              "userCharacterId": 5,
              "characterName": "Kaori",
              "userName": "support-test",
              "isSupportUnit": true,
              "stars": 5
            }
          ],
          "teamType": 1,
          "maxLength": 5
        },
        {
          "team": [
            {
              "userCharacterId": 2,
              "characterName": "Eriko",
              "userName": "testuser",
              "isSupportUnit": false,
              "stars": 2
            }
          ],
          "teamType": 2,
          "maxLength": 5
        },
        {
          "team": [
            {
              "userCharacterId": 3,
              "characterName": "Hatsune",
              "userName": "testuser",
              "isSupportUnit": false,
              "stars": 5
            }
          ],
          "teamType": 3,
          "maxLength": 5
        },
        {
          "team": [
            {
              "userCharacterId": 4,
              "characterName": "Anna",
              "userName": "testuser",
              "isSupportUnit": false,
              "stars": 5
            }
          ],
          "teamType": 4,
          "maxLength": 2
        }
      ]
    };

    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/roster'>
          <Roster userId={1}></Roster>
        </Route>
        <Route path='/my-team'>
          <MyTeam
            userId={1}>
          </MyTeam>
        </Route>
      </Layout>
    );
  }
}
