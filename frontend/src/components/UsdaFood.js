import React, { useState, useEffect } from 'react';
import TrackFoodPopup from './TrackFoodPopup.js';
import NutritionInfoPopup from './NutritionInfoPopup.js';
import TrackCheckedFoodsPopup from './TrackCheckedFoodsPopup.js';
import CombineFoodsPopup from './CombineFoodsPopup.js';

// TODO:
// Extract all the nutrition info from the USDA database searches, right now we just do names
// Maybe capitalize the names of the foods so they look nicer in search

// TODO:
// Add button operations for all the usda foods

function UsdaFood()
{
    var searchText;

    // This will dynamically keep track of which food's checkboxes have been selected
    const [checkedSet, setCheckedSet] = useState(new Set());

    const [foods, setFoods] = useState([]);   
    const [selectedFoodInfo, setSelectedFoodInfo] = useState({});
    const [trackFoodPopupState, setTrackFoodPopupState] = useState(false);
    const [nutritionInfoPopupState, setNutritionInfoPopupState] = useState(false);

    const [trackCheckedFoodsPopupState, setTrackCheckedFoodsPopupState] = useState(false);
    const [combineFoodsPopupState, setCombineFoodsPopupState] = useState(false);

    const api_key = 'Qu6XqYJAL6VNG2ABuikfQizM7hXNKQjm5TfEOFGi';

    // Keeps track of all the nutrional values' assigned numbers
    const nutritionNumbers = new Map([
        ['calories', '208'],
        ['protein', '203'],
        ['carbs', '205'],
        ['fat', '204'],
        ['fiber', '291'],
        ['sugar', '269'],
        ['sodium', '307'],
        ['cholesterol', '601']
    ]);

    // 1 food calorie(kCal) === 4.1868 KJ
    const kJConversionRate = 4.1868;

    const mgToG = .0001;
    const gToMg = 1000;

    // Searches if selected food has the specified nutritional value and returns index in the nutrients array;
    // returns -1 if the nutrient is not found for this food
    function findNutrtionalValueIndex(nutrients, nutritionNumber)
    {
        let i;

        for (i = 0; i < nutrients.length; i++)
        {
            if (nutrients[i].nutrientNumber === nutritionNumber)
                return i;
        }

        return -1;
    }

    // Extracts nutritional data from usda database for popups
    function obtainFoodInfo(selectedFood)
    {
        let name, calories, protein, carbs, fat, fiber, sugar, sodium, cholesterol;
        let index;
        
        if (selectedFood.lowercaseDescription)
            name = selectedFood.lowercaseDescription;
        else
            name = selectedFood.description;
        
        // Retrieve calories if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('calories'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'kJ')
                calories = selectedFood.foodNutrients[index].value / kJConversionRate;
            else
                calories = selectedFood.foodNutrients[index].value;
        }
        else
        {
            calories = 0;
        }

        // Retrieve protein if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('protein'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'MG')
                protein = selectedFood.foodNutrients[index].value * mgToG;
            else
                protein = selectedFood.foodNutrients[index].value;
        }
        else
        {
            protein = 0;
        }

        // Retrieve carbs if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('carbs'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'MG')
                carbs = selectedFood.foodNutrients[index].value * mgToG;
            else
                carbs = selectedFood.foodNutrients[index].value;
        }
        else
        {
            carbs = 0;
        }

        // Retrieve fat if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('fat'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'MG')
                fat = selectedFood.foodNutrients[index].value * mgToG;
            else
                fat = selectedFood.foodNutrients[index].value;
        }
        else
        {
            fat = 0;
        }

        // Retrieve fiber if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('fiber'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'MG')
                fiber = selectedFood.foodNutrients[index].value * mgToG;
            else
                fiber = selectedFood.foodNutrients[index].value;
        }
        else
        {
            fiber = 0;
        }

        // Retrieve sugar if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('sugar'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'MG')
                sugar = selectedFood.foodNutrients[index].value * mgToG;
            else
                sugar = selectedFood.foodNutrients[index].value;
        }
        else
        {
            sugar = 0;
        }

        // Retrieve sodium if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('sodium'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'G')
                sodium = selectedFood.foodNutrients[index].value * gToMg;
            else
                sodium = selectedFood.foodNutrients[index].value;
        }
        else
        {
            sodium = 0;
        }

        // Retrieve cholesterol if found
        index = findNutrtionalValueIndex(selectedFood.foodNutrients, nutritionNumbers.get('cholesterol'));
        if (index !== -1)
        {
            if (selectedFood.foodNutrients[index].unitName === 'G')
                cholesterol = selectedFood.foodNutrients[index].value * gToMg;
            else
                cholesterol = selectedFood.foodNutrients[index].value;
        }
        else
        {
            cholesterol = 0;
        }


        let servingLabel;
        let servingSizeCoversionRate;
        
        if (selectedFood.servingSize)
        {
            servingLabel = selectedFood.servingSize + selectedFood.servingSizeUnit;

            // Now adjust nutrition info to fit given serving size
            servingSizeCoversionRate = selectedFood.servingSize / 100;

            calories *= servingSizeCoversionRate;
            protein *= servingSizeCoversionRate;
            carbs *= servingSizeCoversionRate;
            fat *= servingSizeCoversionRate;
            fiber *= servingSizeCoversionRate;
            sugar *= servingSizeCoversionRate;
            sodium *= servingSizeCoversionRate;
            cholesterol *= servingSizeCoversionRate;
        }
        // Custom portion was sepcified so grab that
        else if (selectedFood.foodMeasures.length > 0)
        {
            servingLabel = selectedFood.foodMeasures[0].disseminationText + " (" + selectedFood.foodMeasures[0].gramWeight + "g)";

            // Now adjust nutrition info to fit given serving size
            servingSizeCoversionRate = selectedFood.foodMeasures[0].gramWeight / 100;

            calories *= servingSizeCoversionRate;
            protein *= servingSizeCoversionRate;
            carbs *= servingSizeCoversionRate;
            fat *= servingSizeCoversionRate;
            fiber *= servingSizeCoversionRate;
            sugar *= servingSizeCoversionRate;
            sodium *= servingSizeCoversionRate;
            cholesterol *= servingSizeCoversionRate;
        }
        // If no serving size or portion is defined then the USDA says the nutrient info should be for 100g/100ml of that food
        else
        {
            servingLabel = "100g";
        }


        // Round nutrition values
        calories = Math.round(calories);
        sodium = Math.round(sodium);
        cholesterol = Math.round(cholesterol);
        if (carbs < 10)
            carbs = Math.round(carbs * 10) / 10;
        else
            carbs = Math.round(carbs);
        if (fat < 10)
            fat = Math.round(fat * 10) / 10;
        else
            fat = Math.round(fat);
        if (fiber < 10)
            fiber = Math.round(fiber * 10) / 10;
        else
            fiber = Math.round(fiber);
        if (protein < 10)
            protein = Math.round(protein * 10) / 10;
        else
            protein = Math.round(protein);
        if (sugar < 10)
            sugar = Math.round(sugar * 10) / 10;
        else
            sugar = Math.round(sugar);


        let _ud = localStorage.getItem('user_data');
	    let ud = JSON.parse(_ud);
        let userId = ud.id;

        let newFoodId = "USDA" + selectedFood.fdcId;

        // Reformat into food json for our database
        var food = { 
            Calories:calories,
            Carbs:carbs,
            Cholesterol:cholesterol,
            Fat:fat,
            Fiber:fiber,
            Name:name,
            Protein:protein,
            Sodium:sodium,
            Sugar:sugar,
            UserId:userId,
            __v:0,
            _id:newFoodId,
            ServingLabel:servingLabel
        };
        
        return food;
    }

    // Sets value to true to open popup where that food's quantity can be set and then decided to be tracked
    function showTrackFoodPopup(selectedFood)
    {
        setTrackFoodPopupState(true);
        setSelectedFoodInfo(obtainFoodInfo(selectedFood));
    }

    // Sets value to true to display nutrition info of whatever food was selected
    function showInfoPopup(selectedFood)
    {
        setNutritionInfoPopupState(true);
        setSelectedFoodInfo(obtainFoodInfo(selectedFood));
    }

    // Sets value to true to open popup where all of the checked foods can be tracked
    function showTrackCheckedFoodsPopup()
    {
        setTrackCheckedFoodsPopupState(true);
    }

    // Sets value to true to open popup where all of the checked foods can be combined
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
        let newMealId = "USDA" + mealId;

        if (checkedSet.has(newMealId))
            checkedSet.delete(newMealId);
        else
            checkedSet.add(newMealId);
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

        try 
        {
            var html = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=' + api_key + '&query=' + searchString + '&pageSize=20';
            const response = await fetch(html, {method:'GET', headers:{'Content-Type': 'application/json'}});
            var resText = await response.text();
            var res = JSON.parse(resText);
            res = res.foods

            // Remove any foods that were previously checked but are not
            // displayed anymore after the new search
            let tempSet = new Set();
            for (let i = 0; i < res.length; i++)
            {
                let foodId = "USDA" + res[i].fdcId;
                if (checkedSet.has(foodId))
                    tempSet.add(foodId);
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
            <input type="text" id="searchText" placeholder="Search Here" onKeyUp={doSearchFoods} ref={(c) => searchText = c} /><br />

            <ul>
                {foods.map(food => (
                    <li key={food.fdcId}>
                        <input type="checkbox" id="selectFood" class="checkboxes" onChange={() => handleCheckboxChange(food.fdcId)}></input>
                        <span>{food.lowercaseDescription}</span>
                        <button type="button" id="addFoodToDailyConsumptionButton" class="buttons" onClick={() => showTrackFoodPopup(food)} > Add </button>
                        <button type="button" id="viewNutritionInfoButton" class="buttons" onClick={() => showInfoPopup(food)} > View </button>
                    </li>
                ))}
            </ul>
            <TrackFoodPopup show={trackFoodPopupState} food={selectedFoodInfo} closePopup={hideTrackFoodPopup} />
            <NutritionInfoPopup show={nutritionInfoPopupState} food={selectedFoodInfo} closePopup={hideInfoPopup} /> 

            <TrackCheckedFoodsPopup show={trackCheckedFoodsPopupState} foodIds={checkedSet} closePopup={hideTrackCheckedFoodsPopup} />
            <button type="button" id="trackCheckedFoodsButton" class="buttons" onClick={showTrackCheckedFoodsPopup}> Track Selected Foods </button>

            <CombineFoodsPopup show={combineFoodsPopupState} foodIds={checkedSet} unconvertedFoods={foods} convertFood={obtainFoodInfo} closePopup={hideCombineFoodsPopup} />
            <button type="button" id="combineFoodsButton" class="buttons" onClick={showCombineFoodsPopup}> Combine Selected Foods </button>
        </div>
    );
};
export default UsdaFood;