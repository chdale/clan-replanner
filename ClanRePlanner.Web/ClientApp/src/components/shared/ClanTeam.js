import React, { Component } from 'react';
import { CharacterCardLite } from './CharacterCardLite';
import { TeamSelectModal } from '../TeamSelectModal';

export class ClanTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clanTeamHeight: 0,
            showTeamSelectModal: false,
            availableCharacters: [],
            availableSupport: [],
            teams: [],
            selectedUserCharacterId: null,
            teamTypeSelected: null,
            selectedTeam: [],
            loading: true,
        };
        
        this.containerId = `teams-${this.props.userId}`;
        this.teamTypeEnum = Object.freeze({"team1": 1, "team2": 2, "team3": 3, "support": 4});
    }

    updateWidthAndHeight = () => {
        let clanTeamWidth = this.getClanTeamWidth();
        let calculatedClanTeamHeight = clanTeamWidth * 4 / 5;
        if (this.state.clanTeamHeight === 0 || this.state.clanTeamHeight !== calculatedClanTeamHeight) {
            this.setState({ clanTeamHeight: calculatedClanTeamHeight });
        }
    }

    getClanTeamWidth() {
        return document.getElementById(this.containerId)?.offsetWidth;
    } 

    componentDidMount() {
        this.setState({ teams: this.props.teams }, () => {
            window.addEventListener('resize', this.updateWidthAndHeight);

            if (this.props.isEditable) {
                this.fetchCharacterData(this.props.userId);
                this.fetchAvailableSupportCharacterData(this.props.userId);
            }

            this.setState({ loading: false }, () => {
                this.updateWidthAndHeight();
            });
        });
    }

    componentDidUpdate() {
        if (this.state.teams !== this.props.teams) {
            this.setState({ teams: this.props.teams });
        }
    }

    async fetchCharacterData(userId) {
        const response = await fetch('character/' + userId);
        const data = await response.json();
        const availableCharacters = data.filter(x => x.selected).map(x => {
            return {
                userCharacterId: x.userCharacterId,
                name: x.name,
                currentStars: x.currentStars,
                userName: x.userName,
                isSupportUnit: false,
            }
        });
        
        this.setState({ availableCharacters });
    }

    async fetchAvailableSupportCharacterData(userId) {
        const response = await fetch('character/fetchAvailableSupportCharacters/' + userId);
        const data = await response.json();
        const availableSupport = data.map(x => {
            return {
                userCharacterId: x.userCharacterId,
                name: x.name,
                currentStars: x.currentStars,
                userName: x.userName,
                isSupportUnit: true,
            }
        });
        
        this.setState({ availableSupport });
    }

    async addTeamMember(userId, teamType, userCharacterId) {
        const response = await fetch(`character/addTeam/${userId}/team/${teamType}/${userCharacterId}`, {
            method: 'POST',
        }).then(async (response) => {
            const statusCode = response.status;
            this.closeTeamSelectModal();
            this.props.isChanged();
        }).catch(error => {
            console.error(error);
        });
    }

    async updateTeamMember(userId, teamType, newUserCharacterId, oldUserCharacterId) {
        const response = await fetch(`character/updateTeam/${userId}/team/${teamType}/${newUserCharacterId}/${oldUserCharacterId}`, {
            method: 'PUT',
        }).then(async (response) => {
            const statusCode = response.status;
            this.closeTeamSelectModal();
            this.props.isChanged();
        }).catch(error => {
            console.error(error);
        });
    }

    styleForSupport(styleString, teamType, index, isSupportUnit) {
        if (teamType === 1) {
            if (index === 0) {
                styleString = styleString + " top-left";
            }
            if (index === 4) {
                styleString = styleString + " top-right";
            }
        }
        if (teamType === 3) {
            if (index === 0) {
                styleString = styleString + " bottom-left";
            }
            if (index === 4) {
                styleString = styleString + " bottom-right";
            }
        }
        if (isSupportUnit) {
            styleString = styleString + " support-unit";
        }

        return styleString;
    }

    renderTeam(teamTypeId) {
        let clanBattleTeam = this.state.teams.filter(x => x.teamType === teamTypeId)[0];
        let teamRow = [];

        for (let i = 0; i < clanBattleTeam.team.length; i++) {
            let style = this.styleForSupport("character-container", teamTypeId, i, clanBattleTeam.team[i].isSupportUnit);
            teamRow.push(
                <div className={style} key={`clan-team-${teamTypeId}-${clanBattleTeam.team[i].characterName}`}>
                    <div onClick={this.props.isEditable ? () => this.openTeamSelectModal(clanBattleTeam.teamType, clanBattleTeam.team[i].userCharacterId, clanBattleTeam.team.filter(x => x != clanBattleTeam.team[i])) : ""} className={`character-card-lite${this.props.isEditable ? " active" : ""}`}>
                        <CharacterCardLite 
                            userCharacterId={clanBattleTeam.team[i].userCharacterId}
                            name={clanBattleTeam.team[i].characterName} 
                            currentStars={clanBattleTeam.team[i].stars}
                            userName={clanBattleTeam.team[i].userName}
                            isSupportUnit={clanBattleTeam.team[i].isSupportUnit}
                            isClickable={false}
                        ></CharacterCardLite>
                    </div>
                </div>
            )
        }

        let firstEmptyUnit = clanBattleTeam.team.length;
        for (let i = teamRow.length; i < clanBattleTeam.maxLength; i++) {
            let style = this.styleForSupport("character-container", teamTypeId, i, false);
            if (i === firstEmptyUnit) {
                teamRow.push(
                    <div className={style} key={`clan-team-${teamTypeId}-${i}`}>
                        <div onClick={this.props.isEditable ? () => this.openTeamSelectModal(clanBattleTeam.teamType, null, clanBattleTeam.team) : ""} className={`character-card-lite${this.props.isEditable ? " team-add active" : ""}`}>
                            {this.props.isEditable ? <i className="fas fa-plus"></i> : ""}
                        </div>
                    </div>
                )
            }
            else {
                teamRow.push(
                    <div className={style} key={`clan-team-${teamTypeId}-${i}`}>
                        <div className="character-card-lite"></div>
                    </div>
                )
            }
        }

        return (
            <div className="team">
                {teamRow}
            </div>
        );
    }

    renderTeams() {
        return (
            <div className="teams" id={this.containerId} style={{ height: this.state.clanTeamHeight }}>
                {this.renderTeam(this.teamTypeEnum.team1)}
                <hr></hr>
                {this.renderTeam(this.teamTypeEnum.team2)}
                <hr></hr>
                {this.renderTeam(this.teamTypeEnum.team3)}
            </div>
        );
    }

    renderSupports() {
        let supportTeam = this.state.teams.filter(x => x.teamType === this.teamTypeEnum.support)[0];
        let supportRows = [];
        
        for (let i = 0; i < supportTeam.team.length; i++) {
            supportRows.push(
                <div className="support-row" key={`support-team-${supportTeam.team[i].characterName}`}>
                    <div onClick={this.props.isEditable 
                        ? () => this.openTeamSelectModal(supportTeam.teamType, supportTeam.team[i].selectedUserCharacterId, supportTeam.team.filter(x => x != supportTeam.team[i])) 
                        : ""} className={`character-card-lite${this.props.isEditable ? " active" : ""}`}>
                            <CharacterCardLite
                                userCharacterId={supportTeam.team[i].userCharacterId}
                                name={supportTeam.team[i].characterName} 
                                currentStars={supportTeam.team[i].stars}
                                userName={supportTeam.team[i].userName}
                                isSupportUnit={false}
                                isClickable={false}
                            ></CharacterCardLite>
                    </div>
                </div>
            )
        }

        let firstEmptyUnit = supportTeam.team.length;
        for (let i = supportRows.length; i < supportTeam.maxLength; i++) {
            if (i === firstEmptyUnit) {
                supportRows.push(
                    <div className="support-row" key={`support-team-${i}`}>
                        <div onClick={this.props.isEditable ?  () => this.openTeamSelectModal(supportTeam.teamType, null, supportTeam.team) : ""} className={`character-card-lite${this.props.isEditable ? " team-add active" : ""}`}>
                            {this.props.isEditable ? <i className="fas fa-plus"></i> : ""}
                        </div>
                    </div>
                );
            }
            else {
                supportRows.push(
                    <div className="support-row" key={`support-team-${i}`}>
                        <div className="character-card-lite"></div>
                    </div>
                );
            }
        }

        supportRows.splice(1, 0, <hr key="support-hr"></hr>);

        return (
            <div className="clan-team-supports" style={{ height: this.state.clanTeamHeight * 2 / 3 }}>
                {supportRows}
            </div>
        );
    }

    openTeamSelectModal = (teamTypeSelected, selectedUserCharacterId, selectedTeam) => {
        this.setState({
            teamTypeSelected,
            showTeamSelectModal: true,
            selectedUserCharacterId,
            selectedTeam,
        });
    }

    modalTeamMemberOnClick = (newUserCharacterId, e) => {
        if (this.state.selectedUserCharacterId === null) {
            this.addTeamMember(this.props.userId, this.state.teamTypeSelected, newUserCharacterId);
        }
        else {
            this.updateTeamMember(this.props.userId, this.state.teamTypeSelected, newUserCharacterId, this.state.selectedUserCharacterId);
        }
    }

    renderTeamSelectModal() {
        return (
            <TeamSelectModal 
                show={this.state.showTeamSelectModal}
                availableCharacters={this.state.availableCharacters}
                availableSupport={this.state.availableSupport}
                onClose={this.closeTeamSelectModal}
                isSupportTeam={this.state.teamTypeSelected === this.teamTypeEnum.support}
                isReadOnly={false}
                unavailableUnits={this.state.selectedTeam}
                handleClick={this.modalTeamMemberOnClick}
            />
        );
    }

    closeTeamSelectModal = () => {
        this.setState({
            showTeamSelectModal: false,
        });
    }

    render() {
        if (this.state.loading) {
            return (<div>Loading...</div>);
        }
        return (
            <div className="clan-team">
                <div className="clan-team-header">
                    <div className="clan-team-user">
                        <h3>{this.props.userName}</h3>
                    </div>
                    <div className="clan-team-support-title">
                        <span>Support</span>
                    </div>
                </div>
                <div className="clan-team-display">
                    <div className="clan-team-labels" style={{ height: this.state.clanTeamHeight }}>
                        <div className="clan-team-label">Team 1</div>
                        <div className="clan-team-label">Team 2</div>
                        <div className="clan-team-label">Team 3</div>
                    </div>
                    {this.renderTeams()}
                    {this.renderSupports()}
                </div>
                {this.renderTeamSelectModal()}
            </div>
        );
    }
}