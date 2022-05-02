import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Form, ListGroup, Row } from 'react-bootstrap';
import TrackFoodPopup from './TrackFoodPopup.js';
import NutritionInfoPopup from './NutritionInfoPopup.js';
import EditNutritionInfoPopup from './EditNutritionInfoPopup.js';
import DeleteFoodPopup from './DeleteFoodPopup.js';
import TrackCheckedFoodsPopup from './TrackCheckedFoodsPopup.js';
import CombineFoodsPopup from './CombineFoodsPopup.js';

function YourFood()
{
    var searchText;

    // This will dynamically keep track of which food's checkboxes have been selected
    const [checkedSet, setCheckedSet] = useState(new Set());

    const [foods, setFoods] = useState([]);
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});

    const [trackFoodPopupState, setTrackFoodPopupState] = useState(false);
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);
    const [editNutritionInfoPopupState, setEditNutritionInfoPopupState] = useState(false);
    const [deleteFoodPopupState, setDeleteFoodPopupState] = useState(false);

    const [trackCheckedFoodsPopupState, setTrackCheckedFoodsPopupState] = useState(false);
    const [combineFoodsPopupState, setCombineFoodsPopupState] = useState(false);

    // Sets value to true to open popup where that food's quantity can be set and then decided to be tracked
    function showTrackFoodPopup(selectedFood)
    {
        setTrackFoodPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to true to display nutrition info of whatever food was selected
    function showInfoPopup(selectedFood)
    {
        setNutritionInfoPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to true to display nutrition info of whatever food was selected for user to edit
    function showEditInfoPopup(selectedFood)
    {
        setEditNutritionInfoPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to true to confirm if user really wants to delete this food from their list
    function showDeleteFoodPopup(selectedFood)
    {
        setDeleteFoodPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to true to open popup where all of the checked foods can be tracked
    function showTrackCheckedFoodsPopup()
    {
        setTrackCheckedFoodsPopupState(true);
    }

    // Sets value to true to open popup where all of the checked foods can be combined into one food/meal
    function showCombineFoodsPopup()
    {
        setCombineFoodsPopupState(true);
    }

    // Sets value to false to close track food popup
    function hideTrackFoodPopup(setMessage, setTrackQuantity, setCategory)
    {
        setMessage("");
        setTrackQuantity(1);
        setCategory("0");
        setTrackFoodPopupState(false);
        setSelectedFoodInfo({});
    }

    // Sets value to false to close nutrtion info popup
    function hideInfoPopup()
    {
        setNutritionInfoPopupState(false);
        setSelectedFoodInfo({});
    }

    // Sets value to false to close edit info popup
    async function hideEditInfoPopup(didEditFood, setDidEditFood, setMessage)
    {
        // If any food's info was edited, need to refresh the list
        if (didEditFood)
        {
            await doSearchFoods();
            setDidEditFood(false);
        }

        setMessage("");
        setEditNutritionInfoPopupState(false);
        setSelectedFoodInfo({});
    }

    async function hideDeleteFoodPopup()
    {
        await doSearchFoods();

        setDeleteFoodPopupState(false);
        setSelectedFoodInfo({});
    }

    function hideTrackCheckedFoodsPopup(setMessage, setTrackQuantity, setCategory)
    {
        setMessage("");
        setTrackQuantity(1);
        setCategory("0");
        setTrackCheckedFoodsPopupState(false);
    }

    async function hideCombineFoodsPopup(setMessage, setFoodName)
    {
        await doSearchFoods();

        setMessage("");
        setFoodName("");
        setCombineFoodsPopupState(false);
    }

    function handleCheckboxChange(mealId)
    {
        if (checkedSet.has(mealId))
            checkedSet.delete(mealId);
        else
            checkedSet.add(mealId);
    }

    async function doSearchFoods() 
    {
        let searchString;

        // Default to empty search
        if (searchText === undefined || searchText === null)
        {
            searchString = "";
        }
        else
        {
            searchString = searchText.value;
        }

        var userData = JSON.parse(localStorage.getItem('user_data'));
        var userId = userData.id;

        // If search text is empty don't even pass it to the api
        let routeEnd;
        if (searchString.length === 0)
        {
            routeEnd = userId;
        }
        else 
        {
            routeEnd = userId + "/" + searchString;
        }

        try 
        {
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath("api/filtersearch/" + routeEnd),{method:'GET', headers:{'Content-Type': 'application/json'}});
            var resText = await response.text();

            // No foods found so empty array to display
            if (resText === "No meal matching that name was found.")
            {
                // If no foods were found and set of cheked foods was not
                // empty then clear the set
                if (checkedSet.size > 0)
                    checkedSet.clear();

                setFoods([]);
                return;
            }

            var res = JSON.parse(resText);

            // Remove any foods that were previously checked but are not
            // displayed anymore after the new search
            let tempSet = new Set();
            for (let i = 0; i < res.length; i++)
            {
                if (checkedSet.has(res[i]._id))
                    tempSet.add(res[i]._id);
            }
            // Used two loops here to reduce runtime to linear O(m + n) where m is
            // length of returned food array and n is length of items in checked set
            // More code complexity but faster than O(mn) search every time
            checkedSet.clear();
            tempSet.forEach(mealId => {
                if (mealId)
                    checkedSet.add(mealId);
            });

            // Update array with the new foods found from the search
            let num;
            for (num in res) // Declan is a js wizard because this worked first try
            {
                let word = res[num].Name;
                word = word.split(" ").map((word) => { 
                    return word[0].toUpperCase() + word.substring(1); 
                }).join(" ");
                res[num].Name = word;
            }
            setFoods(res);
            return;
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        } 
    }
    
    // Initialize list of foods on page
    useEffect(() => {
        doSearchFoods();
    }, []);
      
    return(
        <div>
            <Form >
                <Form.Control className='mx-auto' style={{width: 'min(800px, 50vw)'}} type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} />
            </Form>

            <ListGroup className = 'mb-3' style={{height: '50vh', 'overflow-y': 'scroll'}}>
                {foods.map(food => (
                    <ListGroup horizontal>
                        <ListGroup.Item style={{width: '100%', textAlign: 'left'}} key={food._id} variant='success'>
                            <input type="checkbox" id="selectFood" onChange={() => handleCheckboxChange(food._id)}></input>
                            <span> {food.Name}</span>
                        </ListGroup.Item>
                        <ListGroup.Item style={{width: '45%'}} variant='dark'>
                            <Button size='sm' className='mx-1' variant='success' id="addFoodToDailyConsumptionButton" onClick={() => showTrackFoodPopup(food)} > Add </Button>
                            <Button size='sm' className='mr-1' variant='success' id="viewNutritionInfoButton" onClick={() => showInfoPopup(food)} > View </Button>
                            <Button size='sm' className='m-1' variant='success'  id="editNutritionInfoButton" onClick={() => showEditInfoPopup(food)}>Edit </Button>
                            <Button size='sm' className='mr-1' variant='success' id="deleteFoodButton" onClick={() => showDeleteFoodPopup(food)} >Delete </Button>
                        </ListGroup.Item>
                    </ListGroup>
                ))}
            </ListGroup>
            <TrackFoodPopup show={trackFoodPopupState} food={selectedFoodInfo} closePopup={hideTrackFoodPopup} />
            <NutritionInfoPopup show={nutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideInfoPopup} />
            <EditNutritionInfoPopup show={editNutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideEditInfoPopup} />
            <DeleteFoodPopup show={deleteFoodPopupState} food={selectedFoodInfo} closePopup={hideDeleteFoodPopup} />

            <TrackCheckedFoodsPopup show={trackCheckedFoodsPopupState} foodIds={checkedSet} foods={foods} closePopup={hideTrackCheckedFoodsPopup} />
            <Button className='mx-3' variant='success' id="trackCheckedFoodsButton" onClick={showTrackCheckedFoodsPopup}> Track Selected Foods </Button>

            <CombineFoodsPopup show={combineFoodsPopupState} foodIds={checkedSet} foods={foods} closePopup={hideCombineFoodsPopup} />
            <Button className='mx-auto' variant='success' id="combineFoodsButton" onClick={showCombineFoodsPopup}> Combine Selected Foods </Button>
        </div>
    );
};
export default YourFood;