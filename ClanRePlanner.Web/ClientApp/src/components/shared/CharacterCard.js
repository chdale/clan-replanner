import React, { Component } from 'react';
import Select from 'react-select';

export class CharacterCard extends Component {
    constructor(props) {
        super(props);
        this.options = [];
        this.allStars = [];

        for (let i=0; i<props.maxStars; i++) {
            let currentStars = [];
            for (let j=0; j<=i; j++) {
                currentStars.push(<span key={"star " + i + "-" + j} className='fas fa-star'> </span>);
            }
            this.allStars.push(<div key={"star " + i}>{currentStars}</div>);
        }

        for (let i=props.minStars; i<=props.maxStars; i++) {
            this.options.push({ 
                value: i, 
                label: this.allStars[i-1]
            });
        }

        this.state = {
            selected: props.selected ? true : false,
            currentStarValue: props.currentStars,
        };
    }

    handleCharacterClick = () => {
        this.props.handleSelectCharacter(this.props.id, this.state.currentStarValue);

        const currentState = this.state.selected;
        this.setState({ selected: !currentState });
    }

    handleStarSelect = (e) => {
        this.setState({currentStarValue: e.value}, () => {
            if (this.state.selected) {
                this.props.handleSelectStar(this.props.id, this.state.currentStarValue);
            }
        });
    }

    render() {
        return (
            <div className="character-card">
                <div className={this.props.selectable ? 
                    this.state.selected ?
                        "card-select selectable selected" :
                        "card-select selectable" :
                    "card-select"}
                    onClick={this.handleCharacterClick}>

                    <div className="character-portrait">
                        <img src={`/images/${this.props.name}.png`} />
                    </div>
            
                    <div className="character-name">
                        {this.props.name}
                    </div>
                </div>

                <Select
                    defaultValue={this.options[this.state.currentStarValue - this.props.minStars]}
                    options={this.options}
                    getOptionLabel={o => o.label}
                    getOptionValue={o => o.value}
                    className="star-select"
                    isDisabled={!this.props.selectable}
                    onChange={this.handleStarSelect}>
                </Select>
            </div>
        );
    }
}