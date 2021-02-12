import React, { Component } from 'react';

export class CharacterCardLite extends Component {
    constructor(props) {
        super(props);
    }

    renderStars() {
        let starSpans = [];
        for (let i = 0; i < this.props.currentStars; i++) {
            starSpans.push(<span key={"lite-star-" + i}  className='fas fa-star'> </span>)
        }

        return starSpans;
    }

    disabledHandleClick(e) {
        e.stopPropagation();
    }

    render() {
        let userCharacterCardId = `character-card-${this.props.userCharacterId}`;
        return (
            <div className={`actual-card-lite ${this.props.className ?? ""}`} id={userCharacterCardId} onClick={() => { return this.props.isClickable ? this.props.handleClick(this.props.userCharacterId) : undefined }}>
                <div className="character-portrait" style={{ backgroundImage: `url("/images/${this.props.name}.png")`}}>
                </div>
                <div className="character-name">
                    <span>{this.props.name}</span>
                </div>
                <div className="user-name">
                    {this.props.isSupportUnit ?
                    <span>({this.props.userName})</span> :
                    ""}
                </div>
                <div className="current-stars">
                    <div className="star-container">
                        <span className="star-parent-span">
                            {this.renderStars()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}