import React, {Component} from 'react';
import './UserAuth.css';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from "reactstrap";
import axios from 'axios';
import classnames from 'classnames';
import whisk from '../img/whiskedinlogo.png';

import API_URL from '../index'


export default class UserAuth extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            username: '',
            email: '',
            password: '',
            error: ''
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleUsernameChange = event => {
        this.setState({username: event.target.value});
    };

    handlePasswordChange = event => {
        this.setState({password: event.target.value});
    };

    handleEmailChange = event => {
        this.setState({email: event.target.value});
    };

    handleLoginSubmit = event => {
        event.preventDefault();

        // Creating form to be sent to API
        const data = new FormData();
        data.append('username', this.state.username);
        data.append('password', this.state.password);

        // Contacting API to validate user password
        // eslint-disable-next-line no-useless-concat
        axios.post(API_URL + `/login`, data)
            .then(res => {
                if (res.data["access_token"]) {
                    localStorage.setItem('user', JSON.stringify(res.data["access_token"]));
                    this.props.history.push("/homepage")
                }

            }).catch( res => {
                const err = document.getElementById('id_invalid_user');
                err.style.visibility = "visible";
                err.innerText = "Invalid username or password";
                // show error
            })
    };

    handleSignUpSubmit = event => {
        event.preventDefault();

        // Creating form to be sent to API
        const data = new FormData();
        data.append('username', this.state.username);
        data.append('password', this.state.password);

        // Contacting api to add new user
        // eslint-disable-next-line no-useless-concat
        axios.post(API_URL + `/register`, data)
            .then(res => {
                console.log(res);
                console.log(res.data);
                localStorage.setItem('user', JSON.stringify(res.data['access_token']));
                this.props.history.push('/homepage');
            }).catch( res => {
                const err = document.getElementById('id_existing_user');
                err.style.visibility = "visible";
                err.innerText = "Username already exists";
                // show error
        })
    };


    render() {
        return (
            <div className="UserAuth-logo">
                <img src={whisk} className="UserAuth-logo" alt=""/>
                <div className="UserAuth-tabs">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '1'})}
                                onClick={() => {
                                    this.toggle('1');
                                }} id='id_sign_in'
                            >
                                Login
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '2'})}
                                onClick={() => {
                                    this.toggle('2');
                                }} id={'id_sign_up'}
                            >
                                Sign-Up
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <div className="bork-logo">
                                        <div className="UserAuth">
                                            <p className="error" id="id_invalid_user"></p>
                                            <Form onSubmit={this.handleLoginSubmit} className="login">
                                                <FormGroup>
                                                    <Label for="username">Username</Label>
                                                    <Input
                                                        type="username"
                                                        name="username"
                                                        id="UserAuth-username_login"
                                                        placeholder="Enter username"
                                                        onChange={this.handleUsernameChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="examplePassword">Password</Label>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="UserAuth-password_login"
                                                        placeholder="Enter password"
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                </FormGroup>
                                                <Button id="id_signin_button">Login</Button>
                                            </Form>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    <div className="bork-logo">
                                        <div className="UserAuth">
                                            <p className="error" id="id_existing_user"></p>
                                            <Form onSubmit={this.handleSignUpSubmit} className="sign-up">
                                                <FormGroup>
                                                    <Label for="username">Username</Label>
                                                    <Input
                                                        type="username"
                                                        name="username"
                                                        id="UserAuth-username_sign_up"
                                                        placeholder="Enter username"
                                                        onChange={this.handleUsernameChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="examplePassword">Password</Label>
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        id="UserAuth-password_sign_up"
                                                        placeholder="Enter password"
                                                        onChange={this.handlePasswordChange}
                                                    />
                                                </FormGroup>
                                                <Button id='id_sign_up_button'>Sign-Up</Button>
                                            </Form>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        );
    }
}


