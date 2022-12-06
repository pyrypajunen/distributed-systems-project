/// This is the main file

import React, {Component} from 'react'
import Web3 from 'web3'
import './App.css'
import NavBar from './Navbar'


class App extends Component {

    // call loadWeb3 function before anoything else "Way to conncet your wallet to app"
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockData() // reads crypto wallet account
    }
    
    async loadWeb3() {
        if (window.ethereum) {
            // make a new instance of web3, wait and enable it
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('404! Check out MetaMask!!')

        }
    }

    async loadBlockData() {
        const web3 = window.web3
        const userWallet = await web3.eth.getAccounts()
        console.log(userWallet)
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0' // just a place holder for accounts
        }
    }

    render() {
        return (
            <div>
                <NavBar account = {this.state.account} />
                    <div className='text-center'>
                        <h1></h1>
                    </div>
            </div>
            
        )
    }

}

export default App;