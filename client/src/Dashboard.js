import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ setAuth }) => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setAuth(false); // If token doesn't exist, user is not authenticated
            return;
        }

        const fetchBalance = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/balance`, {
                    headers: { 'x-auth-token': token }
                });
                setBalance(res.data.virtualBalance);
                setLoading(false); // Set loading state to false after fetching balance
            } catch (err) {
                console.error('Error fetching balance:', err);
                setLoading(false); // Set loading state to false even on error
            }
        };

        fetchBalance();
    }, [setAuth, token]); // Added token as a dependency

    const handleDeposit = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/deposit`, { amount: parseFloat(amount) }, {
                headers: { 'x-auth-token': token }
            });
            setBalance(balance + parseFloat(amount));
        } catch (err) {
            console.error('Error during deposit:', err);
        }
    };

    const handleWithdraw = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/withdraw`, { amount: parseFloat(amount) }, {
                headers: { 'x-auth-token': token }
            });
            setBalance(balance - parseFloat(amount));
        } catch (err) {
            console.error('Error during withdraw:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setAuth(false);
    };

    if (!token) {
        // If token doesn't exist, redirect to login
        return window.location.replace('/login');
    }

    if (isLoading) {
        // Show loading message until balance is fetched
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {username}</p>
            <p>Balance: {balance}</p>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <button onClick={handleDeposit}>Deposit</button>
            <button onClick={handleWithdraw}>Withdraw</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
