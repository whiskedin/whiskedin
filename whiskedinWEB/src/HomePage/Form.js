import React, { Fragment, Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { Edit } from '@material-ui/icons';
import { ListItemSecondaryAction, IconButton } from '@material-ui/core';

const styles = theme => ({
    FormControl: {
        width: 500
    }
})

export default withStyles(styles)  (class extends Component {

    state = this.getInitState()

    getInitState() {
        const { whiskey } = this.props

        return (
            whiskey ? {open: false, whiskey: whiskey}
            : {open: false, whiskey: {
                name: '',
                company: '',
                type: '',
                age: '',
                origin: '',
                flavor: '',
                description: '',
                rating: ''
            }}
        )
    }

    handleToggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    handleChange = name => ({target: {value}}) => {
        this.setState({
            whiskey: {
                ...this.state.whiskey,
                [name]: value
            }
        })
    }

    handleSubmit = () => {
        //TODO: validate

        const { whiskey } = this.state
        whiskey.age = parseInt(whiskey.age)
        whiskey.rating = parseInt(whiskey.rating)

        this.props.onEdit({
            ...whiskey,
        })
    }

    handleEdit = () => {
        this.handleSubmit()
        this.handleToggle()
    }

    render() {
        const { open, whiskey: { name, company, type, age, origin, flavor, description, rating } } = this.state,
            { classes } = this.props

        return (
            <Fragment>
                <ListItemSecondaryAction>
                    <IconButton onClick={this.handleToggle}>
                        <Edit/>
                    </IconButton>
                </ListItemSecondaryAction>
                
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
                                id='id_name_edit'
                                label="Name"
                                value={name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_company_edit'
                                label="Company"
                                value={company}
                                onChange={this.handleChange('company')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_type_edit'
                                label="Type"
                                value={type}
                                onChange={this.handleChange('type')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_age_edit'
                                label="Age"
                                value={age}
                                onChange={this.handleChange('age')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_origin_edit'
                                label="Origin"
                                value={origin}
                                onChange={this.handleChange('origin')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_flavor_edit'
                                label="Flavor"
                                value={flavor}
                                onChange={this.handleChange('flavor')}
                                margin="normal"
                                className={classes.FormControl}
                            />
                            <br/>
                            <TextField
                                id='id_description_edit'
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
                                id='id_rating_edit'
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
                            id='id_button_edit'
                            color="primary"
                            variant='contained'
                            onClick={this.handleEdit}
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
