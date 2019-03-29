import React, { Fragment, Component } from 'react'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    FormControl: {
        width: 500
    }
})

export default withStyles(styles)  (class extends Component {

    state ={
        open: false,
        whiskeyCard: {
            name: '',
            company: '',
            type: '',
            age: '',
            origin: '',
            flavor: '',
            description: '',
            rating: ''
        }
    }

    handleToggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    handleChange = name => ({target: {value}}) => {
        this.setState({
            whiskeyCard: {
                ...this.state.whiskeyCard,
                [name]: value
            }
        })
    }

    handleSubmit = () => {
        //TODO: validate

        const { whiskeyCard } = this.state
        whiskeyCard.age = parseInt(whiskeyCard.age)
        whiskeyCard.rating = parseInt(whiskeyCard.rating)

        this.props.onCreate({
            ...whiskeyCard,
        })

        this.setState({
            open: false,
            whiskeyCard: {
                name: '',
                company: '',
                type: '',
                age: '',
                origin: '',
                flavor: '',
                description: '',
                rating: ''
            }
        })
    }

    render() {
        const { open, whiskeyCard: { name, company, type, age, origin, flavor, description, rating } } = this.state,
            { classes } = this.props

        return (
            <Fragment>
                <Fab aria-label="Add" onClick={this.handleToggle}>
                    <AddIcon />
                </Fab>

                <Dialog
                    open={open}
                    onClose={this.handleToggle}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create New Whiskey</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill out the form below.
                        </DialogContentText>
                        <form>
                            <TextField
                                id='id_name_create'
                                label="Name"
                                value={name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_company_create'
                                label="Company"
                                value={company}
                                onChange={this.handleChange('company')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_type_create'
                                label="Type"
                                value={type}
                                onChange={this.handleChange('type')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_age_create'
                                label="Age"
                                value={age}
                                onChange={this.handleChange('age')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_origin_create'
                                label="Origin"
                                value={origin}
                                onChange={this.handleChange('origin')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_flavor_create'
                                label="Flavor"
                                value={flavor}
                                onChange={this.handleChange('flavor')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_description_create'
                                multiline
                                rows='3'
                                label="Description"
                                value={description}
                                onChange={this.handleChange('description')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_rating_create'
                                label="Rating"
                                value={rating}
                                onChange={this.handleChange('rating')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                        id='id_button_create'
                            color="primary"
                            variant='contained'
                            onClick={this.handleSubmit}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            
            </Fragment>
        )
    }
}
)
