import React, { Fragment } from 'react';
import WhiskeyCard from'./WhiskeyCard'
import { AppBar, Toolbar, Grid, Paper, List, ListItem, ListItemText, Typography, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowForward, ArrowBack, AddBox, Edit} from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import CreateDialog from './Create'

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: [
                {
                    Idx: 0,
                    Name: 'White Walker',
                    Brand: 'Jhonny Walker 1',
                },
                {
                    Idx: 1,
                    Name: 'Red Label',
                    Brand: 'Jhonnie Walker 2'
                },
                {
                    Idx: 2,
                    Name: 'Blue Label',
                    Brand: 'Jhonnie Walker 3'
                }
            ],

            currIndex: 0
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
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

    onCreate = whiskey => {
        this.setState(({deck}) => ({
            deck: [
            ...deck,
            whiskey
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
                                            onCreate={this.onCreate}
                                            index={deck.length}
                                        />
                                    </Grid>
                                    <Grid item sm>
                                        <Fab size="small" color="secondary" aria-label="Edit">
                                            <Edit/>
                                        </Fab>
                                    </Grid>
                                </Grid>
                                {deck.map(({ Idx, Name }) =>
                                    <ListItem 
                                        key={Idx}
                                        button
                                        onClick={() => this.handleListClick(Idx)}
                                    >
                                        <ListItemText primary={Name} />
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
