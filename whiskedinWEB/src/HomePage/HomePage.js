import React, { Fragment } from 'react';
import WhiskeyCard from'./WhiskeyCard'
import { AppBar, Toolbar, Grid, Paper, List, ListItem, ListItemText, Typography, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowForward, ArrowBack, Edit} from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import CreateDialog from './Create'
import axios from 'axios'

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: [
                {
                    idx: 0,
                    name: 'White Walker',
                    company: 'Jhonny Walker 1',
                    type: 'Scotch',
                    age: '12 yrs',
                    origin: 'Scotland',
                    flavor: 'The best',
                    description: 'Delicious',
                    rating: '5 estrellas'
                },
            ],

            currIndex: 0
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount(){
        let config = {'Authorization': 'Bearer '.concat(JSON.parse(localStorage.getItem('user')))};
        console.log(config.Authorization)
        axios.get("https://whiskedin.herokuapp.com" + "/whiskies", { headers: config }).then(res => {
            console.log(res)
        })
    }

    

    handleNext() {
        const index = this.state.currIndex + 1
        if(index >= 0 && index < this.state.deck.length){
            this.setState((state) => ({
                currIndex: index
            }));
        } 
    }

    handleBack() {
        const index = this.state.currIndex - 1
        if(index >= 0){
            this.setState((state) => ({
                currIndex: index
            }));
        }
    }

    handleListClick = index => {
        this.setState(() => ({
            currIndex: index
        }))
    }

    handleSubmit = whiskey => {

        console.log(whiskey)

        let config = {'Authorization': 'Bearer '.concat(JSON.parse(localStorage.getItem('user'))),
                        'Content-Type': 'application/x-www-form-urlencoded'};
        axios.post("https://whiskedin.herokuapp.com" + "/whiskies", whiskey, { headers: config })
            .then(res => {
                console.log(res)
            })

        const whiskeyCard = {
            ...whiskey,
            idx: this.state.deck.length
        }   
        this.setState(({deck}) => ({
            deck: [
            ...deck,
            whiskeyCard
          ]
        }))
      }

    render() {
        const whiskeyCard= this.state.deck[this.state.currIndex]
        const deck= this.state.deck

        return (
            <div>
                <Fragment>
                    <AppBar position="static" style={{marginBottom:10}} >
                        <Toolbar>
                            <Typography variant="h6" color="inherit" style={{flexGrow: 1}}>
                                WhiskedIn
                            </Typography>
                            <Button color="inherit">Logout</Button>
                        </Toolbar>
                    </AppBar>
                </Fragment>
                <Grid container>
                    <Grid item sm={3}>
                        <Paper>
                            <List component="ul">
                                <Grid container>
                                    <Grid item sm={6} style={{marginInlineStart:20}}>
                                        <CreateDialog 
                                            onCreate={this.handleSubmit}
                                            index={deck.length}
                                        />
                                    </Grid>
                                    <Grid item sm>
                                        <Fab size="small" color="secondary" aria-label="Edit">
                                            <Edit/>
                                        </Fab>
                                    </Grid>
                                </Grid>
                                {deck.map(({ idx, name }) =>
                                    <ListItem 
                                        key={idx}
                                        button
                                        onClick={() => this.handleListClick(idx)}
                                    >
                                        <ListItemText primary={name} />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item sm>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <IconButton 
                                                onClick={this.handleBack}
                                            >
                                                <ArrowBack />
                                            </IconButton>
                                        </td>
                                        <td>
                                                <WhiskeyCard 
                                                    card={whiskeyCard}/>
                                        </td>
                                        <td>
                                            <IconButton 
                                                onClick={this.handleNext}
                                            >
                                                <ArrowForward />
                                            </IconButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
