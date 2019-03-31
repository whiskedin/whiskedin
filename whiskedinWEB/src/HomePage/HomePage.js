import React, { Fragment } from 'react';
import WhiskeyCard from'./WhiskeyCard'
import { AppBar, Toolbar, Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, Button, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { ArrowForward, ArrowBack} from '@material-ui/icons';
import CreateDialog from './Create'
import axios from 'axios'
import Form from './Form'

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deck: [],
            currIndex: 0
        };

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.empty = true;
    }

    componentDidMount(){
        this.getWhiskeys()
    }

    getWhiskeys = (search) => {

        let get = ''
        let config = {'Authorization': 'Bearer '.concat(JSON.parse(localStorage.getItem('user')))};
        if(search){
            get = "/whiskies?s=" + search
        }
        else{
            get = '/whiskies'
        }
        axios.get("https://whiskedin.herokuapp.com" + get, { headers: config }).then(res => {

            let whiskeys = res.data.whiskies
            if (whiskeys.length === 0) {
                console.log("No dude");
            }
            else {

                let i = 0

                whiskeys.map(whiskey => {
                    if(i === 0){
                        whiskey = {...whiskey,
                            idx: i}
                        this.setState(({deck}) => ({
                            deck: [
                            whiskey
                            ]
                        }))
                        i++
                    } else {
                        whiskey = {...whiskey,
                            idx: i}
                        this.setState(({deck}) => ({
                            deck: [
                            ...deck,
                            whiskey
                            ]
                        }))
                        i++
                    }
                })
                this.empty = false;

            }
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

        let config = {'Authorization': 'Bearer '.concat(JSON.parse(localStorage.getItem('user')))};
        // eslint-disable-next-line no-useless-concat
        axios.post("https://whiskedin.herokuapp.com" + "/whiskies", whiskey, { headers: config })
            .then(res => {
                console.log(res);
                this.getWhiskeys();
            })

        this.getWhiskeys()


      }
  
    handleExerciseEdit = whiskey => {

        let editedWhiskey = {...whiskey}

        delete editedWhiskey.created_at
        delete editedWhiskey.created_by
        delete editedWhiskey.image
        delete editedWhiskey.idx

        console.log(editedWhiskey)

        let config = {'Authorization': 'Bearer '.concat(JSON.parse(localStorage.getItem('user')))};
        // eslint-disable-next-line no-useless-concat
        axios.put("https://whiskedin.herokuapp.com" + "/whiskies", editedWhiskey, { headers: config })
            .then(res => {
                console.log(res)
            })
        // this.setState(({deck}) => ({
            
        // }))
    }

    onSearchInputChange = (event) => {
        if(event.target.value) {
            this.getWhiskeys(event.target.value)
        } else {
            this.getWhiskeys()
        }
    }

    render() {
        console.log(this.state)
        const whiskeyCard= this.state.deck[this.state.currIndex]
        const deck= this.state.deck

        // if(!this.state.loaded){
        //     return (
        //         <div>
        //             <h1> Loading </h1>
        //         </div>
        //     )
        // }
        //else {
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
                            <List id='id_whisk_list' component="ul">
                                <Grid container>
                                    <Grid item sm={6} style={{marginInlineStart:20}}>
                                        <TextField  
                                        id="id_searchInput"
                                        placeholder="Search"
                                        margin="normal"
                                        onChange={this.onSearchInputChange} />
                                    </Grid>

                                    <Grid item sm={3} style={{marginInlineStart:20}}>
                                        <CreateDialog 
                                            id='id_create_id'
                                            onCreate={this.handleSubmit}
                                            index={deck.length}
                                        />
                                    </Grid>
        
                                </Grid>
                                {deck.map((whiskey) =>
                                    <ListItem 
                                        key={whiskey.wid}
                                        button
                                        onClick={() => this.handleListClick(whiskey.idx)}
                                    >
                                        <ListItemText primary={whiskey.name} />
                                        <ListItemSecondaryAction>
                                            <Form
                                                onEdit={this.handleExerciseEdit}
                                                whiskey={whiskey}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item sm>

                        <div>
                            {this.state.loaded ?
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <IconButton
                                                id-='id_back_button'
                                                onClick={this.handleBack}
                                            >
                                                <ArrowBack/>
                                            </IconButton>
                                        </td>
                                        <td>
                                            <WhiskeyCard
                                                id='id_whisk_card'
                                                card={whiskeyCard}/>
                                        </td>
                                        <td>
                                            <IconButton
                                                id='id_next_button'
                                                onClick={this.handleNext}
                                            >
                                                <ArrowForward/>
                                            </IconButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            : <p> No whiskeys. Please add one to your list :). </p>}
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
