import React, {Component} from 'react'
import './App.css'


class NavBar extends Component {
    // all react code here
    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style = {{backgroundColor: 'black', height: ' 50px', padding: '20px'}}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0'
                style={{color:'white'}}> Yield Farming Dapp</a>
                <ul className='navbar-nav px-3'>
                    <li className='text-nowrap d-none nav-item d-sm-none d-sm-block'>
                        <small id='' style={{color: 'white'}}> Your Crypto Wallet Address: {this.props.account}

                        </small>
                    </li>
                </ul>
            </nav>
        )
    }

}

export default NavBar;