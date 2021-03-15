import React, { Component } from 'react'
import { resetPassword, changePassword } from './Cognito'

export default class Forgotpassword extends Component {
    constructor(props){
        super(props)
        this.enterVerificationCode = this.enterVerificationCode.bind(this)
        this.submitVerificationCode = this.submitVerificationCode.bind(this)
        this.submitName = this.submitName.bind(this)

        this.state = {
            showVerification: false,
            verificationCode: '',
            name: ''
        }
    }


    submitVerificationCode = (e) => {
        e.preventDefault()
        changePassword(this.state.name, this.state.verificationCode)
    }

    enterVerificationCode = (e) => {
        this.setState({verificationCode: e.target.value})
    }

    enterName = (e) => {
        this.setState({name: e.target.value})
    }

    submitName = (e) => {
        e.preventDefault()
        resetPassword(this.state.name)
        this.setState({showVerification: true})
    }

    render() {
        return (
            <div>
                {
                    this.state.showVerification ? (
                            <form onSubmit={this.submitVerificationCode}>
                                <input type="text" placeholder="verification code" value={this.state.verificationCode} onChange={this.enterVerificationCode}/>
                                <button type="submit"> Submit </button>
                            </form>
                    ) : (
                            <form onSubmit={this.submitName}>
                                <input type="text" placeholder="Name" value={this.state.name} onChange={this.enterName}/>
                                <button type="submit"> Submit </button>
                            </form> 
                        )
                }
            </div>
        )
    }
}
