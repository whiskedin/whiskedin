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
                <Card style={{maxWidth:500}} id="id_whisk_card">
                    <CardContent>
                        <Typography id='id_name' gutterBottom variant="headline" component="h6" style={{display: 'inline-block', paddingInlineEnd:50}}>
                            {this.props.card.name}
                        </Typography>
                        <Typography id='id_brand' gutterBottom variant="headline" component="h6" style={{display: 'inline-block'}}>
                            {this.props.card.company}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        id='id_img'
                        style={{height:0, paddingTop: '56.25%'}}
                        image={require('../img/whiskedinlogo.png')}
                        title="Whiskedin Logo"
                    />
                    <CardContent>
                        <Typography id='id_type' gutterBottom variant="headline" component="h6" style={{display: 'inline-block', paddingInlineEnd:50}}>
                            {this.props.card.type}
                        </Typography>
                        <Typography id='id_age' gutterBottom variant="headline" component="h6" style={{display: 'inline-block'}}>
                            {this.props.card.age}
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <Typography id='id_origin' gutterBottom variant="headline" component="h6" style={{display: 'inline-block', paddingInlineEnd:50}}>
                            {this.props.card.origin}
                        </Typography>
                        <Typography id='id_flavor' gutterBottom variant="headline" component="h6" style={{display: 'inline-block'}}>
                            {this.props.card.flavor}
                        </Typography>
                        <Typography id='id_description' gutterBottom variant="headline" component="h6" >
                            {this.props.card.description}
                        </Typography>
                        <Typography id='id_rating' gutterBottom variant="headline" component="h6" >
                            {this.props.card.rating}
                        </Typography>

                        </CardContent>
                        <CardActions style={{justifyContent: 'center'}}>
                            <Button id='id_share_button' size="small" color="primary">
                                Share
                            </Button>
                        </CardActions>

                    </Card>
                </div>
            )
        }

}