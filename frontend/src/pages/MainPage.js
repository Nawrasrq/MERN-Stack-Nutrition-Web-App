import React from 'react';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName'
const MainPage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
        </div>
    );
}
export default MainPage;