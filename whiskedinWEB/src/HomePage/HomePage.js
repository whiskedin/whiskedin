import React from 'react';
import './HomePage.css';
import whisk from '../img/whiskedinlogo.png';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Deck: props.deck,
            Id: props.deck[0].Id,
            Name: props.deck[0].Name,
            Brand: props.deck[0].Brand
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    handleNext() {
        const id = this.state.Id + 1;
        const deck = this.state.Deck;
        if(id < deck.length && id >= 0){
            this.setState(state => ({
                Id: deck[id].Id,
                Name: deck[id].Name,
                Brand: deck[id].Brand
            }));
        }
    }

      handleBack() {
        const id = this.state.Id - 1;
        const deck = this.state.Deck;
        if(id >= 0){
            this.setState(state => ({
                Id: deck[id].Id,
                Name: deck[id].Name,
                Brand: deck[id].Brand
            }));
        }
    }

    render(){
        return (
            <div id='id_whisk_card'>
                <table> 
                    <thead>
                        <tr>
                            <th id='id_name'>{this.state.Name}</th>
                            <th id='id_brand'>{this.state.Brand}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <button id='id_back_button' className='button' onClick={this.handleBack}>
                                    {'Back'}
                                </button>
                                <img id='id_image' src={whisk} className='Card-Img' alt=''>
                                </img>
                                <button id="id_next_button" className='button' onClick={this.handleNext}>
                                    {'Next'}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button id='id_share_button' className='button'>
                                    {'Share'}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>        
        )
    }
}

export default class HomePage extends React.Component {
    state = {
        deck: [
            {
                Id: 0,
                Name: 'White Walker',
                Brand: 'Jhonny Walker 1',
            },
            {
                Id: 1,
                Name: 'Red Label',
                Brand: 'Jhonnie Walker 2'
            },
            {
                Id: 2,
                Name: 'Blue Label',
                Brand: 'Jhonnie Walker 3'
            }
        ]
    };

    render() {
        const deck= this.state.deck;

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>WhiskedIn</th>
                            <td>
                                <button id='id_logout_button' className='button'>
                                    {'Log Out'}
                                </button>
                            </td>
                        </tr>
                    </thead>
                </table>
                <Card deck={deck}/>
            </div>
        )
    }
}
