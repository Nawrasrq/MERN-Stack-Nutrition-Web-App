import React from 'react';
import { Button, Container } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import WeightDisplay from '../components/WeightDisplay';

function ProgressPage()
{   
    return(
        <div>
            <NavigationBar />
            <WeightDisplay />
        </div>
    );
};

export default ProgressPage;