import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import NutritionInfoPopup from './NutritionInfoPopup.js';

function useOutsideAlerter(ref, setEditFoodId) 
{
    useEffect(() => {
      //Alert if clicked on outside of edit quantity text box
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setEditFoodId(-1);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}

function ListTrackedFoods(props)
{
    const [editFoodId, setEditFoodId] = useState(-1);
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);

    const wrapperRef = useRef(null);

    // Array that defines what each meal's corresponding int value is
    const mealValues = ["Other", "Breakfast", "Lunch", "Dinner", "Snack"];

    // This will keep track of whatever the user types in the input field
    var inputQty;

    useOutsideAlerter(wrapperRef, setEditFoodId);

    async function doUpdateQuantity(foodId)
    {
        // Closes the input field
        setEditFoodId(-1);

        let newQty = inputQty.value;

        // Invalid quanitity so don't do anything
        if (newQty <= 0)
        {
            props.setMessage("Please enter a quantity greater than 0.");
            return;
        }

        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        let food = null;
        for (let i = 0; i < props.foods.length; i++)
        {
            if (foodId === props.foods[i]._id)
            {
                food = props.foods[i];
            }
        }

        // Just in case
        if (food === null)
        {
            return;
        }

        // create object from text boxes and make JSON 
        var obj = {
            trackedMealId:food._id,
            Quantity:newQty, 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        try
        {   
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/editTrackMealQty/'),{method:'POST', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (!res.jwtToken)
            {
                props.setMessage(res.error);
                return;
            }
            // Token was expired
            else if (res.jwtToken.length === 0)
            {
                alert("Your session has expired, please log in again.");
                localStorage.removeItem("user_data")
		        window.location.href = '/';
                return;
            }

            storage.storeToken(res.jwtToken);
            
            if(res.error.length > 0)
            {
                props.setMessage(res.error);
            }
            else
            {
                props.retrieveTrackedFoods(props.currentDate);
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    async function doUntrackFood(foodId)
    {
        // Get jwt token from local storage
        var storage = require('../tokenStorage.js');
        var tok = storage.retrieveToken();

        // Clear any existing message
        props.setMessage('');

        var obj = { 
            jwtToken:tok
        }
        var js = JSON.stringify(obj);

        try
        {   
            // Send off package to api and await response 
            var bp = require('./Path.js');
            const response = await fetch(bp.buildPath('api/deletetracked/' + foodId),{method:'DELETE', body:js, headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            if (!res.jwtToken)
            {
                props.setMessage(res.error);
                return;
            }
            // Token was expired
            else if (res.jwtToken.length === 0)
            {
                alert("Your session has expired, please log in again.");
                localStorage.removeItem("user_data")
		        window.location.href = '/';
                return;
            }

            storage.storeToken(res.jwtToken);
            
            if(res.error.length > 0)
            {
                props.setMessage(res.error);
            }
            else
            {
                await props.retrieveTrackedFoods(props.currentDate);
            }
        }
        catch(e)
        {
            console.log(e.toString());
            return;
        }
    }

    // Sets value to true to display nutrition info of whatever food was selected
    function showInfoPopup(selectedFood)
    {
        props.setMessage('');
        setNutritionInfoPopupState(true);
        setSelectedFoodInfo(selectedFood);
    }

    // Sets value to false to close nutrtion info popup
    function hideInfoPopup()
    {
        setNutritionInfoPopupState(false);
        setSelectedFoodInfo({});
    }

    function handleOpeningInput(id)
    {
        props.setMessage("");
        setEditFoodId(id);
    }

    // Prevents negative values from being typed in
    const preventInvalid = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    var style =
    {
        padding: '10px', 
        display: 'flex', 
        'textAlign':'center', 
        'justifyContent':'center', 
        'alignItems':'center',
        width: '100%'
    }

    // Simply just displays all the foods retrieved in a nice list format
    return(
        <div>
            <Row>
                <Card style={{backgroundColor: '#35394a', padding: '10px', width:"100%", display: 'flex'}}>
                <Card.Body style={style}>
                    <ListGroup className = 'mb-3' style={{height: '75vh', width:'100%', 'overflow-y': 'scroll'}}>
                        <ListGroup horizontal >
                            <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#848FA5'}} >
                                <span>Decription</span>
                            </ListGroup.Item>
                            <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#848FA5'}} >
                                <span>Amount</span>
                            </ListGroup.Item>
                            <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#848FA5'}} >
                                <span>Calories</span>
                            </ListGroup.Item>
                            <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#848FA5'}} >
                                <span>Meal</span>
                            </ListGroup.Item>
                            <ListGroup.Item style={{width: '100%', padding:'1px', backgroundColor:'#848FA5'}} >
                                <span></span>
                            </ListGroup.Item>
                        </ListGroup>
                        {props.foods.map(food => (
                            <ListGroup horizontal style = {{width:'100%', borderStyle:'solid', borderColor:'#35394a'}} key={food._id}>
                                <ListGroup.Item style={{width: '100%', textAlign: 'left', display:'flex', alignItems:'center', color:'black'}} variant='success'>
                                    <span>{food.Name = food.Name.split(" ").map((w) => { return w[0].toUpperCase() + w.substring(1); }).join(" ")}</span>
                                </ListGroup.Item>
                                <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', color:'black'}} variant='success'>
                                    {(editFoodId !== food._id) ? <span style={{cursor:'pointer'}} onClick={() => handleOpeningInput(food._id)}> {food.Quantity} </span> 
                                                        : <div ref={wrapperRef}><input type="number" placeholder={food.Quantity} defaultValue={food.Quantity} min="0" onKeyPress={preventInvalid} ref={(c) => inputQty = c} ></input><Button variant='primary' className='m-3' onClick={() => doUpdateQuantity(food._id)} > Save </Button></div>}
                                </ListGroup.Item>
                                <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', color:'black'}} variant='success'>
                                    <span>{food.Quantity * food.Calories}</span>
                                </ListGroup.Item>
                                <ListGroup.Item style={{width: '100%', display:'flex', alignItems:'center', justifyContent:'center', color:'black'}} variant='success'>
                                    <span>{mealValues[food.Category]}</span>
                                </ListGroup.Item>
                                <ListGroup.Item style={{width: '100%', padding:'1px'}} variant='dark'>
                                    <Button variant='success' className='m-3' onClick={() => showInfoPopup(food)} > View </Button>
                                    <Button variant='success' className='m-3' onClick={() => doUntrackFood(food._id)} > Untrack </Button><br/>
                                </ListGroup.Item>
                            </ListGroup>
                        ))}
                    </ListGroup>
                </Card.Body>
                </Card>
            </Row>
            <Row>
                <NutritionInfoPopup show={nutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideInfoPopup} />
            </Row>
        </div>
    );
};
export default ListTrackedFoods;