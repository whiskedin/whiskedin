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
            Name: '',
            Brand: ''
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

        this.props.onCreate({
            ...whiskeyCard,
            Idx: this.props.index
        })

        this.setState({
            open: false,
            exercise: {
                title: '',
                description: ''
            }
        })
    }

    render() {
        const { open, whiskeyCard: { name, brand } } = this.state,
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
                                label="Name"
                                value={name}
                                onChange={this.handleChange('Name')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                label="Brand"
                                value={brand}
                                onChange={this.handleChange('Brand')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="primary"
                            variant='raised'
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
