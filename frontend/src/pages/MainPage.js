import React from 'react';
import PageTitle from '../components/PageTitle';
import NavigationBar from '../components/NavigationBar';
import LoggedInName from '../components/LoggedInName';

function MainPage()
{
    return(
        <div>
            <PageTitle />
            <NavigationBar />
            <LoggedInName />
        </div>
    );
};

export default MainPage;