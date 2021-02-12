import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { CharacterCard } from './shared/CharacterCard';

export class Roster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: [],
            loading: true,
            selectedCharacters: [],
            isCharacterSelected: false,
        };
    }

    componentDidMount() {
        this.fetchCharacterData(this.props.userId);
    }

    async fetchCharacterData(userId) {
        const response = await fetch('character/' + userId);
        const data = await response.json();
        this.setState({ characters: data }, () => {
            const selectedCharacters = this.state.characters.filter(x => x.selected).map(x => {
                return { 
                    characterId: x.characterId,
                    stars: x.currentStars,
                }
            });
            const isCharacterSelected = selectedCharacters.length > 0;
            this.setState({ selectedCharacters, isCharacterSelected }, () => {
                this.setState({ loading: false });
            })
        });
    }

    async submitUserCharacter(history) {
        console.log('submit: userId: ' + this.props.userId);
        const response = await fetch('character/user/' + this.props.userId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.selectedCharacters),
        }).then(async (response) => {
            const statusCode = response.status;
            console.log(statusCode);
            history.push('/');
        }).catch(error => {
            console.error(error);
        });
      }

    handleSelectCharacter = (characterId, stars) => {
        let currentCharacters = [];
        if (this.state.selectedCharacters.filter(x => x.characterId === characterId).length > 0) {
            currentCharacters = this.state.selectedCharacters.filter(x => x.characterId !== characterId);
        }
        else {
            currentCharacters = this.state.selectedCharacters;
            currentCharacters.push({
                characterId: characterId,
                stars: stars
            })
        }

        this.setState({
            selectedCharacters: currentCharacters,
            isCharacterSelected: currentCharacters.length > 0,
        })
    }

    handleSelectStar = (characterId, stars) => {
        this.setState(previousState => ({
            selectedCharacters: previousState.selectedCharacters.map(selectedCharacter => selectedCharacter.characterId === characterId
                ? Object.assign(selectedCharacter, {stars: stars})
                : selectedCharacter)
        }));
    }

    selectedCount() {
        return this.state.selectedCharacters.length !== 0 ? this.state.selectedCharacters.length + " selected" : "";
    }

    render () {
        const characterCards = this.state.characters.map((character) => 
            <CharacterCard 
                selectable={true}
                name={character.name}
                id={character.characterId}
                minStars={character.minStars}
                maxStars={character.maxStars}
                currentStars={character.currentStars}
                selected={character.selected}
                handleSelectCharacter={this.handleSelectCharacter}
                handleSelectStar={this.handleSelectStar}
            />
        );

        let submitButtonStyle = "submit-button";
        if (this.state.isCharacterSelected) {
            submitButtonStyle = submitButtonStyle + " bg-gradient-hover-replanner";
        }
        else {
            submitButtonStyle = submitButtonStyle + " disabled";
        }

        return (
        <div className="roster-page">
            <div className="roster">
                <h1>Roster</h1>
                <h3>Select the princesses you have recruited and their stars.</h3>
                {this.state.loading ? "Loading..." : characterCards}
            </div>
            <div className="footer-bar bg-gradient-replanner-inverted">
                <div className="footer-item selected-characters"><span>{this.selectedCount()}</span></div>
                <div className="footer-item submit-empty"><span><a href="/">Proceed without saving</a></span></div>
                <div className="footer-item submit">
                    <Route render={({ history }) => (
                        <div className={submitButtonStyle} onClick={() => { return this.state.isCharacterSelected ? this.submitUserCharacter(history) : undefined }}>
                            <span>Continue</span>
                        </div>
                    )} />
                </div>
            </div>
        </div>
        );
    }
}
