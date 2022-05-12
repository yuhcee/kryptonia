import { Welcome, Navbar, Footer, Services, Loader, Transactions } from './components';
import './App.css';
import { useState } from 'react';

const App = () => {
    return (
        <div className="min-h-screen">
            <div className="gradient-bg-welcome">
                <Navbar />
                <Welcome />
            </div>
            <Services />
            <Transactions />
            <Footer />
        </div>
    );
};

export default App;
