import React from 'react';
import './HomePage';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

export default class WhiskeyCard extends React.Component {
    render(){
        return (
            <div>
                <Card style={{maxWidth:500}}>
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h6" style={{display: 'inline-block', paddingInlineEnd:50}}>
                            {this.props.card.Name}
                        </Typography>
                        <Typography gutterBottom variant="headline" component="h6" style={{display: 'inline-block'}}>
                            {this.props.card.Brand}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        style={{height:0, paddingTop: '56.25%'}}
                        image={require('../img/whiskedinlogo.png')}
                        title="Whiskedin Logo"
                        />
                    <CardActions style={{justifyContent: 'center'}}>
                        <Button size="small" color="primary" >
                        Share
                        </Button>
                    </CardActions>
                            
                </Card> 
            </div>        
        )
    }
}