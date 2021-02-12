import React, { Component } from 'react';
import { ClanTeam } from './shared/ClanTeam';

export class MyTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {},
        };
    }

    componentDidMount() {
        this.fetchTeamData(this.props.userId);
    }

    async fetchTeamData(userId) {
        const response = await fetch('user/getUserTeamCharacters/' + userId);
        const data = await response.json();
        this.setState({ data }, () => {
            this.setState({ isLoading: false });
        });
    }

    isChanged = () => {
        this.fetchTeamData(this.props.userId);
    }

    render () {
        return (
            <div className="my-team-page">
                {
                    this.state.isLoading 
                        ? "Loading..." 
                        : <ClanTeam 
                            userId={this.props.userId}
                            userName={this.state.data.userName}
                            teams={this.state.data.teams}
                            isChanged={this.isChanged}
                            isEditable={true}>
                        </ClanTeam>
                }
            </div>
        );
    }
}