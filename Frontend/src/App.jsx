import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages//HomePage/HomePage';
import Header from './components/Header/Header'; 

function App() {
    return(
        <Router>
            <Header /> 
            
            <main> 
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;