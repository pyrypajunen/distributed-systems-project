import React, {Component} from 'react'
import tether from "../../src/tether.png"
import Airdrop from './Airdrop'

class Main extends Component {
    render() {
        return (
            <div id="content" className='mt-3'>
                <table className='table text-muted text-center'>
                    <thead>
                    <tr style={{color: 'black'}}>
                        <th scope='col'>Staking Balance</th>
                        <th scope='col'>Reward Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr style={{color: "black"}}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance)} USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance)} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-3' style={{opacity: '1.9'}}>
                    <form onSubmit={(event) => {
                            event.preventDefault()
                            let amount,duration
                            amount = this.input.value.toString()
                            amount = window.web3.utils.toWei(amount, 'ether')
                            duration = this.duration.value
                            console.log(amount, duration)
                            this.props.stakeTokens(amount,duration)
                        }}
                     className='mb-3'>
                        <div style={{borderSpace: '0 1em'}}>
                            <label className='float-left' style={{marginLeft: '15px'}}><b>Stake Tokens</b></label>
                            <span className='float-right' style={{marginRight: '8px'}}>
                                 Balance: {window.web3.utils.fromWei(this.props.tetherBalance)}
                            </span>
                            <div className='input-group mb-4'>
                                <input
                                ref={(input) => {this.input = input}} 
                                type='text' 
                                placeholder='0' 
                                required/>
                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img alt='tether' src={tether} height='34'/>
                                        &nbsp;&nbsp;USDT
                                    </div>
                                </div>
                            </div>
                            <div className='input-group mb-4'>
                                <input
                                ref={(input) => {this.duration = input}} 
                                type='text' 
                                placeholder='0' 
                                required/>
                                <div className='input-group-open'>
                                    seconds
                                </div>
                            </div>
                            <button type='submit' class='btn btn-primary btn-lg btn-block"'>Stake</button>
                        </div>
                    </form>
                    <button
                    onClick={(event) => {
                        event.preventDefault()
                        this.props.unstakeTokens()
                    }}
                     type='submit' className='btn btn-primary btn-lg btn-block"'>Withdraw</button>
                    <div className='card-body text-center' style={{color:'blue'}}>
                        AIRDROP <Airdrop stakingBalance={this.props.stakingBalance}
                        issueTokens={this.props.issueTokens}/> 
                        {console.log("Come here")}
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;