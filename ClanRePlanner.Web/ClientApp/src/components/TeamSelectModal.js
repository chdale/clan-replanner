import React, { Component } from "react";
import { CharacterCardLite } from "./shared/CharacterCardLite";

export class TeamSelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSupport: false,
            cardHeight: 0,
        };

        this.handleShowSupport = this.handleShowSupport.bind(this);
    }

    componentDidUpdate(props) {
        if (this.props.show !== props.show) {
            this.updateWidthAndHeight();
        }
    }

    componentDidMount() {
        this.updateWidthAndHeight();
        window.addEventListener('resize', this.updateWidthAndHeight);
    }

    updateWidthAndHeight = () => {
        let cardHeight = this.getClanTeamWidth();
        let calculatedClanTeamHeight = cardHeight * 4 / 3;
        if (this.state.cardHeight === 0 || this.state.cardHeight !== calculatedClanTeamHeight) {
            this.setState({ cardHeight: calculatedClanTeamHeight });
        }
    }

    getClanTeamWidth() {
        return document.getElementsByClassName("team-select-character-card").length > 0
            ? document.getElementsByClassName("team-select-character-card")[0].offsetWidth
            : 0;
    } 

    handleChild(e) {
        e.stopPropagation();
    }

    handleShowSupport(e) {
        e.stopPropagation();

        let oldShowSupport = this.state.showSupport;
        this.setState({ showSupport: !oldShowSupport });
    }

    renderCharacters() {
        return (
            <div className="character-list">
            {this.state.showSupport 
                    ? this.props.availableSupport.map(x => {
                        return (
                            <div className="team-select-character-card" 
                                key={`team-support-card-${x.userCharacterId}`}
                                id={`team-support-card-${x.userCharacterId}`}
                                style={{ height: this.state.cardHeight }}>
                                    <CharacterCardLite
                                        className={this.props.isReadOnly 
                                            ? "" 
                                            : this.props.unavailableUnits.some(y => y.userCharacterId === x.userCharacterId)
                                                ? "disabled"
                                                : "active"}
                                        handleClick={this.props.handleClick}
                                        userCharacterId={x.userCharacterId}
                                        name={x.name} 
                                        currentStars={x.currentStars}
                                        userName={x.userName}
                                        isSupportUnit={x.isSupportUnit}
                                        isClickable={!this.props.unavailableUnits.some(y => y.userCharacterId === x.userCharacterId)}
                                    ></CharacterCardLite>
                            </div>
                        );
                    })
                    : this.props.availableCharacters.map(x => {
                        return (
                            <div className="team-select-character-card" 
                                key={`team-character-card-${x.userCharacterId}`}
                                id={`team-character-card-${x.userCharacterId}`}
                                style={{ height: this.state.cardHeight }}>
                                    <CharacterCardLite
                                        className={this.props.isReadOnly 
                                            ? "" 
                                            : this.props.unavailableUnits.some(y => y.userCharacterId === x.userCharacterId)
                                                ? "disabled"
                                                : "active"}
                                        handleClick={this.props.handleClick}
                                        userCharacterId={x.userCharacterId}
                                        name={x.name} 
                                        currentStars={x.currentStars}
                                        userName={x.userName}
                                        isSupportUnit={x.isSupportUnit}
                                        isClickable={!this.props.unavailableUnits.some(y => y.userCharacterId === x.userCharacterId)}
                                    ></CharacterCardLite>
                            </div>
                        );
                    })}
            </div>
        );
        
    }

    render() {
        if(!this.props.show){
            return null;
        }
        return (
            <div className="modal-container" onClick={() => this.props.onClose()}>
                <div className="team-select-modal" id="team-select-modal" onClick={this.handleChild}>
                    <div className="team-select-modal-header">
                        <div className="modal-header-item modal-support-checkbox">
                            <div className={`support-checkbox-container${this.props.isSupportTeam ? " disabled" : ""}`}>
                                <div className="checkbox-label">Show Support Units: </div>
                                <div className="checkbox">
                                    <input 
                                        id="support-checkbox" 
                                        type="checkbox" name="showSupport"
                                        checked={this.state.showSupport}
                                        onChange={this.handleShowSupport} />
                                    <label htmlFor="support-checkbox"></label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-header-item modal-search-box">
                        </div>
                        <div className="modal-header-item modal-close-container">
                            <div className="modal-close-button" onClick={() => this.props.onClose()}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        {this.renderCharacters()}
                    </div>
                </div>
            </div>
        );
    }
}