import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import LoginPage from './components/login.jsx';
import Upload from './components/upload.jsx';
import PriceEstimator from './components/price_estim.jsx';  
import CompareContracts from './components/compre_file.jsx';

function App(){

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/upload' element={<Upload />}/> 
        <Route path='/price-estimator' element={<PriceEstimator />}/>
        <Route path='/compare-contracts' element={<CompareContracts />}/>
      </Routes>
    </BrowserRouter>
  );

}

export default App;